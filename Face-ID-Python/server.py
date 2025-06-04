import base64
import io
import cv2
from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS, cross_origin
from face_id_model import FaceIDModel
from utils.model_utils import detect_faces, extract_face_embedding
from utils.server_utils import ServerUtils
from PIL import Image
import numpy as np
import requests
import mysql.connector
from datetime import datetime
import websocket
import json
import threading

app = Flask(__name__)
# CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})
# CORS(app)
CORS(app, resources={r"/api/*": {
    "origins": "http://192.168.170.15:5173",  # Thay đổi theo origin của React app
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})


my_model = FaceIDModel("model/detection_model.pt", "identity")

results = ""


@app.route('/student_images/<filename>')
def student_images(filename):
    return send_from_directory("student_images", filename)

@app.route("/save_image", methods=["POST"])
def save_image():
    label = request.form.get("label")
    image = request.files.get("image")

    if not label:
        return {"message": "Label is None!", "status": "error"}

    if not image:
        return {"message": "No image received!", "status": "error"}

    print("Label:", label)
    print("Image received:", image.filename)

    try:
        ServerUtils.save_image(label, image)
        return {"message": "Save image successfully!", "status": "success"}
    except:
        return {"message": "Interal Server Error!", "status": "error"}


@app.route("/api/identity_student", methods=["POST"])
def identity_student():
    try:
        image = request.files.get("image")

        if not image:
            return {"message": "No image received!", "status": "error"}

        print("Image received:", image.filename)

        # Convert image to numpy array
        img = Image.open(image)
        img_array = np.array(img)

        # convert to BGR format
        img_array = cv2.cvtColor(img_array, cv2.COLOR_RGB2BGR)

        print("Image shape:", img_array.shape)

        student_vectors = ServerUtils.fetch_student_vectors()

        my_model.set_identity_embedding(student_vectors)
        identified_faces = my_model.query(img_array)

        label = None
        distance = 1.0  # Initialize with a high value
        d = 1.0  # Initialize with a high value

        if not identified_faces:
            return {"message": "No face detected in image", "status": "error"}

        for label, face, dist, _, _ in identified_faces:
            x1, y1, x2, y2 = map(int, face)
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)

            print("t Label:", label)
            print("t Distance:", dist)

            if dist < d:
                d = dist
                label = label
                distance = dist  # Update the final distance value

        print("Label:", label)
        print("Distance:", distance)

        if label == "Fake":
            notification = {
                "student_id": -1,
                "lesson_id": 1,
                "name": "Fake",
                "message": f"Warning Fake!"
            }

            print(notification)
            return {"label": "Fake", "distance": distance, "status": "error"}

        if distance > 0.25:
            return {"label": "unknown", "distance": distance, "status": "success"}
        

        # save image to file
        current_time = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
        image_name = f"image_{current_time}.jpg"
        filename = f"student_images/image_{current_time}.jpg"
        img.save(filename)
        print(f"Image saved as {filename}")

        studentId = label

        student = ServerUtils.get_student_by_id(student_id=studentId)
        if not student:
            print("Student not found")
            return {"message": "Student not found", "status": "error"}
        
        label = student["name"]

        print("Student ID:", studentId)
        print("Label:", label)

        # Get current lesson for this student
        lessonId = ServerUtils.get_current_lesson_for_student(studentId)
        
        print("Lesson ID:", lessonId)

        if not lessonId:
            return {"message": "Student not found in any active lessons", "status": "error"}
        
        # post data to localhost:7070/api/attendance/check
        try:
            response = requests.post(
                "https://192.168.170.15:7070/api/attendance/check",
                json={"lessonId": lessonId, "studentId": studentId, "image": image_name},
                verify=False
            )
        except requests.exceptions.RequestException as e:
            print("Error sending request to attendance API:", e)
            return {"message": "Error sending request to attendance API", "status": "error"}
        
        print("Status Code:", response.status_code)
        print("Response:", response.json())

        print("Lesson ID:", lessonId)
        print("Student ID:", studentId)
        
        notification = {
            "student_id": studentId,
            "lesson_id": lessonId,
            "name": label,
            "message": f"Attendance recorded for student {label}"
        }

        print(notification)

        return {"label": label, "distance": distance, "lessonId": lessonId, "status": "success"}
    except Exception as e:
        print("Error processing image:", e)
        return {"message": "Internal Server Error", "status": "error"}


@app.route("/api/result", methods=["GET"])
def get_result():
    global results
    return {"results": results, "status": "success"}

@app.route('/api/face/register', methods=['POST', 'OPTIONS'])
@cross_origin(supports_credentials=True)
def register_face():
    # Xử lý riêng cho OPTIONS request
    if request.method == 'OPTIONS':
        return jsonify(success=True)
    
    # Xử lý POST request
    data = request.get_json()
    if not data:
        print("Không nhận được dữ liệu JSON")
        return jsonify(error="No data provided"), 400
    
    username = data.get('username')
    images = data.get('images')
    
    print(f"Username: {username}")
    print(f"Số lượng ảnh: {len(images) if images else 'None'}")

    array_vector = []
    
    # Xử lý logic đăng ký khuôn mặt ở đây
    for image in images:
        # image = Image.open(image)
        # read image from base64 string
        image = Image.open(io.BytesIO(base64.b64decode(image.split(',')[1])))
        image_array = np.array(image)

        image_array = cv2.cvtColor(image_array, cv2.COLOR_RGB2BGR)

        # show image
        # cv2.imshow("Image", image_array)
        # cv2.waitKey(0)
        # cv2.destroyAllWindows()

        faces = detect_faces(image_array, my_model.detector_model)

        for face in faces:
            x1, y1, x2, y2 = map(int, face)
            x1, y1, x2, y2 = int(x1), int(y1), int(x2), int(y2)
            img = image_array[y1:y2, x1:x2]

            # cv2.imshow("Face", img)
            # cv2.waitKey(0)
            # cv2.destroyAllWindows()

            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            array_vector.append(extract_face_embedding(img, my_model.extractor_model).tolist())

    response = requests.post(
        "https://192.168.170.15:7070/api/student-vectors",
        json={
            "username": username,
            "featureVector": array_vector,
        },
        verify=False
    )
    print("Kết quả từ API student-vectors:")
    print(response)
    # print("Response from student-vectors API:", response.json())
    print("Status Code:", response.status_code)


    # gọi api student-vectors

    return {"message": "Register face successfully!", "status": "success"}


if __name__ == "__main__":
    print("Server ready - waiting for connections")
    app.run(host="0.0.0.0", port=5000, debug=True)

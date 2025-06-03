package com.pbl5.autoattendance.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pbl5.autoattendance.dto.StudentVectorDTO;
import com.pbl5.autoattendance.model.Student;
import com.pbl5.autoattendance.model.StudentVector;
import com.pbl5.autoattendance.model.User;
import com.pbl5.autoattendance.service.StudentService;
import com.pbl5.autoattendance.service.StudentVectorService;
import com.pbl5.autoattendance.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student-vectors")
public class StudentVectorAPI {
    private final UserService userService;
    private final StudentService studentService;
    private final StudentVectorService studentVectorService;
    private final ObjectMapper objectMapper;

    public StudentVectorAPI(UserService userService, StudentService studentService, 
                          StudentVectorService studentVectorService, ObjectMapper objectMapper) {
        this.userService = userService;
        this.studentService = studentService;
        this.studentVectorService = studentVectorService;
        this.objectMapper = objectMapper;
    }

    @PostMapping
    public ResponseEntity<?> saveStudentVector(@RequestBody @Valid StudentVectorDTO studentVectorDTO) {
        User user = userService.getUserByUsername(studentVectorDTO.getUsername());
        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        Student student = studentService.getStudentByUsername(studentVectorDTO.getUsername());
        if (student == null) {
            return new ResponseEntity<>("Student not found", HttpStatus.NOT_FOUND);
        }
        
        try {
            // Chuyển đổi featureVector thành chuỗi JSON
            String featureVectorJson = objectMapper.writeValueAsString(studentVectorDTO.getFeatureVector());
            
            // Kiểm tra xem student đã có vector chưa
            StudentVector existingVector = studentVectorService.findByStudent(student);
            
            if (existingVector != null) {
                // Nếu đã có vector, cập nhật vector cũ
                existingVector.setFeatureVector(featureVectorJson);
                studentVectorService.save(existingVector);
            } else {
                // Nếu chưa có vector, tạo vector mới
                StudentVector studentVector = StudentVector.builder()
                        .student(student)
                        .featureVector(featureVectorJson)
                        .build();
                studentVectorService.save(studentVector);
            }
            
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (JsonProcessingException e) {
            return new ResponseEntity<>("Invalid feature vector format", HttpStatus.BAD_REQUEST);
        }
    }
}

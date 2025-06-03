import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, Grid, Paper, IconButton, Alert } from '@mui/material';
import { CameraAlt, Delete, Check } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

function FaceRegistrationPage() {
    const [images, setImages] = useState([]);
    const [isCapturing, setIsCapturing] = useState(false);
    const [cameraError, setCameraError] = useState("");
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Video ref:", videoRef.current);
    }, []);

    const startCamera = async () => {
        try {
            console.log("Bắt đầu khởi động camera...");
            setIsCapturing(true);
            setCameraError("");
            
            await new Promise(resolve => setTimeout(resolve, 100));
            
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            });
            console.log("Đã nhận stream:", stream);
            
            if (videoRef.current) {
                console.log("Video ref tồn tại:", videoRef.current);
                videoRef.current.srcObject = stream;
                videoRef.current.play();
            } else {
                console.log("Video ref không tồn tại!");
                setIsCapturing(false);
            }
        } catch (err) {
            console.error('Lỗi khi khởi động camera:', err);
            setIsCapturing(false);
            if (err.name === 'NotAllowedError') {
                setCameraError("Camera đã bị chặn. Vui lòng cho phép truy cập camera trong cài đặt trình duyệt.");
            } else if (err.name === 'NotFoundError') {
                setCameraError("Không tìm thấy camera. Vui lòng kiểm tra kết nối camera.");
            } else if (err.name === 'NotReadableError') {
                setCameraError("Camera đang được sử dụng bởi ứng dụng khác. Vui lòng đóng các ứng dụng đang sử dụng camera.");
            } else if (err.name === 'SecurityError') {
                setCameraError("Truy cập camera bị chặn do vấn đề bảo mật. Vui lòng truy cập qua HTTPS hoặc 192.168.180.164.");
            } else {
                setCameraError("Lỗi không xác định khi khởi động camera: " + err.message);
            }
        }
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const context = canvasRef.current.getContext('2d');
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            
            const imageData = canvasRef.current.toDataURL('image/jpeg');
            setImages([...images, imageData]);
        }
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCapturing(false);
    };

    const handleSubmit = async () => {
        try {
            const username = localStorage.getItem('pendingFaceRegistration');
            if (!username) {
                console.error('Không tìm thấy thông tin đăng ký khuôn mặt');
                return;
            }

            console.log("Đang gửi yêu cầu đăng ký khuôn mặt với username:", username);
            console.log("Hình ảnh đang gửi:", images);

            const faceResponse = await fetch('http://localhost:5000/api/face/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: username,
                    images: images
                }),
                credentials: 'include',  // Nếu bạn cần gửi cookie
                mode: 'cors'  // Thêm dòng này
            });

            if (faceResponse.ok) {
                navigate('/login');
            } else {
                console.error('Lỗi khi đăng ký khuôn mặt');
            }
        } catch (error) {
            console.error('Lỗi:', error);
        }
    };

    return (
        <Box sx={{ padding: 4 }}>
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 800, margin: '0 auto' }}>
                <Typography variant="h5" gutterBottom>
                    Đăng ký khuôn mặt
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Vui lòng chụp ít nhất 3 ảnh khuôn mặt ở các góc độ khác nhau
                </Typography>

                {cameraError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {cameraError}
                    </Alert>
                )}

                <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                        <Box sx={{ position: 'relative', width: '100%', height: 300, bgcolor: 'grey.200', overflow: 'hidden' }}>
                            {!isCapturing ? (
                                <Button
                                    variant="contained"
                                    startIcon={<CameraAlt />}
                                    onClick={startCamera}
                                    sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                >
                                    Bật Camera
                                </Button>
                            ) : (
                                <>
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        style={{ 
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transform: 'scaleX(-1)'
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={captureImage}
                                        sx={{ position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)' }}
                                    >
                                        Chụp ảnh
                                    </Button>
                                </>
                            )}
                        </Box>
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                            {images.map((image, index) => (
                                <Box key={index} sx={{ position: 'relative' }}>
                                    <img
                                        src={image}
                                        alt={`Ảnh ${index + 1}`}
                                        style={{ width: 100, height: 100, objectFit: 'cover' }}
                                    />
                                    <IconButton
                                        size="small"
                                        onClick={() => removeImage(index)}
                                        sx={{
                                            position: 'absolute',
                                            top: -8,
                                            right: -8,
                                            bgcolor: 'white',
                                            '&:hover': { bgcolor: 'grey.100' }
                                        }}
                                    >
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        variant="outlined"
                        onClick={stopCamera}
                        disabled={!isCapturing}
                    >
                        Tắt Camera
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={images.length < 3}
                        startIcon={<Check />}
                    >
                        Hoàn tất
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default FaceRegistrationPage;
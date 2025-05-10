import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent, CardMedia } from '@mui/material';
import api from "../api/axios";
import { useParams } from 'react-router-dom';

const CheckAttendancePage = () => {
    const { classId } = useParams();
    const [student, setStudent] = useState()
    const [AttendanceResult, setAttendanceResult] = useState()
    const [TimeResult, setTimeResult] = useState()

    useEffect(() => {
        const handleInfo = async() => {
            try {
                // Chuyển từ fetch sang axios
                const response = await api.get("/api/student", {
                    withCredentials: true
                });
                
                console.log(JSON.stringify(response.data));
                console.log(response.data.result);
                setStudent(response.data.result);
            } catch (error) {
                console.error('Không thể lấy dữ liệu sinh viên:', error);
            }
        };
        handleInfo();
    }, []);

    useEffect(() => {
        const handleAttendanceResult = async () => {
            try {
                // Chuyển từ fetch sang axios
                const response = await api.get(`/api/attendance/result/${classId}`, {
                    withCredentials: true
                });
                
                const data = response.data;
                console.log(JSON.stringify(data));
                console.log(data.result);
                setAttendanceResult(data.result);
                
                if (data.result) {
                    const checkin = data.result.checkinDate;
                    console.log(checkin);
                    if (checkin) {
                        const dayOnly = checkin.split("T")[0];
                        var timeOnly = checkin.split("T")[1];
                        const [hour, minute] = timeOnly.split(":");
                        timeOnly = `${hour}:${minute}`;
                        const tr = {
                            dayOnly: dayOnly,
                            timeOnly: timeOnly
                        };
                        console.log(tr);
                        setTimeResult(tr);
                    }
                }
            } catch (error) {
                console.error('Không thể lấy dữ liệu điểm danh:', error);
            }
        };
        
        handleAttendanceResult();
    }, [classId]);

    if (!student||!AttendanceResult||!TimeResult) {
        return <div>...Loading...Không có thông tin điểm danh</div>; 
    }
   

    return (
        <Container maxWidth="lg" sx={{ paddingTop: 5 }}>
        {/* Header */}
        <Typography variant="h3" align="center" gutterBottom>
            Attendance Result
        </Typography>

        <Grid container spacing={4}>
            {/* Student Info */}
            <Grid item xs={12} >
            <Card elevation={3}>
                <CardContent  content>
                <Typography variant="h5" gutterBottom>
                    Infomation
                </Typography>
                <CardMedia
                    component="img"
                    image={`http://localhost:5000/student_images/${AttendanceResult.imgPath}`}
                    alt="Kết Quả Nhận Diện"
                    sx={{width: "50%", objectFit: 'cover', borderRadius: 2, marginTop: 2, textAlign: 'center', margin: '0 auto'}}
                />
                <Typography variant="body1" color="textSecondary">
                    <strong>Name:</strong> {student.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    <strong>Id:</strong> {student.id}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    <strong>Date:</strong> {TimeResult.dayOnly}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    <strong>Time:</strong> {TimeResult.timeOnly}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    <strong>Status:</strong> Đã Điểm Danh thành công
                </Typography>
                </CardContent>
            </Card>
            </Grid>


          
        </Grid>

        {/* Footer */}
        <Box sx={{ textAlign: 'center', marginTop: 5, padding: 2, backgroundColor: '#f1f1f1' }}>
            <Typography variant="body2" color="textSecondary">
                Auto Attendance System
            </Typography>
        </Box>
        </Container>
    );
}

export default CheckAttendancePage;

import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Paper, Grid, Card, CardContent, CardMedia } from '@mui/material';
import api from "../api/axios";
import { useParams } from 'react-router-dom';

const CheckAttendancePage = () => {
    const { classId } = useParams();
    const [student, setStudent] = useState(null);
    const [attendanceResult, setAttendanceResult] = useState(null);
    const [timeResult, setTimeResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStudentInfo = async () => {
            try {
                const response = await api.get("/api/student", {
                    withCredentials: true
                });
                setStudent(response.data.result);
            } catch (error) {
                setError('Không thể lấy dữ liệu sinh viên');
                console.error('Error fetching student data:', error);
            }
        };

        fetchStudentInfo();
    }, []);

    useEffect(() => {
        const fetchAttendanceResult = async () => {
            if (!classId) return;

            try {
                const response = await api.get(`/api/attendance/result/${classId}`, {
                    withCredentials: true
                });
                
                const { result } = response.data;
                setAttendanceResult(result);
                console.log(result);
                if (result?.checkinDate) {
                    const date = new Date(result.checkinDate);
                    setTimeResult({
                        dayOnly: date.toLocaleDateString(),
                        timeOnly: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    });
                }
            } catch (error) {
                setError('Không thể lấy dữ liệu điểm danh');
                console.error('Error fetching attendance data:', error);
            } finally {
                setLoading(false);
            }
        };
        
        fetchAttendanceResult();
    }, [classId]);

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ paddingTop: 5 }}>
                <Typography>Loading...</Typography>
            </Container>
        );
    }

    if (error) {
        return (
            <Container maxWidth="lg" sx={{ paddingTop: 5 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ paddingTop: 5 }}>
            <Typography variant="h3" align="center" gutterBottom>
                Attendance Result
            </Typography>

            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <Card elevation={3}>
                        <CardContent>
                            <Typography variant="h5" gutterBottom>
                                Information
                            </Typography>
                            {attendanceResult?.status !== "Absent" && attendanceResult?.status !== null  && (
                                    <CardMedia
                                        component="img"
                                        image={attendanceResult.imgPath ? `http://localhost:5000/student_images/${attendanceResult.imgPath}` : ''}
                                        alt="Recognition Result"
                                        sx={{
                                        width: "50%",
                                        objectFit: 'cover',
                                        borderRadius: 2,
                                        marginTop: 2,
                                        margin: '0 auto'
                                    }}
                                />
                            )}
                            <Typography variant="body1" color="textSecondary">
                                <strong>Name:</strong> {student?.name}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                <strong>Id:</strong> {student?.id}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                <strong>Date:</strong> {timeResult?.dayOnly || 'Not checked in'}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                <strong>Time:</strong> {timeResult?.timeOnly || 'Not checked in'}
                            </Typography>
                            <Typography variant="body1" color="textSecondary">
                                <strong>Status:</strong> {attendanceResult?.status || 'Lớp học đang diễn ra, hãy điểm danh!'}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Box sx={{ textAlign: 'center', marginTop: 5, padding: 2, backgroundColor: '#f1f1f1' }}>
                <Typography variant="body2" color="textSecondary">
                    Auto Attendance System
                </Typography>
            </Box>
        </Container>
    );
}

export default CheckAttendancePage;

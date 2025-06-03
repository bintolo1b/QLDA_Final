import { Box, Button, Typography, Dialog, DialogContent } from "@mui/material";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ScheduleIcon from '@mui/icons-material/Schedule';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PortraitIcon from '@mui/icons-material/Portrait';
import FilterIcon from '@mui/icons-material/Filter';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SchoolIcon from '@mui/icons-material/School';
import api from "../api/axios";
import Avatar from '@mui/material/Avatar';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AssessmentIcon from '@mui/icons-material/Assessment';
import GroupsIcon from '@mui/icons-material/Groups';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import TimerOffIcon from '@mui/icons-material/TimerOff';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export default function AttendancePage() {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Kiểm tra role và chuyển hướng nếu không phải là giáo viên
    useEffect(() => {
        const roles = localStorage.getItem('roles');
        if (!roles || !roles.includes('ROLE_TEACHER')) {
            navigate('/calendar');
        }
    }, [navigate]);
    
    // Lấy lessonId từ URL bằng cách lấy tham số cuối cùng
    const pathParts = location.pathname.split('/');
    const lessonId = pathParts[pathParts.length - 1];
    
    const [lessonData, setLessonData] = useState(null);
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState([]);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [openImageDialog, setOpenImageDialog] = useState(false);

    const handleStateClick = (event, student) => {
        setAnchorEl(event.currentTarget);
        setSelectedStudent(student);
    };

    const handleStateClose = () => {
        setAnchorEl(null);
    };

    const handleStateChange = async (newState) => {
        if (!selectedStudent) return;
        
        // Cập nhật UI ngay lập tức
        const updatedStudents = [...students];
        const studentIndex = updatedStudents.findIndex(s => s.id === selectedStudent.id);
        
        if (studentIndex !== -1) {
            updatedStudents[studentIndex] = {
                ...updatedStudents[studentIndex],
                attendanceType: newState
            };
            setStudents(updatedStudents);
        }
        
        try {
            await api.post('/api/attendance/update', {
                lessonId: parseInt(lessonId),
                studentId: selectedStudent.id,
                checkinDate: new Date().toISOString(),
                imgPath: "",
                status: newState
            }, {
                withCredentials: true
            });
            console.log(new Date().toISOString());
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
        }
        
        handleStateClose();
    };

    const handleImageClick = (imagePath) => {
        const originalPath = "http://localhost:5000/student_images/"
        setSelectedImage(originalPath + imagePath);
        setOpenImageDialog(true);
    };

    const handleCloseImageDialog = () => {
        setOpenImageDialog(false);
    };

    const handleExportCSV = () => {
        // Tạo dữ liệu CSV
        const csvData = [
            ['Student Name', 'State', 'Time'], // Header
            ...students.map(student => [
                student.name,
                student.attendanceType,
                student.time.toString()
            ])
        ];

        // Chuyển đổi mảng thành chuỗi CSV
        const csvString = csvData.map(row => row.join(',')).join('\n');

        // Tạo Blob và tải xuống
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance_${lessonId}_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const fetchStudentsAttendance = async (classId) => {
        try {
            if (!classId) {
                console.error("classId không tồn tại hoặc không hợp lệ:", classId);
                throw new Error('Không tìm thấy ID lớp học');
            }
            
            const response = await api.get(`/api/classes/${classId}/students`, {
                withCredentials: true
            });
            
            // Tạo mảng sinh viên với thông tin cơ bản
            const studentsWithBasicInfo = response.data.map(student => ({
                ...student,
                state: false, // Giá trị mặc định
                time: "--",
                imgPath: "",
                attendanceType: "Absent" // Giá trị mặc định
            }));
            
            // Lấy thông tin điểm danh cho từng sinh viên
            const studentsWithAttendance = await Promise.all(
                studentsWithBasicInfo.map(async (student) => {
                    try {
                        const attendanceResponse = await api.post('/api/attendance/get_status', {
                            lessonId: parseInt(lessonId),
                            studentId: student.id
                        }, {
                            withCredentials: true
                        });
                        
                        const attendanceData = attendanceResponse.data;
                        
                        // Sử dụng trực tiếp status từ API
                        let attendanceType = attendanceData.status || "--";
                        
                        // Cập nhật trạng thái điểm danh
                        return {
                            ...student,
                            state: attendanceData.checkinDate !== null,
                            time: attendanceData.checkinDate ? new Date(attendanceData.checkinDate).toLocaleTimeString() : "--",
                            imgPath: attendanceData.imgPath || "",
                            attendanceType: attendanceType
                        };
                    } catch (error) {
                        console.error(`Lỗi khi xử lý dữ liệu điểm danh cho sinh viên ${student.id}:`, error);
                        return student;
                    }
                })
            );
            
            setStudents(studentsWithAttendance);
            setLoading(false);
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu sinh viên:', error);
            setError(error.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        
        // Kiểm tra xem có lessonId từ URL không
        if (!lessonId) {
            console.error('Không tìm thấy lessonId trong URL');
            setError('Không tìm thấy ID bài học trong URL');
            setLoading(false);
            return;
        }
        
        const fetchLessonData = async () => {
            try {
                const response = await api.get(`/api/lessons/${lessonId}`, {
                    withCredentials: true
                });
                
                setLessonData(response.data);
                return response.data.class_id;
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu bài học:', error);
                if (error.response && error.response.status === 404) {
                    setError('Không tìm thấy bài học với ID đã cung cấp');
                } else {
                    setError('Không thể kết nối đến máy chủ');
                }
                return null;
            }
        };

        const fetchClassData = async (classId) => {
            try {
                const response = await api.get(`/api/classes/lesson/${lessonId}`, {
                    withCredentials: true
                });
                
                setClassData(response.data);
                return response.data.class_id;
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu lớp học:', error);
                setError(error.message);
                return null;
            }
        };

        const loadAllData = async () => {
            const classId = await fetchLessonData();
            if (classId) {
                await fetchClassData(classId);
                await fetchStudentsAttendance(classId);
            } else {
                setLoading(false);
            }
        };

        loadAllData();

        // Thiết lập interval để cập nhật trạng thái điểm danh mỗi 2 giây
        const intervalId = setInterval(() => {
            // console.log("Interval đang chạy mỗi 2 giây - Thời gian hiện tại:", new Date().toLocaleTimeString());
            // console.log("Class data:", classData);
            if (classData?.id) {
                // console.log("Đang cập nhật trạng thái điểm danh...");
                fetchStudentsAttendance(classData.id);
            }
        }, 2000);

        // Xóa interval khi component unmount
        return () => {
            // console.log("Đang xóa interval");
            clearInterval(intervalId);
        };
    }, [lessonId, classData?.id ]);

    const AttendanceData = lessonData || {
        date: "March 03 2023",
        startTime: "08:30:00",
        endTime: "10:00:00",
    }

    // Hàm định dạng ngày từ chuỗi ISO
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('vi-VN', { month: 'long' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    if (error) {
        return (
            <Box sx={{ padding: "40px", textAlign: "center" }}>
                <Typography variant="h5" color="error" gutterBottom>
                    {error}
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => navigate('/calendar')}
                    sx={{ mt: 2 }}
                >
                    Quay lại lịch học
                </Button>
            </Box>
        );
    }

    if (loading) {
        return (
            <Box sx={{ padding: "40px", textAlign: "center" }}>
                <Typography>Đang tải dữ liệu...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={styles.container}>
            <Box sx={styles.information}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <Typography sx={styles.information__title}>
                        <CalendarMonthIcon sx={{ fontSize: 35, marginRight: 2, verticalAlign: 'bottom' }}/>
                        Attendance Management
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleExportCSV}
                        sx={styles.exportButton}
                    >
                        Export CSV
                    </Button>
                </Box>
                <Box sx={styles.infoGrid}>
                    <Box sx={styles.infoCard}>
                        <SchoolIcon sx={styles.infoCard__icon}/>
                        <Box>
                            <Typography sx={styles.infoCard__label}>Class</Typography>
                            <Typography sx={styles.infoCard__value}>{classData?.name || "Tên lớp"}</Typography>
                        </Box>
                    </Box>
                    <Box sx={styles.infoCard}>
                        <CalendarMonthIcon sx={styles.infoCard__icon}/>
                        <Box>
                            <Typography sx={styles.infoCard__label}>Date</Typography>
                            <Typography sx={styles.infoCard__value}>{ lessonData?.lessonDate ? formatDate(lessonData.lessonDate) : AttendanceData.date }</Typography>
                        </Box>
                    </Box>
                    <Box sx={styles.infoCard}>
                        <ScheduleIcon sx={styles.infoCard__icon}/>
                        <Box>
                            <Typography sx={styles.infoCard__label}>Time</Typography>
                            <Typography sx={styles.infoCard__value}>{ lessonData?.startTime || AttendanceData.startTime } - { lessonData?.endTime || AttendanceData.endTime }</Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box sx={{ display: "flex", gap: "24px" }}>
                <Box sx={styles.statistic}>
                    <Box sx={styles.statistic__item}>
                        <Typography sx={styles.statistic__item__title}>
                            <FilterIcon sx={{ fontSize: 25, marginRight: 1, verticalAlign: 'bottom' }}/>
                            Statistic Summary
                        </Typography>
                        <Box sx={styles.statistic__item__parameter}>
                            <Box sx={styles.parameter}>
                                <Box sx={styles.parameterCard}>
                                    <PortraitIcon sx={styles.parameterCard__icon} />
                                    <Box sx={styles.parameter__content}>
                                        <Typography sx={styles.parameter__title}>Total Students</Typography>
                                        <Typography sx={styles.parameter__number}>{ students.length }</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={styles.parameter}>
                                <Box sx={styles.parameterCard}>
                                    <CheckCircleIcon sx={{...styles.parameterCard__icon, color: '#10b981'}} />
                                    <Box sx={styles.parameter__content}>
                                        <Typography sx={styles.parameter__title}>Attended</Typography>
                                        <Typography sx={styles.parameter__number}>{ students.filter(item => item.state == true).length }</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={styles.parameter}>
                                <Box sx={styles.parameterCard}>
                                    <CancelIcon sx={{...styles.parameterCard__icon, color: '#ef4444'}} />
                                    <Box sx={styles.parameter__content}>
                                        <Typography sx={styles.parameter__title}>Absent</Typography>
                                        <Typography sx={styles.parameter__number}>{ students.filter(item => item.state == false).length }</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                    <Box sx={styles.statistic__item}>
                        <Typography sx={styles.statistic__item__title}>
                            <AssessmentIcon sx={{ fontSize: 25, marginRight: 1, verticalAlign: 'bottom' }}/>
                            Present Summary
                        </Typography>
                        <Box sx={styles.statistic__item__parameter}>
                            <Box sx={styles.parameter}>
                                <Box sx={styles.parameterCard}>
                                    <GroupsIcon sx={styles.parameterCard__icon} />
                                    <Box sx={styles.parameter__content}>
                                        <Typography sx={styles.parameter__title}>Attendance</Typography>
                                        <Typography sx={styles.parameter__number}>{ students.filter(item => item.state == true).length }</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={styles.parameter}>
                                <Box sx={styles.parameterCard}>
                                    <AccessTimeFilledIcon sx={{...styles.parameterCard__icon, color: '#10b981'}} />
                                    <Box sx={styles.parameter__content}>
                                        <Typography sx={styles.parameter__title}>Early Clock In</Typography>
                                        <Typography sx={styles.parameter__number}>{ students.filter(item => item.attendanceType === "Attended").length }</Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Box sx={styles.parameter}>
                                <Box sx={styles.parameterCard}>
                                    <TimerOffIcon sx={{...styles.parameterCard__icon, color: '#f59e0b'}} />
                                    <Box sx={styles.parameter__content}>
                                        <Typography sx={styles.parameter__title}>Late Clock In</Typography>
                                        <Typography sx={styles.parameter__number}>{ students.filter(item => item.attendanceType === "Late").length }</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                <TableContainer sx={styles.table} component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={styles.tableHeader}>Avatar</TableCell>
                                <TableCell sx={styles.tableHeader}>Student Name</TableCell>
                                <TableCell sx={styles.tableHeader}>State</TableCell>
                                <TableCell sx={styles.tableHeader}>Time</TableCell>
                                <TableCell sx={styles.tableHeader}>Image</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.map((row, index) => (
                                <TableRow
                                    key={index}
                                    sx={styles.tableRow}
                                >
                                    <TableCell sx={styles.tableCell}>
                                        <Avatar 
                                            src={`${api.defaults.baseURL}/avatars/${row.username}.jpg?t=${Date.now()}`}
                                            alt={row.name}
                                            sx={styles.avatar}
                                        />
                                    </TableCell>
                                    <TableCell component="th" scope="row" sx={styles.tableCell}>
                                        <Typography sx={styles.studentName}>{row.name}</Typography>
                                    </TableCell>
                                    <TableCell sx={styles.tableCell}>
                                        <Button 
                                            type="button"
                                            onClick={(e) => handleStateClick(e, row)}
                                            sx={{ 
                                                ...styles.stateButton,
                                                backgroundColor: row.attendanceType === "Attended" ? "#dcfce7" : 
                                                              row.attendanceType === "Late" ? "#fef3c7" : "#fee2e2",
                                                color: row.attendanceType === "Attended" ? "#16a34a" : 
                                                      row.attendanceType === "Late" ? "#d97706" : "#dc2626",
                                            }}
                                        >
                                            {row.attendanceType}
                                        </Button>
                                    </TableCell>
                                    <TableCell sx={styles.tableCell}>
                                        <Typography sx={styles.timeText}>{row.time}</Typography>
                                    </TableCell>
                                    <TableCell sx={styles.tableCell}>
                                        {row.state == true && 
                                            <Button 
                                                sx={styles.imageButton} 
                                                onClick={() => handleImageClick(row.imgPath)}
                                            >
                                                <FilterIcon/>
                                            </Button>
                                        }
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleStateClose}
                sx={styles.menu}
            >
                <MenuItem onClick={() => handleStateChange("Absent")} sx={styles.menuItem}>
                    <CancelIcon sx={{ color: "#dc2626", marginRight: 1 }} />
                    <Typography sx={{ color: "#dc2626" }}>Absent</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleStateChange("Attended")} sx={styles.menuItem}>
                    <CheckCircleIcon sx={{ color: "#16a34a", marginRight: 1 }} />
                    <Typography sx={{ color: "#16a34a" }}>Attended</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleStateChange("Late")} sx={styles.menuItem}>
                    <TimerOffIcon sx={{ color: "#d97706", marginRight: 1 }} />
                    <Typography sx={{ color: "#d97706" }}>Late</Typography>
                </MenuItem>
            </Menu>
            <Dialog 
                open={openImageDialog} 
                onClose={handleCloseImageDialog} 
                maxWidth="md"
                sx={styles.dialog}
            >
                <DialogContent sx={styles.dialogContent}>
                    {selectedImage ? (
                        <img 
                            src={selectedImage} 
                            alt="Student attendance" 
                            style={{ width: '100%', maxHeight: '80vh', borderRadius: '8px' }} 
                        />
                    ) : (
                        <Typography>No image available</Typography>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    )
}

const styles = {
    container: {
        padding: "40px",
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        background: 'linear-gradient(135deg, #EBF4FF 0%, #E6E6FA 100%)',
        '&::before': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, #EBF4FF 0%, #E6E6FA 100%)',
            zIndex: -1
        }
    },
    information: {
        marginBottom: "40px",
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
        }
    },
    information__title: {
        fontSize: "36px",
        fontWeight: "700",
        color: '#2563eb',
        textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    exportButton: {
        backgroundColor: '#2563eb',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '12px',
        textTransform: 'none',
        fontWeight: '600',
        boxShadow: '0 4px 6px rgba(37, 99, 235, 0.2)',
        '&:hover': {
            backgroundColor: '#1d4ed8',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 8px rgba(37, 99, 235, 0.3)'
        }
    },
    infoGrid: {
        display: "flex",
        gap: "24px",
        flexWrap: "wrap"
    },
    infoCard: {
        flex: '1 1 250px',
        padding: "24px",
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 8px 30px rgba(37, 99, 235, 0.15)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }
    },
    infoCard__icon: {
        fontSize: "32px",
        color: '#3b82f6',
        padding: '12px',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '12px',
        transition: 'all 0.3s ease'
    },
    infoCard__label: {
        fontSize: "14px",
        color: '#6b7280',
        marginBottom: '6px',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    infoCard__value: {
        fontSize: "24px",
        fontWeight: '700',
        color: '#1e40af',
        textShadow: '1px 1px 2px rgba(0,0,0,0.05)',
        letterSpacing: '0.5px'
    },
    statistic: {
        display: "flex",
        gap: "24px",
        flexDirection: "column",
        flex: '0 0 400px'
    },
    statistic__item: {
        padding: "30px",
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)'
        }
    },
    statistic__item__title: {
        fontSize: "24px",
        fontWeight: '700',
        color: '#2563eb',
        marginBottom: "24px",
        textShadow: '1px 1px 2px rgba(0,0,0,0.08)',
        letterSpacing: '0.5px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    },
    statistic__item__parameter: {
        display: "flex",
        flexDirection: "column",
        gap: "16px"
    },
    parameter: {
        flex: 1
    },
    parameterCard: {
        padding: "20px",
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease-in-out',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        minHeight: '90px',
        '&:hover': {
            transform: 'translateY(-3px)',
            boxShadow: '0 8px 30px rgba(37, 99, 235, 0.15)',
            backgroundColor: 'rgba(255, 255, 255, 0.95)'
        }
    },
    parameterCard__icon: {
        fontSize: "28px",
        padding: '10px',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '12px',
        transition: 'all 0.3s ease',
        flexShrink: 0
    },
    parameter__content: {
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        alignItems: 'flex-start'
    },
    parameter__title: {
        fontSize: "14px",
        color: '#6b7280',
        marginBottom: "4px",
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        whiteSpace: 'nowrap'
    },
    parameter__number: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#1e40af',
        textShadow: '1px 1px 2px rgba(0,0,0,0.08)',
        alignSelf: 'flex-end',
        marginTop: 'auto'
    },
    table: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderRadius: '20px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        overflow: "auto",
        maxHeight: "calc(100vh - 250px)",
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        '& .MuiTableCell-root': {
            color: '#4b5563',
            borderColor: 'rgba(0,0,0,0.06)',
            padding: '16px'
        },
        '& .MuiTableHead-root': {
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            '& .MuiTableCell-root': {
                fontWeight: '600',
                color: '#2563eb'
            }
        },
        '& .MuiTableRow-root': {
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
                backgroundColor: 'rgba(59, 130, 246, 0.05)'
            }
        },
        '&::-webkit-scrollbar': {
            width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
            background: 'linear-gradient(120deg, #bfdbfe, #93c5fd)',
            borderRadius: '20px',
            border: '2px solid #ffffff',
            transition: 'all 0.3s ease-in-out',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            background: 'linear-gradient(120deg, #93c5fd, #60a5fa)',
            transform: 'scale(1.1)',
        },
        '&::-webkit-scrollbar-track': {
            background: '#f8fafc',
            borderRadius: '20px',
            boxShadow: 'inset 0 0 6px rgba(0,0,0,0.06)',
        }
    },
    tableHeader: {
        color: '#2563eb',
        textAlign: 'center',
        fontWeight: '600',
        fontSize: '14px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        padding: '16px'
    },
    tableRow: {
        '&:last-child td, &:last-child th': { border: 0 },
        transition: 'all 0.2s ease-in-out'
    },
    tableCell: {
        textAlign: 'center',
        padding: '16px'
    },
    avatar: {
        width: 45,
        height: 45,
        margin: '0 auto',
        border: '2px solid #e5e7eb',
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'scale(1.1)',
            border: '2px solid #3b82f6'
        }
    },
    studentName: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#1e40af'
    },
    stateButton: {
        fontSize: "13px",
        textTransform: "none",
        minWidth: "100px",
        padding: "8px 16px",
        borderRadius: "12px",
        fontWeight: "600",
        transition: 'all 0.3s ease',
        '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
        }
    },
    timeText: {
        fontSize: "14px",
        color: '#4b5563',
        fontWeight: '500'
    },
    imageButton: {
        fontSize: "20px",
        color: '#3b82f6',
        padding: '8px',
        minWidth: 'unset',
        borderRadius: '12px',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            transform: 'translateY(-2px)'
        }
    },
    menu: {
        marginTop: "8px",
        '& .MuiPaper-root': {
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        }
    },
    menuItem: {
        padding: "12px 24px",
        transition: 'all 0.2s ease',
        '&:hover': {
            backgroundColor: 'rgba(59, 130, 246, 0.05)'
        }
    },
    dialog: {
        '& .MuiDialog-paper': {
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        }
    },
    dialogContent: {
        padding: "24px"
    }
}
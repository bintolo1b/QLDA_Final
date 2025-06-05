import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import CalendarCard from "../components/Calendar/CalendarCard";
import { Route, Routes, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import AddIcon from '@mui/icons-material/Add';
import Swal from "sweetalert2";

function CalendarPage() {
  const { classId } = useParams();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [newLesson, setNewLesson] = useState({
    lessonDate: '',
    startTime: '',
    endTime: '',
    room: '',
    notes: ''
  });
  const [dateTimeError, setDateTimeError] = useState('');

  useEffect(() => {
    const roles = localStorage.getItem('roles');
    setIsTeacher(roles && roles.includes('ROLE_TEACHER'));
  }, []);

  useEffect(() => {
    const fetchLessons = async () => {
      try {
        const response = await api.get(`/api/lessons/class/${classId}`, {
          withCredentials: true
        });
        
        console.log("Dữ liệu lịch học nhận được:", response.data);
        setLessons(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu lịch học:', error);
        
        if (error.response) {
          setError(error.response.data.message || 'Lỗi máy chủ');
        } else if (error.request) {
          setError('Không thể kết nối đến máy chủ');
        } else {
          setError(error.message);
        }
        
        setLoading(false);
      }
    };

    fetchLessons();
  }, [classId]);

  // Hàm xác định trạng thái của buổi học dựa trên datetime
  const determineStatus = (lessonDate, startTime, endTime, isCompleted) => {
    const currentDateTime = new Date();
    
    // Tạo datetime đầy đủ từ ngày và giờ bắt đầu/kết thúc
    const lessonStartDateTime = new Date(lessonDate);
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    lessonStartDateTime.setHours(startHours, startMinutes, 0);
    
    const lessonEndDateTime = new Date(lessonDate);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    lessonEndDateTime.setHours(endHours, endMinutes, 0);
    
    console.log(currentDateTime)
    console.log(lessonStartDateTime)
    console.log(lessonEndDateTime)
    if (isCompleted) {
      return 'Passed';
    } else if (
      currentDateTime >= lessonStartDateTime && 
      currentDateTime <= lessonEndDateTime
    ) {
      return 'Now';
    } else if (currentDateTime > lessonEndDateTime) {
      return 'Passed';
    } else {
      return 'Pending';
    }
  };

  // Hàm định dạng ngày tháng
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const validateDateTime = () => {
    const now = new Date();
    const lessonDate = new Date(newLesson.lessonDate);
    const [startHours, startMinutes] = newLesson.startTime.split(':').map(Number);
    lessonDate.setHours(startHours, startMinutes, 0);

    if (lessonDate <= now) {
      setDateTimeError('Lesson date and time must be in the future');
      return false;
    }
    setDateTimeError('');
    return true;
  };

  const handleAddLesson = async () => {
    if (!validateDateTime()) {
      return;
    }

    try {
      const response = await api.post(`/api/lessons`, {
        class_id: classId,
        ...newLesson
      }, {
        withCredentials: true
      });
      
      setLessons([...lessons, response.data]);
      setOpenAddDialog(false);
      setNewLesson({
        lessonDate: '',
        startTime: '',
        endTime: '',
        room: '',
        notes: ''
      });
      setDateTimeError('');

      Swal.fire({
        title: 'Thành công!',
        text: 'Đã thêm buổi học mới',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
    } catch (error) {
      console.error('Error creating lesson:', error);
      setOpenAddDialog(false);
      Swal.fire({
        title: 'Lỗi!',
        text: error.response?.data?.message || 'Không thể tạo buổi học',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    try {
      await api.delete(`/api/lessons/${lessonId}`, {
        withCredentials: true
      });
      
      setLessons(lessons.filter(lesson => lesson.id !== lessonId));
      
      Swal.fire({
        title: 'Thành công!',
        text: 'Đã xóa buổi học',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
    } catch (error) {
      console.error('Error deleting lesson:', error);
      Swal.fire({
        title: 'Lỗi!',
        text: error.response?.data || 'Không thể xóa buổi học',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
    }
  };

  return (
    <Box sx={{ 
      height: '100%', 
      overflowY: 'auto',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)'
    }}> 
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <h2 style={{ 
          color: '#1976d2',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
          margin: '24px 0'
        }}>Class Calendar</h2>
        
        {isTeacher && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenAddDialog(true)}
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0',
              }
            }}
          >
            Add Lesson
          </Button>
        )}
      </Box>
        
      {loading ? (
        <Box sx={{ textAlign: 'center', padding: '20px', color: '#1976d2' }}>Đang tải dữ liệu lịch học...</Box>
      ) : error ? (
        <Box sx={{ textAlign: 'center', padding: '20px', color: '#f44336', backgroundColor: 'rgba(244, 67, 54, 0.08)', borderRadius: '8px', margin: '0 auto', maxWidth: '500px' }}>Lỗi: {error}</Box>
      ) : (
        <Box sx={{
            display: 'flex', 
            flexDirection: 'column',
            gap: '24px', 
            flexWrap: 'wrap', 
            padding: '16px',  
            marginBottom: '16px', 
            justifyContent: 'center',
            alignItems: 'center', 
            paddingBottom: '100px'
        }}>    
            {lessons.map(lesson => (
              <CalendarCard 
                key={lesson.id}
                date={formatDate(lesson.lessonDate)}
                status={determineStatus(
                  lesson.lessonDate, 
                  lesson.startTime, 
                  lesson.endTime, 
                  lesson.isCompleted,
                )}
                total={50}
                startTime={lesson.startTime.substring(0, 5)}
                endTime={lesson.endTime.substring(0, 5)}
                lessonId={lesson.id}
                onDelete={handleDeleteLesson}
              />
            ))}
        </Box>
      )}

      {/* Add Lesson Dialog */}
      <Dialog open={openAddDialog} onClose={() => {
        setOpenAddDialog(false);
        setDateTimeError('');
      }}>
        <DialogTitle>Add New Lesson</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Date"
            type="date"
            fullWidth
            value={newLesson.lessonDate}
            onChange={(e) => {
              setNewLesson({...newLesson, lessonDate: e.target.value});
              setDateTimeError('');
            }}
            InputLabelProps={{ shrink: true }}
            inputProps={{
              min: new Date().toISOString().split('T')[0]
            }}
            error={!!dateTimeError}
            helperText={dateTimeError}
          />
          <TextField
            margin="dense"
            label="Start Time"
            type="time"
            fullWidth
            value={newLesson.startTime}
            onChange={(e) => {
              setNewLesson({...newLesson, startTime: e.target.value});
              setDateTimeError('');
            }}
            InputLabelProps={{ shrink: true }}
            error={!!dateTimeError}
          />
          <TextField
            margin="dense"
            label="End Time"
            type="time"
            fullWidth
            value={newLesson.endTime}
            onChange={(e) => {
              setNewLesson({...newLesson, endTime: e.target.value});
              setDateTimeError('');
            }}
            InputLabelProps={{ shrink: true }}
            error={!!dateTimeError}
          />
          <TextField
            margin="dense"
            label="Room"
            type="text"
            fullWidth
            value={newLesson.room}
            onChange={(e) => setNewLesson({...newLesson, room: e.target.value})}
          />
          <TextField
            margin="dense"
            label="Notes"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={newLesson.notes}
            onChange={(e) => setNewLesson({...newLesson, notes: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenAddDialog(false);
            setDateTimeError('');
          }}>Cancel</Button>
          <Button onClick={handleAddLesson} variant="contained" color="primary">
            Add Lesson
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CalendarPage;
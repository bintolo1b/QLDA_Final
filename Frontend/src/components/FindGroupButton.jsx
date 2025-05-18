import React, { useState } from 'react';
import { 
  Button, 
  Dialog, 
  DialogActions, 
  DialogContent, 
  DialogTitle, 
  TextField, 
  IconButton, 
  Box, 
  Typography,
  CircularProgress,
  Alert
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function FindGroupButton() {
  const [open, setOpen] = useState(false);
  const [classId, setClassId] = useState('');
  const [classInfo, setClassInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [joinSuccess, setJoinSuccess] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    setClassInfo(null);
    setError(null);
    setJoinSuccess(false);
  };

  const handleClose = () => {
    setOpen(false);
    setClassId('');
    setClassInfo(null);
    setError(null);
  };

  const handleSearch = async () => {
    if (!classId.trim()) return;
    
    setLoading(true);
    setError(null);
    setClassInfo(null);
    
    try {
      const response = await fetch(`https://localhost:7070/api/classes/${classId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Không tìm thấy lớp học với mã này');
      }
      
      const data = await response.json();
      setClassInfo(data);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm lớp học:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoinClass = async () => {
    if (!classInfo) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://localhost:7070/api/student-class/join/${classInfo.id}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tham gia lớp học này');
      }
      
      setJoinSuccess(true);
      setTimeout(() => {
        handleClose();
        window.location.reload(); // Tải lại trang để cập nhật danh sách lớp học
      }, 2100);
    } catch (error) {
      console.error('Lỗi khi tham gia lớp học:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <>
      <IconButton 
        color="primary" 
        onClick={handleOpen}
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 24,
          backgroundColor: 'primary.main',
          color: 'white',
          '&:hover': {
            backgroundColor: 'primary.dark',
          }
        }}
      >
        <SearchIcon />
      </IconButton>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Tìm kiếm lớp học</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 1 }}>
            <TextField
              autoFocus
              label="Nhập mã lớp học"
              type="text"
              fullWidth
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
              variant="outlined"
              sx={{ mr: 1 }}
            />
            <Button 
              variant="contained" 
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Tìm kiếm'}
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {joinSuccess && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Tham gia lớp học thành công! Đang chuyển hướng...
            </Alert>
          )}

          {classInfo && (
            <Box sx={{ 
              mt: 3, 
              p: 3,
              border: '1px solid #e0e0e0', 
              borderRadius: 2,
              backgroundColor: '#f5f5f5',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Thông tin lớp học
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Mã lớp:</strong> {classInfo.id}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Tên lớp:</strong> {classInfo.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                <strong>Số tuần học:</strong> {classInfo.numberOfWeeks}
              </Typography>
              <Typography variant="body1">
                <strong>Ngày tạo:</strong> {formatDate(classInfo.createdAt)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
          {classInfo && (
            <Button 
              onClick={handleJoinClass} 
              color="primary" 
              variant="contained"
              disabled={loading || joinSuccess}
            >
              {loading ? <CircularProgress size={24} /> : 'Xác nhận tham gia'}
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FindGroupButton;

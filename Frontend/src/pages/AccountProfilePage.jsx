import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Avatar, 
  Grid, 
  TextField, 
  Button, 
  Divider,
  Alert,
  CircularProgress,
  Container,
  IconButton
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import api from '../api/axios';

function AccountProfilePage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    username: ''
  });
  const [avatarUrl, setAvatarUrl] = useState('');

  useEffect(() => {
    // Check login
    const roles = localStorage.getItem('roles');
    
    if (!roles) {
      navigate('/login');
      return;
    }

    loadUserProfile();
  }, [navigate]);

  const loadUserProfile = async () => {
    setLoading(true);
    try {
      const roles = localStorage.getItem('roles');
      const endpoint = roles.includes('ROLE_TEACHER') ? 
        '/api/teacher' : 
        '/api/student';

      // Chuyển từ fetch sang axios
      const response = await api.get(endpoint, {
        withCredentials: true
      });
      
      // Axios tự động trả về data và xử lý lỗi HTTP
      // For student API, extract user data from result
      const user = response.data;
      const userData = roles.includes('ROLE_TEACHER') ? user : user.result;
      
      setUserData(userData);
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        username: userData.username || ''
      });

      // Set avatar URL - sử dụng baseURL từ axios
      if (userData.username) {
        setAvatarUrl(`${api.defaults.baseURL}/avatars/${userData.username}.jpg`);
      }
      
    } catch (err) {
      console.error('Error loading user profile:', err);
      // Xử lý lỗi đặc biệt từ axios
      if (err.response && err.response.status === 401) {
        navigate('/login');
        return;
      }
      setError('Không thể tải thông tin tài khoản. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        username: userData.username || ''
      });
    }
    setIsEditing(!isEditing);
    setError('');
    setSuccess('');
  };

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      setError('Chỉ chấp nhận file ảnh định dạng JPG, JPEG hoặc PNG');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Chuyển từ fetch sang axios
      await api.post('/api/avatars', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data', // Axios sẽ tự động thiết lập khi thấy FormData
        }
      });

      // Update avatar URL with timestamp to force reload
      setAvatarUrl(`${api.defaults.baseURL}/avatars/${userData.username}.jpg?t=${Date.now()}`);
      setSuccess('Cập nhật ảnh đại diện thành công!');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      setError('Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const roles = localStorage.getItem('roles');
      const endpoint = roles.includes('ROLE_TEACHER') ?
        '/api/teacher' :
        '/api/student';

      // Chuyển từ fetch sang axios
      const response = await api.put(endpoint, {
        name: formData.name,
        email: formData.email, 
        phone: formData.phone
      }, {
        withCredentials: true
      });

      setSuccess('Cập nhật thông tin tài khoản thành công!');
      setIsEditing(false);
      loadUserProfile();
    } catch (err) {
      console.error('Error updating user profile:', err);
      // Xử lý lỗi của axios
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Có lỗi xảy ra');
      } else {
        setError('Không thể kết nối đến máy chủ');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%'
        }}
      >
        <CircularProgress />
        <Typography variant="body1" sx={{ ml: 2 }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 3, 
          fontWeight: 600,
          color: '#1976d2'
        }}
      >
        Thông Tin Tài Khoản
      </Typography>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 1,
            '& .MuiAlert-icon': {
              alignItems: 'center'
            }
          }}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3,
            borderRadius: 1,
            '& .MuiAlert-icon': {
              alignItems: 'center'
            }
          }}
        >
          {success}
        </Alert>
      )}

      <Paper 
        elevation={3} 
        sx={{ 
          p: { xs: 2, md: 4 },
          borderRadius: 2,
          background: 'rgba(255, 255, 255, 0.95)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar 
                sx={{ 
                  width: 150, 
                  height: 150, 
                  mb: 2,
                  bgcolor: '#1976d2',
                  fontSize: '3rem'
                }}
                src={avatarUrl}
              >
                {userData?.name?.charAt(0) || userData?.username?.charAt(0) || '?'}
              </Avatar>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="avatar-upload"
                type="file"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar-upload">
                <IconButton 
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 10,
                    right: 0,
                    backgroundColor: 'rgba(25, 118, 210, 0.9)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.7)'
                    }
                  }}
                >
                  <PhotoCameraIcon />
                </IconButton>
              </label>
            </Box>
            
            <Typography variant="h6" fontWeight={600}>
              {userData?.username || 'Người dùng'}
            </Typography>
            
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ 
                textTransform: 'capitalize',
                mt: 1
              }}
            >
              {localStorage.getItem('roles')?.includes('ROLE_TEACHER') ? 'Giảng viên' : 'Sinh viên'}
            </Typography>

            <Box 
              sx={{ 
                mt: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                width: '100%' 
              }}
            >
              <Button
                variant={isEditing ? "outlined" : "contained"}
                startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                onClick={handleEditToggle}
                sx={{ 
                  mb: 1,
                  borderRadius: 1.5,
                  py: 1,
                  textTransform: 'none'
                }}
              >
                {isEditing ? 'Huỷ chỉnh sửa' : 'Chỉnh sửa thông tin'}
              </Button>

              {isEditing && (
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<SaveIcon />}
                  onClick={handleSubmit}
                  disabled={loading}
                  sx={{ 
                    borderRadius: 1.5,
                    py: 1,
                    textTransform: 'none'
                  }}
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </Button>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={8}>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 3,
                fontWeight: 600
              }}
            >
              Thông tin cá nhân
            </Typography>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Họ và tên"
                  name="name"
                  value={isEditing ? formData.name : userData?.name || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing || loading}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <PersonIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  type="email"
                  value={isEditing ? formData.email : userData?.email || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing || loading}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <EmailIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={isEditing ? formData.phone : userData?.phone || ''}
                  onChange={handleInputChange}
                  disabled={!isEditing || loading}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <PhoneIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tên đăng nhập"
                  name="username"
                  value={userData?.username || ''}
                  disabled={true}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <BadgeIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 1.5
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default AccountProfilePage;
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
  IconButton,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
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
import LockIcon from '@mui/icons-material/Lock';
import api from '../api/axios';

function AccountProfilePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
  const [avatarLoading, setAvatarLoading] = useState(false);

  // Password change states
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

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

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm({
      ...passwordForm,
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

  const handlePasswordDialogOpen = () => {
    setPasswordDialogOpen(true);
    setPasswordError('');
    setPasswordSuccess('');
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handlePasswordDialogClose = () => {
    setPasswordDialogOpen(false);
  };

  const handlePasswordSubmit = async () => {
    setPasswordLoading(true);
    setPasswordError('');
    setPasswordSuccess('');

    try {
      await api.patch('/api/users/password', passwordForm, {
        withCredentials: true
      });

      setPasswordSuccess('Đổi mật khẩu thành công!');
      setTimeout(() => {
        handlePasswordDialogClose();
      }, 1500);
    } catch (err) {
      console.error('Error changing password:', err);
      if (err.response && err.response.data) {
        setPasswordError(err.response.data.message || 'Có lỗi xảy ra khi đổi mật khẩu');
      } else {
        setPasswordError('Không thể kết nối đến máy chủ');
      }
    } finally {
      setPasswordLoading(false);
    }
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
    setAvatarLoading(true);

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
    } finally {
      setAvatarLoading(false);
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: 'calc(100vh - 100px)',
          width: '100%'
        }}
      >
        <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
        <Typography variant="h6" sx={{ mt: 3, fontWeight: 500 }}>
          Đang tải dữ liệu...
        </Typography>
      </Box>
    );
  }

  const userRole = localStorage.getItem('roles')?.includes('ROLE_TEACHER') ? 'Giảng viên' : 'Sinh viên';
  const gradientBg = `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`;

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        py: 4,
        animation: 'fadeIn 0.5s ease-in-out',
        '@keyframes fadeIn': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            background: gradientBg,
            backgroundClip: 'text',
            textFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Thông Tin Tài Khoản
        </Typography>
        <Divider sx={{ width: '60px', borderWidth: 2, borderColor: theme.palette.primary.main, mb: 3 }} />
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(211, 47, 47, 0.2)',
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
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(46, 125, 50, 0.2)',
            '& .MuiAlert-icon': {
              alignItems: 'center'
            }
          }}
        >
          {success}
        </Alert>
      )}

      <Card 
        elevation={6} 
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
          }
        }}
      >
        <Box 
          sx={{ 
            backgroundColor: theme.palette.primary.main,
            p: 2,
            height: '60px',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E")`,
            }
          }}
        />

        <CardContent sx={{ p: { xs: 2, md: 4 }, pt: { xs: 6, md: 8 } }}>
          <Grid container spacing={4} justifyContent="center">
            <Grid 
              item 
              xs={12} 
              md={4} 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                mt: { xs: -8, md: -10 }
              }}
            >
              <Box sx={{ position: 'relative', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: { xs: 120, md: 160 }, 
                    height: { xs: 120, md: 160 },
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    border: '4px solid white',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    bgcolor: theme.palette.primary.main,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    }
                  }}
                  src={avatarUrl}
                >
                  {userData?.name?.charAt(0) || userData?.username?.charAt(0) || '?'}
                </Avatar>
                {avatarLoading && (
                  <CircularProgress 
                    size={30} 
                    sx={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      marginTop: '-15px', 
                      marginLeft: '-15px' 
                    }} 
                  />
                )}
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
                      bottom: 0,
                      right: 0,
                      backgroundColor: theme.palette.primary.main,
                      color: 'white',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
                      '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                        transform: 'scale(1.1)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </label>
              </Box>
              
              <Typography 
                variant="h5" 
                fontWeight={700}
                sx={{ mb: 0.5 }}
              >
                {userData?.name || userData?.username || 'Người dùng'}
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  backgroundColor: theme.palette.primary.light,
                  color: theme.palette.primary.contrastText,
                  py: 0.5,
                  px: 2,
                  borderRadius: 5,
                  mb: 3
                }}
              >
                <SchoolIcon sx={{ mr: 1, fontSize: 18 }} />
                <Typography 
                  variant="body2" 
                  fontWeight={500}
                >
                  {userRole}
                </Typography>
              </Box>

              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  width: '100%',
                  gap: 1.5
                }}
              >
                <Button
                  variant={isEditing ? "outlined" : "contained"}
                  startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                  onClick={handleEditToggle}
                  sx={{ 
                    borderRadius: 2,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: isEditing ? 'none' : '0 4px 12px rgba(25, 118, 210, 0.25)',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: isEditing ? 'none' : '0 6px 16px rgba(25, 118, 210, 0.35)',
                    },
                    transition: 'all 0.2s ease',
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
                      borderRadius: 2,
                      py: 1.2,
                      textTransform: 'none',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(46, 125, 50, 0.25)',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(46, 125, 50, 0.35)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </Button>
                )}

                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<LockIcon />}
                  onClick={handlePasswordDialogOpen}
                  sx={{ 
                    borderRadius: 2,
                    py: 1.2,
                    textTransform: 'none',
                    fontWeight: 600,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  Đổi mật khẩu
                </Button>
              </Box>
            </Grid>

            <Grid item xs={12} md={8} mt={-3}>
              <Typography 
                variant="h6" 
                sx={{ 
                  mb: 1,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  '&::before': {
                    content: '""',
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: theme.palette.primary.main,
                    marginRight: '10px',
                  }
                }}
              >
                Thông tin cá nhân
              </Typography>

              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={3}>
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
                        <PersonIcon color="primary" sx={{ mr: 1 }} />
                      ),
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
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
                        <EmailIcon color="primary" sx={{ mr: 1 }} />
                      ),
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
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
                        <PhoneIcon color="primary" sx={{ mr: 1 }} />
                      ),
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        transition: 'all 0.2s ease',
                        '&.Mui-focused': {
                          boxShadow: '0 0 0 2px rgba(25, 118, 210, 0.2)'
                        }
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
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
                        <BadgeIcon color="primary" sx={{ mr: 1 }} />
                      ),
                    }}
                    sx={{
                      mb: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: theme.palette.grey[50],
                      },
                      '& .MuiInputLabel-root': {
                        fontWeight: 500,
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Password Change Dialog */}
      <Dialog 
        open={passwordDialogOpen} 
        onClose={handlePasswordDialogClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight={600}>
            Đổi mật khẩu
          </Typography>
        </DialogTitle>

        <DialogContent>
          {passwordError && (
            <Alert 
              severity="error" 
              sx={{ mb: 2 }}
            >
              {passwordError}
            </Alert>
          )}

          {passwordSuccess && (
            <Alert 
              severity="success" 
              sx={{ mb: 2 }}
            >
              {passwordSuccess}
            </Alert>
          )}

          <TextField
            fullWidth
            margin="dense"
            label="Mật khẩu hiện tại"
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={handlePasswordInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Mật khẩu mới"
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={handlePasswordInputChange}
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            margin="dense"
            label="Xác nhận mật khẩu mới"
            type="password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={handlePasswordInputChange}
          />
        </DialogContent>

        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button 
            onClick={handlePasswordDialogClose}
            color="inherit"
            disabled={passwordLoading}
          >
            Huỷ bỏ
          </Button>
          <Button 
            onClick={handlePasswordSubmit}
            variant="contained"
            disabled={passwordLoading}
          >
            {passwordLoading ? 'Đang xử lý...' : 'Xác nhận'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default AccountProfilePage;
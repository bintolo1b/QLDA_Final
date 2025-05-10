import React, { useState } from 'react';
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    Link,
    Grid,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    useTheme,
    useMediaQuery,
    InputAdornment,
    IconButton,
    Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import api from '../api/axios';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [role, setRole] = useState('ROLE_STUDENT');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Kiểm tra mật khẩu xác nhận
        if (password !== confirmPassword) {
            setError('Mật khẩu xác nhận không khớp');
            return;
        }

        setIsLoading(true);

        const registrationData = {
            username,
            password,
            confirmPassword,
            roles: [role],
            name,
            phone,
            email
        };

        try {
            // Chuyển từ fetch sang axios
            await api.post('/register', registrationData);
            
            // Không cần kiểm tra response.ok vì axios tự động xử lý lỗi HTTP status
            setSuccess(true);
            setError('');

            // Nếu là học sinh, lưu username và chuyển hướng
            if (role === 'ROLE_STUDENT') {
                localStorage.setItem('pendingFaceRegistration', username);
                setTimeout(() => {
                    navigate('/face-registration');
                }, 2000);
            } else {
                // Nếu là giáo viên, chuyển hướng về login
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            // Xử lý lỗi từ axios
            if (error.response && error.response.data) {
                setError(error.response.data.message || 'Đã xảy ra lỗi khi đăng ký');
            } else {
                setError('Không thể kết nối đến máy chủ');
            }
            console.error('Lỗi đăng ký:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)',
                position: 'relative',
                overflowY: 'auto'
            }}
        >
            <Container 
                component="main" 
                maxWidth="sm"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    zIndex: 1,
                    py: 2
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Paper 
                        elevation={4} 
                        sx={{ 
                            p: { xs: 2, sm: 3 },
                            width: '100%', 
                            borderRadius: 2,
                            background: 'rgba(255, 255, 255, 0.95)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Box 
                            sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                mb: 2
                            }}
                        >
                            <Typography 
                                component="h1" 
                                variant="h5" 
                                sx={{ 
                                    fontWeight: 600,
                                    color: '#1976d2',
                                    mb: 0.5
                                }}
                            >
                                Đăng Ký Tài Khoản
                            </Typography>
                            <Typography 
                                variant="body2" 
                                color="text.secondary"
                                align="center"
                                sx={{ fontSize: '0.875rem' }}
                            >
                                Nhập thông tin để tạo tài khoản mới
                            </Typography>
                        </Box>
                        
                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    mb: 2,
                                    py: 0.5,
                                    borderRadius: 1
                                }}
                            >
                                {error}
                            </Alert>
                        )}
                        
                        {success && (
                            <Alert 
                                severity="success" 
                                sx={{ 
                                    mb: 2,
                                    py: 0.5,
                                    borderRadius: 1
                                }}
                            >
                                {role === 'ROLE_STUDENT' 
                                    ? 'Tiến hành lấy dữ liệu khuôn mặt...' 
                                    : 'Đăng ký thành công! Đang chuyển hướng...'}
                            </Alert>
                        )}
                        
                        <Box component="form" onSubmit={handleRegister} noValidate>
                            <Grid container spacing={1.5}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        required
                                        fullWidth
                                        id="name"
                                        label="Họ và tên"
                                        name="name"
                                        autoComplete="name"
                                        autoFocus
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PersonOutlineIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5
                                            }
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        required
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        name="email"
                                        autoComplete="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <EmailIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5
                                            }
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        required
                                        fullWidth
                                        id="phone"
                                        label="Số điện thoại"
                                        name="phone"
                                        autoComplete="tel"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <PhoneIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5
                                            }
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        required
                                        fullWidth
                                        id="username"
                                        label="Tên đăng nhập"
                                        name="username"
                                        autoComplete="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <AssignmentIndIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5
                                            }
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <FormControl 
                                        fullWidth 
                                        size="small"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5
                                            }
                                        }}
                                    >
                                        <InputLabel id="role-label">Vai trò</InputLabel>
                                        <Select
                                            labelId="role-label"
                                            id="role"
                                            value={role}
                                            label="Vai trò"
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <MenuItem value="ROLE_STUDENT">Học sinh</MenuItem>
                                            <MenuItem value="ROLE_TEACHER">Giáo viên</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        required
                                        fullWidth
                                        name="password"
                                        label="Mật khẩu"
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        autoComplete="new-password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle password visibility"
                                                        onClick={toggleShowPassword}
                                                        edge="end"
                                                        size="small"
                                                    >
                                                        {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5
                                            }
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        size="small"
                                        required
                                        fullWidth
                                        name="confirmPassword"
                                        label="Xác nhận mật khẩu"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        id="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <LockOutlinedIcon fontSize="small" color="action" />
                                                </InputAdornment>
                                            ),
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <IconButton
                                                        aria-label="toggle confirm password visibility"
                                                        onClick={toggleShowConfirmPassword}
                                                        edge="end"
                                                        size="small"
                                                    >
                                                        {showConfirmPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 1.5
                                            }
                                        }}
                                    />
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        disabled={isLoading}
                                        sx={{ 
                                            mt: 1,
                                            py: 1, 
                                            borderRadius: 1.5,
                                            textTransform: 'none',
                                            fontSize: '0.95rem',
                                            fontWeight: 600,
                                            boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                            '&:hover': {
                                                boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                                            }
                                        }}
                                    >
                                        {isLoading ? 'Đang xử lý...' : 'Đăng Ký'}
                                    </Button>
                                </Grid>
                            </Grid>
                            
                            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                                <Divider sx={{ flexGrow: 1 }} />
                                <Typography variant="body2" color="text.secondary" sx={{ mx: 2, fontSize: '0.875rem' }}>
                                    hoặc
                                </Typography>
                                <Divider sx={{ flexGrow: 1 }} />
                            </Box>
                            
                            <Box sx={{ mt: 1.5, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                                    Đã có tài khoản?{' '}
                                    <Link 
                                        href="/login" 
                                        sx={{
                                            color: '#1976d2',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        Đăng nhập
                                    </Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Container>
        </Box>
    );
}

export default RegisterPage;

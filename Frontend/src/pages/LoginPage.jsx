import { useState } from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    Link,
    Alert,
    InputAdornment,
    IconButton,
    Divider,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import BusinessIcon from '@mui/icons-material/Business';
import api from '../api/axios';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Vui lòng nhập tên đăng nhập và mật khẩu');
            return;
        }

        setIsLoading(true);
        setError('');


        try {
            const response = await api.post('/signin', { username, password }, {
                withCredentials: true,
            });

            // axios tự động trả về data từ response
            const data = response.data;

            // Xóa toàn bộ localStorage trước khi lưu dữ liệu mới
            localStorage.clear();

            // Lưu roles vào localStorage
            localStorage.setItem("roles", data.roles);
            if (data.roles.includes('ROLE_STUDENT')) {
                localStorage.setItem('pendingFaceRegistration', username);
            }
            // Lưu token vào localStorage nếu API trả về token
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            // Kích hoạt sự kiện storage để các component khác biết rằng localStorage đã thay đổi
            window.dispatchEvent(new Event('storage'));

            console.log("Login successful - roles:", data.roles);

            // Thêm độ trễ trước khi chuyển trang để đảm bảo localStorage được cập nhật đầy đủ
            setIsLoading(true);
            setTimeout(() => {
                navigate('/groups');
                setIsLoading(false);
            }, 300);
        } catch (error) {
            // Xử lý lỗi từ axios
            if (error.response) {
                // Server trả về response với mã lỗi
                setError(error.response.data.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
            } else if (error.request) {
                // Yêu cầu được gửi nhưng không nhận được phản hồi
                setError('Không thể kết nối tới máy chủ. Vui lòng thử lại sau.');
            } else {
                // Có lỗi khi thiết lập request
                setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại.');
            }
            setIsLoading(false);
        }
    };

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

   
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                background: 'linear-gradient(135deg, #f0f4f8 0%, #d9e2ec 100%)',
                position: 'relative'
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
                    py: 4
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
                            p: 4,
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
                                mb: 4
                            }}
                        >
                            <Typography
                                component="h1"
                                variant="h4"
                                sx={{
                                    fontWeight: 600,
                                    color: '#1976d2',
                                    mb: 1
                                }}
                            >
                                Đăng Nhập
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                align="center"
                            >
                                Nhập thông tin đăng nhập để truy cập hệ thống
                            </Typography>
                        </Box>

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

                        <Box component="form" onSubmit={handleLogin} noValidate>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Tên đăng nhập"
                                name="username"
                                autoComplete="username"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={isLoading}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonOutlineIcon color="action" />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    mb: 2,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1.5
                                    }
                                }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Mật khẩu"
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={isLoading}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockOutlinedIcon color="action" />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={toggleShowPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    mb: 1,
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 1.6
                                    }
                                }}
                            />

                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                                <Link
                                    href="#"
                                    variant="body2"
                                    sx={{
                                        color: '#1976d2',
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Quên mật khẩu?
                                </Link>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{
                                    py: 1.5,
                                    borderRadius: 1.5,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                                    '&:hover': {
                                        boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                                    }
                                }}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                            </Button>

                            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center' }}>
                                <Divider sx={{ flexGrow: 1 }} />
                                <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
                                    hoặc
                                </Typography>
                                <Divider sx={{ flexGrow: 1 }} />
                            </Box>

                            <Box sx={{ mt: 3, textAlign: 'center' }}>
                                <Typography variant="body2" color="text.secondary">
                                    Chưa có tài khoản?{' '}
                                    <Link
                                        href="/register"
                                        sx={{
                                            color: '#1976d2',
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        Đăng ký
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

export default LoginPage;

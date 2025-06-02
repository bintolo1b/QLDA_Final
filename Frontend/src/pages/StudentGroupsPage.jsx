import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Box, Typography, CircularProgress, Alert, useTheme, useMediaQuery } from '@mui/material';
import ToggleSection from '../components/ToggleSection';
import FindGroupButton from '../components/FindGroupButton';
import api from '../api/axios';

function StudentGroupsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    try {

      const response = await api.get('/api/classes/student/my-classes', {
        withCredentials: true
      });
      
      setClasses(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu lớp học:', error);
      
      // Xử lý lỗi từ axios
      if (error.response) {
        // Server trả về response với status code lỗi
        setError(error.response.data.message || 'Lỗi máy chủ');
      } else if (error.request) {
        // Request đã gửi nhưng không nhận được response
        setError('Không thể kết nối đến máy chủ');
      } else {
        // Lỗi khi thiết lập request
        setError(error.message);
      }
      
      setLoading(false);
    }
  };

  useEffect(() => {
    const roles = localStorage.getItem('roles');
    if (!roles || !roles.includes('ROLE_TEACHER')) {
      console.log("Fetching student classes with roles:", roles);
      fetchClasses();
    } else {
      console.warn("StudentGroupsPage accessed with teacher role:", roles);
      setError("Bạn không có quyền truy cập trang này");
      setLoading(false);
    }
  }, []);

  const getGridColumns = () => {
    if (isMobile) return 1;
    if (isTablet) return 2;
    return 3;
  };

  return (
    <Box 
      sx={{ 
        padding: { xs: 2, sm: 4 }, 
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f0f4f8 0%, #e6eef7 100%)',
        overflow: 'hidden',
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 18, 
          right: 32,
          zIndex: 2
        }}
      >
        <FindGroupButton />
      </Box>
      
      <Box sx={{ mb: 4, position: 'relative', zIndex: 1 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#1976d2',
            fontWeight: 700,
            mb: 1.5,
            letterSpacing: 0.5,
            textShadow: '0 2px 8px rgba(25,118,210,0.08)',
          }}
        >
          Danh sách lớp học
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: '#4a5568',
            mb: 2.5,
            fontWeight: 500,
          }}
        >
          Theo dõi và tham gia các lớp học của bạn
        </Typography>
      </Box>
      
      <ToggleSection 
        label="Lớp học đang tham gia"
        sx={{
          backgroundColor: 'rgba(255,255,255,0.98)',
          borderRadius: 3,
          boxShadow: '0 8px 24px rgba(25,118,210,0.10)',
          padding: { xs: 1.5, sm: 3 },
          mb: 3,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {loading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '200px',
            }}
          >
            <CircularProgress 
              sx={{ 
                color: '#1976d2',
                scale: 1.2,
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }} 
            />
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
              fontWeight: 600,
              fontSize: 16,
              borderRadius: 2,
              background: '#fff3e0',
              color: '#d32f2f',
              boxShadow: '0 2px 8px rgba(211,47,47,0.08)',
              '& .MuiAlert-icon': {
                color: '#d32f2f'
              }
            }}
          >
            {error}
          </Alert>
        ) : !classes || classes.length === 0 ? (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 4,
              color: '#1976d2',
              fontWeight: 500,
              fontSize: 18,
              opacity: 0.85,
            }}
          >
            <Typography variant="body1">
              Bạn chưa tham gia lớp học nào. Hãy tìm và tham gia lớp học mới!
            </Typography>
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${getGridColumns()}, 1fr)`,
              gap: { xs: 2, sm: 3 },
              p: 2,
              '@media (max-width: 600px)': {
                gridTemplateColumns: '1fr',
                gap: 2
              }
            }}
          >
            {classes.map(classItem => (
              <Box
                key={classItem.id}
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 4px 16px rgba(25,118,210,0.10)',
                  transition: 'transform 0.18s, box-shadow 0.18s',
                  background: '#f8fafc',
                  '&:hover': {
                    transform: 'translateY(-6px) scale(1.03)',
                    boxShadow: '0 8px 32px rgba(25,118,210,0.18)',
                    background: '#e3e9ff',
                  },
                  p: 1.2,
                }}
              >
                <Card 
                  groupTeamName={classItem.name || "Lớp học không có tên"} 
                  classId={classItem.id}
                />
              </Box>
            ))}
          </Box>
        )}
      </ToggleSection>

      <ToggleSection 
        label="Lớp học đã ẩn"
        sx={{
          backgroundColor: 'rgba(255,255,255,0.96)',
          borderRadius: 3,
          boxShadow: '0 4px 12px rgba(25,118,210,0.05)',
          padding: { xs: 1.5, sm: 3 },
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 4,
            color: '#666',
            fontWeight: 500,
            fontSize: 16,
          }}
        >
          <Typography variant="body1">
            Không có lớp học nào đã ẩn
          </Typography>
        </Box>
      </ToggleSection>
    </Box>
  );
}

export default StudentGroupsPage;

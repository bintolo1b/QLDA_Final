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
        padding: 3, 
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%)',
      }}
    >
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 16, 
          right: 24,
          zIndex: 1
        }}
      >
        <FindGroupButton />
      </Box>
      
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#1976d2',
            fontWeight: 'bold',
            mb: 2,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          Danh sách lớp học
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: '#666',
            mb: 3
          }}
        >
          Theo dõi và tham gia các lớp học của bạn
        </Typography>
      </Box>
      
      <ToggleSection 
        label="Lớp học đang tham gia"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          padding: 2,
          mb: 3
        }}
      >
        {loading ? (
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center',
              minHeight: '200px'
            }}
          >
            <CircularProgress 
              sx={{ 
                color: '#1976d2',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
            />
          </Box>
        ) : error ? (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 2,
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
              color: '#666'
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
              gap: 3,
              p: 2,
              '@media (max-width: 600px)': {
                gridTemplateColumns: '1fr',
                gap: 2
              }
            }}
          >
            {classes.map(classItem => (
              <Card 
                key={classItem.id}
                groupTeamName={classItem.name || "Lớp học không có tên"} 
                classId={classItem.id}
              />
            ))}
          </Box>
        )}
      </ToggleSection>

      <ToggleSection 
        label="Lớp học đã ẩn"
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: 2,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          padding: 2
        }}
      >
        <Box 
          sx={{ 
            textAlign: 'center', 
            py: 4,
            color: '#666'
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

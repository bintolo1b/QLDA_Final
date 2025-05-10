import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Grid,
  Chip,
  Divider,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import GroupIcon from '@mui/icons-material/Group';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ScheduleIcon from '@mui/icons-material/Schedule';

function ClassPage() {
  const { id } = useParams();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const dayTranslations = {
    'MONDAY': 'Thứ Hai',
    'TUESDAY': 'Thứ Ba',
    'WEDNESDAY': 'Thứ Tư',
    'THURSDAY': 'Thứ Năm',
    'FRIDAY': 'Thứ Sáu',
    'SATURDAY': 'Thứ Bảy',
    'SUNDAY': 'Chủ Nhật'
  };

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const response = await api.get(`/api/classes/${id}/with-schedule`, {
          withCredentials: true
        });

        setClassData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu lớp học:', error);
        setError('Không thể tải thông tin lớp học. Vui lòng thử lại sau.');
        setLoading(false);
      }
    };

    fetchClassData();
  }, [id]);

  const formatTime = (timeString) => {
    if (!timeString) return "--:--";
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            {classData?.name || 'Thông tin lớp học'}
          </Typography>
          <Chip
            label={'Đang hoạt động'}
            color={'success'}
          />
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {/* Thông tin chung */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Thông tin chung" />
              <CardContent>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <DateRangeIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Ngày tạo" 
                      secondary={classData?.createdAt} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Số tuần học" 
                      secondary={classData?.numberOfWeeks} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Giáo viên" 
                      secondary={classData?.teacherName || 'Chưa có thông tin'} 
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <GroupIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Tổng số học sinh" 
                      secondary={classData?.totalStudents || 0} 
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Lịch học */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title="Lịch học" />
              <CardContent>
                {classData?.schedule && Object.keys(classData.schedule).length > 0 ? (
                  <List>
                    {Object.entries(classData.schedule).map(([day, times]) => (
                      <ListItem key={day}>
                        <ListItemIcon>
                          <ScheduleIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={dayTranslations[day] || day}
                          secondary={`${formatTime(times.startTime)} - ${formatTime(times.endTime)}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography variant="body2" color="textSecondary">
                    Chưa có thông tin lịch học
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default ClassPage;
import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box, List, ListItem, ListItemText, Paper, ClickAwayListener } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import AccountMenu from './AccountMenu';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');
  
  // Xác định vai trò người dùng khi component được tải
  useEffect(() => {
    const roles = localStorage.getItem('roles');
    setUserRole(roles || '');
  }, []);
  
  // Fetch classes from API based on user role
  useEffect(() => {
    if (!userRole) return; // Nếu chưa có thông tin vai trò, không fetch dữ liệu
    
    const fetchClasses = async () => {
      try {
        // Chọn API endpoint dựa trên vai trò người dùng
        const endpoint = userRole.includes('TEACHER') 
          ? 'https://localhost:7070/api/classes/teacher/my-classes' 
          : 'https://localhost:7070/api/classes/student/my-classes';
        
        const response = await fetch(endpoint, {
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Không thể kết nối đến máy chủ');
        }
        
        const data = await response.json();
        setClasses(data);
        setLoading(false);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu lớp học:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchClasses();
  }, [userRole]); // Chạy lại khi userRole thay đổi
  
  // Generate suggestions based on class data
  const suggestions = classes.map(classItem => classItem.name || "Lớp học không có tên");
  
  const filteredSuggestions = suggestions.filter(
    suggestion => suggestion.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };
  
  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setShowSuggestions(false);
    // Here you would handle the search action, e.g. navigate to the class page
    
    // Xử lý khác nhau dựa trên vai trò
    if (userRole.includes('TEACHER')) {
      // Xử lý dành cho giáo viên
      console.log('Giáo viên tìm kiếm:', suggestion);
      // Ví dụ: navigate(`/teacher/classes/${classId}`);
    } else {
      // Xử lý dành cho học sinh
      console.log('Học sinh tìm kiếm:', suggestion);
      // Ví dụ: navigate(`/student/classes/${classId}`);
    }
  };
  
  return (
    <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0, zIndex: 3, backgroundColor:'#EBEBEB', boxShadow: 'none', borderBottom: '1px solid #ccc'}}>
      <Toolbar 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          minHeight: '47px !important',
          padding: '0 16px',
          width: '100%', 
          height: '47px' 
        }}
      >
        <Typography variant="h6" sx={{color: '#000', fontWeight: '300'}}>
          PBL5 {userRole.includes('TEACHER') ? '(Giáo viên)' : '(Học sinh)'}
        </Typography>
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          borderRadius: 1, 
          bgcolor: 'background.paper', 
          width: '50%',
          position: 'relative',
        }}>
          <SearchIcon sx={{ padding: '0 8px', color: '#9D9D9D', fontSize: '35px'}} />
          <ClickAwayListener onClickAway={() => setShowSuggestions(false)}>
            <Box sx={{ width: '100%' }}>
              <InputBase
                placeholder={loading ? "Đang tải dữ liệu..." : `Tìm kiếm lớp học${userRole.includes('TEACHER') ? ' bạn dạy' : ''}...`}
                value={searchTerm}
                onChange={handleSearchChange}
                onFocus={() => searchTerm && setShowSuggestions(true)}
                sx={{
                  width: '100%',
                  padding: '4px 8px',
                  borderRadius: 1,
                  height: '28px'
                }}
              />
              {showSuggestions && (
                <Paper 
                  sx={{ 
                    position: 'absolute', 
                    width: '100%', 
                    zIndex: 10, 
                    mt: 0.5,
                    maxHeight: '200px',
                    overflow: 'auto'
                  }}
                >
                  <List dense>
                    {loading ? (
                      <ListItem>
                        <ListItemText primary="Đang tải dữ liệu lớp học..." />
                      </ListItem>
                    ) : error ? (
                      <ListItem>
                        <ListItemText primary={`Lỗi: ${error}`} />
                      </ListItem>
                    ) : filteredSuggestions.length > 0 ? (
                      filteredSuggestions.map((suggestion, index) => (
                        <ListItem 
                          button 
                          key={index} 
                          onClick={() => handleSuggestionClick(suggestion)}
                          sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}
                        >
                          <ListItemText primary={suggestion} />
                        </ListItem>
                      ))
                    ) : (
                      <ListItem>
                        <ListItemText primary="Không tìm thấy lớp học phù hợp" />
                      </ListItem>
                    )}
                  </List>
                </Paper>
              )}
            </Box>
          </ClickAwayListener>
        </Box>

        <AccountMenu sx={{ width: 40, height: 40 }} userRole={userRole} />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
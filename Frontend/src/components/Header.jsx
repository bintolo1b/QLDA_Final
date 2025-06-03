import React, { useState, useEffect, useCallback } from 'react';
import { AppBar, Toolbar, Typography, InputBase, Box, List, ListItem, ListItemText, Paper, ClickAwayListener } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AccountMenu from './AccountMenu';

function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();
  
  // Xác định vai trò người dùng khi component được tải
  useEffect(() => {
    const roles = localStorage.getItem('roles');
    setUserRole(roles || '');
  }, []);
  
  // Debounce function để tránh gọi API quá nhiều
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };
  
  // Function to search classes using API
  const searchClasses = async (searchString) => {
    if (!searchString.trim()) {
      setSearchResults([]);
      setShowSuggestions(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const endpoint = `https://localhost:7070/api/classes/search?searchString=${encodeURIComponent(searchString)}`;
      
      const response = await fetch(endpoint, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.status === 404) {
        // Không tìm thấy kết quả
        setSearchResults([]);
        setShowSuggestions(true);
        setLoading(false);
        return;
      }
      
      if (!response.ok) {
        throw new Error('Không thể kết nối đến máy chủ');
      }
      
      const data = await response.json();
      setSearchResults(data);
      setShowSuggestions(true);
      setLoading(false);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm lớp học:', error);
      setError(error.message);
      setSearchResults([]);
      setShowSuggestions(true);
      setLoading(false);
    }
  };
  
  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchString) => {
      searchClasses(searchString);
    }, 300),
    []
  );
  
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim()) {
      debouncedSearch(value);
    } else {
      setShowSuggestions(false);
      setSearchResults([]);
    }
  };
  
  const handleSuggestionClick = (classItem) => {
    setSearchTerm(classItem.name);
    setShowSuggestions(false);
    
    // // Chuyển hướng dựa trên vai trò người dùng
    // if (userRole.includes('TEACHER')) {
    //   // Chuyển đến trang quản lý lớp học của giáo viên
    //   navigate(`/teacher/classes/${classItem.id}`);
    // } else {
    //   // Chuyển đến trang lớp học của sinh viên
    //   navigate(`/student/classes/${classItem.id}`);
    // }
    
    setTimeout(() => {
      navigate(`/calendar/${classItem.id}`);
      setSearchTerm('');
    }, 200);
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      // Tìm kiếm khi nhấn Enter
      searchClasses(searchTerm);
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
          Auto Attendance {userRole.includes('TEACHER') ? '(Giáo viên)' : '(Học sinh)'}
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
                placeholder={userRole.includes('TEACHER') 
                  ? 'Tìm kiếm lớp học bạn dạy...' 
                  : 'Tìm kiếm lớp học bạn tham gia...'}
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyPress={handleKeyPress}
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
                        <ListItemText primary="Đang tìm kiếm..." />
                      </ListItem>
                    ) : error ? (
                      <ListItem>
                        <ListItemText primary={`Lỗi: ${error}`} />
                      </ListItem>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((classItem) => (
                        <ListItem 
                          button 
                          key={classItem.id} 
                          onClick={() => handleSuggestionClick(classItem)}
                          sx={{ '&:hover': { bgcolor: '#f5f5f5' } }}
                        >
                          <ListItemText 
                            primary={classItem.name}
                            secondary={`Số tuần: ${classItem.numberOfWeeks} | Tạo: ${new Date(classItem.createdAt).toLocaleDateString('vi-VN')}`}
                          />
                        </ListItem>
                      ))
                    ) : searchTerm.trim() ? (
                      <ListItem>
                        <ListItemText primary="Không tìm thấy lớp học phù hợp" />
                      </ListItem>
                    ) : null}
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
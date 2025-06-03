import React, { useState, useEffect } from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Typography, Box } from '@mui/material';
import { Group as GroupIcon, Assignment as AssignmentIcon, Notifications as ActivityIcon} from '@mui/icons-material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Link, useLocation } from 'react-router-dom';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FaceIcon from '@mui/icons-material/Face';

function Sidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    const checkRole = () => {
      const roles = localStorage.getItem('roles');
      const hasStudentRole = roles && roles.includes('ROLE_STUDENT');
      setIsStudent(hasStudentRole);
    };
    
    checkRole();
    window.addEventListener('storage', checkRole);
    return () => window.removeEventListener('storage', checkRole);
  }, []);
  
  const listItemTestStyle = {
    '& .MuiListItemText-primary': {
      fontSize: '10px',
      color: '#727272',
      transition: 'color 0.3s ease',
    }
  }
  
  const selectedListItemTextStyle = {
    '& .MuiListItemText-primary': {
      fontSize: '10px',
      color: '#1976d2',
      transition: 'color 0.3s ease',
    }
  }

  const getListItemStyles = (path) => {
    const isSelected = currentPath === path;
    
    return {
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.08)' : 'transparent',
      transition: 'background-color 0.3s ease',
      '&:hover': {
        backgroundColor: isSelected ? 'rgba(25, 118, 210, 0.12)' : 'rgba(0, 0, 0, 0.04)',
      },
      '&::before': isSelected ? {
        content: '""',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '4px',
        height: '100%',
        backgroundColor: '#1976d2',
        animation: 'slideIn 0.3s ease',
      } : {}
    };
  };

  return (
    <Drawer
      sx={{
        width: 67,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 67,
          boxSizing: 'border-box',
          bgcolor: '#EBEBEB',
          overflowX: 'hidden',
          "& .MuiList-root": {
            padding: 0
          },
          '@keyframes slideIn': {
            from: { height: 0 },
            to: { height: '100%' },
          },
        },
        zIndex: 0
      }}
      variant="permanent"
      anchor="left"
    >
      <Typography variant="h6" sx={{ padding: 2, textAlign: 'center', color: 'white' }}>
      </Typography>
      <List sx={{marginTop: '15px'}}>
        <ListItem 
          sx={getListItemStyles('/groups')} 
          button 
          component={Link} 
          to="/groups"
        >
          <ListItemIcon sx={{display: 'flex', justifyContent: 'center'}}>
            <GroupIcon sx={{ 
              color: currentPath === '/groups' ? '#1976d2' : '#727272',
              transition: 'color 0.3s ease'
            }} />
          </ListItemIcon>
          <ListItemText primary="Groups" sx={currentPath === '/groups' ? selectedListItemTextStyle : listItemTestStyle} />
        </ListItem>

        <ListItem 
          sx={getListItemStyles('/profile')} 
          button 
          component={Link} 
          to="/profile"
        >
          <ListItemIcon sx={{display: 'flex', justifyContent: 'center'}}>
            <AccountCircleIcon sx={{ 
              color: currentPath === '/profile' ? '#1976d2' : '#727272',
              transition: 'color 0.3s ease'
            }} />
          </ListItemIcon>
          <ListItemText primary="Account" sx={currentPath === '/profile' ? selectedListItemTextStyle : listItemTestStyle} />
        </ListItem>

        {isStudent && (
          <ListItem 
            sx={getListItemStyles('/student/face-registration')} 
            button 
            component={Link} 
            to="/student/face-registration"
          >
            <ListItemIcon sx={{display: 'flex', justifyContent: 'center'}}>
              <FaceIcon sx={{ 
                color: currentPath === '/student/face-registration' ? '#1976d2' : '#727272',
                transition: 'color 0.3s ease'
              }} />
            </ListItemIcon>
            <ListItemText primary="Face" sx={currentPath === '/student/face-registration' ? selectedListItemTextStyle : listItemTestStyle} />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
}

export default Sidebar;
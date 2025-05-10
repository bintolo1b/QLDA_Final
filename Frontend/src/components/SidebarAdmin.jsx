import React from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Typography } from '@mui/material';
import { Group as GroupIcon, Assignment as AssignmentIcon, Notifications as ActivityIcon} from '@mui/icons-material';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import { Link } from 'react-router-dom';

function SidebarAdmin() {
  const listItemTestStyle = {
    '& .MuiListItemText-primary': {
      fontSize: '10px',
      color: '#727272'
    }
  }
  return (
    <Drawer
      sx={{
        width: 67,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 67,
          boxSizing: 'border-box',
          bgcolor: '#EBEBEB',
        },
        zIndex: 0
      }}
      variant="permanent"
      anchor="left"
    >
      <Typography variant="h6" sx={{ padding: 2, textAlign: 'center', color: 'white' }}>
      </Typography>
      <List sx={{marginTop: '10px'}}>
        <ListItem sx={{display: 'flex', flexDirection: 'column'}} button component={Link} to="/adminHome">
          <ListItemIcon sx={{display: 'flex', justifyContent: 'center'}}>
            <GroupIcon sx={{ color: '#727272' }} />
          </ListItemIcon>
          <ListItemText primary="HomePage" sx={listItemTestStyle} />
        </ListItem>
       
      </List>
    </Drawer>
  );
}

export default SidebarAdmin;
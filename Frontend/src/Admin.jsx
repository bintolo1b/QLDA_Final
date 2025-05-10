import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePageAdmin from './pages/HomePageAdmin';
import SidebarAdmin from './components/SidebarAdmin';

function Admin() {
  return (

    <Router style='width: 100%'>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' , overflowY: "hidden" }}>
        <Header/>

        <Box sx={{ display: 'flex', flexGrow: 1, marginTop: '49px', height: '100%' }}>
          <SidebarAdmin />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              width:'100%',
              bgcolor: 'background.default',
              padding: '24px',
              overflow: 'auto',
              marginBottom: '24px'
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/adminHome" />} />
              <Route path="/adminHome" element={<HomePageAdmin />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </Router>
  );
}

export default Admin;

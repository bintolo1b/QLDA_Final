import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GroupsPage from './pages/GroupsPage';
import AssignmentPage from './pages/AssignmentPage';
import Activity from './pages/Activity';
import Chat from './pages/Chat';
import GeneralClass from './pages/class/GeneralClass';
import HomeClass from './pages/class/HomeClass';
import CalendarPage from './pages/CalendarPage';
import AttendancePage from './pages/AttendancePage';
import StudentGroupsPage from './pages/StudentGroupsPage';
import FaceRegistrationPage from './pages/FaceRegistrationPage';
import CheckAttendancePage from './pages/CheckAttendancePage';
import AccountProfilePage from './pages/AccountProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import ClassPage from './pages/ClassPage';

// Component để xác định hiển thị trang GroupsPage hay StudentGroupsPage
const GroupsRouter = () => {
  const [isTeacher, setIsTeacher] = useState(false);
  
  useEffect(() => {
    const checkRole = () => {
      const roles = localStorage.getItem('roles');
      const hasTeacherRole = roles && roles.includes('ROLE_TEACHER');
      console.log("GroupsRouter - checking roles:", roles, "Is teacher:", hasTeacherRole);
      setIsTeacher(hasTeacherRole);
    };
    
    checkRole();
    
    // Re-check mỗi khi component được mount
    window.addEventListener('storage', checkRole);
    return () => window.removeEventListener('storage', checkRole);
  }, []);
  
  return isTeacher ? <GroupsPage /> : <StudentGroupsPage />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/face-registration" element={<FaceRegistrationPage />} />
          <Route
            path="/*"
            element={
              <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: "hidden" }}>
                <Header />
                <Box sx={{ display: 'flex', flexGrow: 1, marginTop: '49px', height: '100%' }}>
                  <Sidebar />
                  <Box
                    component="main"
                    sx={{
                      flexGrow: 1,
                      width: '100%',
                      bgcolor: 'background.default',
                      padding: 0,
                      overflow: "auto !important",
                    }}
                  >
                    <Routes>
                      <Route path="/" element={<Navigate to="/groups" replace />} />
                      <Route path="/groups" element={<GroupsRouter />} />
                      <Route path="/assignment" element={<AssignmentPage />} />
                      <Route path="/activities/*" element={<Activity />} />
                      <Route path="/chats/*" element={<Chat />} />
                      <Route path="/class/:id" element={<ClassPage />} />
                      <Route path="/calendar/:classId" element={<CalendarPage />} />
                      <Route path="/calendar/attendance/:classId" element={<AttendancePage />} />
                      <Route path="/calendar/attendance/check/:classId" element={<CheckAttendancePage />} />
                      <Route path="/profile" element={<AccountProfilePage />} />
                    </Routes>
                  </Box>
                </Box>
              </Box>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;

import { Box } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { memo, useState, useEffect } from "react";
import MenuButton from "./MenuButton";
import Tooltip from '@mui/material/Tooltip';
import { stringAvatar } from "../utils/helper"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from "react-router-dom"
import api from "../api/axios";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

function Card({groupTeamName, classId, onHideStatusChange, initialHidden = false}) {
    const navigate = useNavigate();
    const [isHidden, setIsHidden] = useState(initialHidden);
    const [openRenameDialog, setOpenRenameDialog] = useState(false);
    const [openQuitDialog, setOpenQuitDialog] = useState(false);
    const [openStudentListDialog, setOpenStudentListDialog] = useState(false);
    const [newClassName, setNewClassName] = useState(groupTeamName);
    const [isTeacher, setIsTeacher] = useState(false);
    const [isStudent, setIsStudent] = useState(false);
    const [students, setStudents] = useState([]);

    useEffect(() => {
        setIsHidden(initialHidden);
        const roles = localStorage.getItem('roles');
        setIsTeacher(roles && roles.includes('ROLE_TEACHER'));
        setIsStudent(roles && roles.includes('ROLE_STUDENT'));
    }, [initialHidden]);

    const fetchStudents = async () => {
        try {
            const response = await api.get(`/api/classes/${classId}/students`, {
                withCredentials: true
            });
            setStudents(response.data);
        } catch (error) {
            console.error('Error fetching students:', error);
        }
    };

    const handleHideUnhide = async (e) => {
        e.stopPropagation();
        try {
            const roles = localStorage.getItem('roles');
            if (roles && roles.includes('ROLE_STUDENT')) {
                await api.patch(`/api/student-class/updateHidden/${classId}`, {}, {
                    withCredentials: true
                });
                const newHiddenState = !isHidden;
                setIsHidden(newHiddenState);
                if (onHideStatusChange) {
                    onHideStatusChange(classId, newHiddenState);
                }
            } else if (roles && roles.includes('ROLE_TEACHER')) {
                await api.patch(`/api/classes/updateHiddenToTeacher/${classId}`, {}, {
                    withCredentials: true
                });
                const newHiddenState = !isHidden;
                setIsHidden(newHiddenState);
                if (onHideStatusChange) {
                    onHideStatusChange(classId, newHiddenState);
                }
            }
        } catch (error) {
            console.error('Error updating hide status:', error);
        }
    };

    const handleRename = async () => {
        try {
            await api.patch(`/api/classes/rename/${classId}`, 
                { newName: newClassName },
                { withCredentials: true }
            );
            setOpenRenameDialog(false);
            window.location.reload();
        } catch (error) {
            console.error('Error renaming class:', error);
        }
    };

    const handleQuit = async () => {
        try {
            await api.delete(`/api/student-class/quit/${classId}`, {
                withCredentials: true
            });
            setOpenQuitDialog(false);
            window.location.reload();
        } catch (error) {
            console.error('Error quitting class:', error);
        }
    };

    const handleOpenStudentList = async (e) => {
        e.stopPropagation();
        await fetchStudents();
        setOpenStudentListDialog(true);
    };

    const menuItemsList = [
        {
            title: "Information",
            onClick: (e) => {
                e.stopPropagation();
                navigate(`/class/${classId}`)
            }
        },
        {
            title: isHidden ? "Unhide" : "Hide",
            onClick: handleHideUnhide
        },
        {
            title: "View Students",
            onClick: handleOpenStudentList
        }
    ];

    // Add rename option only for teachers
    if (isTeacher) {
        menuItemsList.push({
            title: "Rename",
            onClick: (e) => {
                e.stopPropagation();
                setOpenRenameDialog(true);
            }
        });
    }

    // Add quit option only for students
    if (isStudent) {
        menuItemsList.push({
            title: "Quit Class",
            onClick: (e) => {
                e.stopPropagation();
                setOpenQuitDialog(true);
            }
        });
    }

    // Tạo avatar props an toàn, kiểm tra nếu groupTeamName không tồn tại
    const avatarData = stringAvatar(groupTeamName);
    const avatarProps = {
        sx: { 
          bgcolor: avatarData.color,
          width: 72,
          height: 72,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'scale(1.05)',
          }
        },
        children: avatarData.initials
      };

    return (
        <>
            <Box  
                sx={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    width: "350px",
                    height: "auto",
                    backgroundColor: "#fff",
                    borderRadius: "8px",
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.16)',
                    '&:hover':{
                        backgroundColor: '#F8F9FA',
                        cursor: 'pointer'
                    },
                }}
                onClick={() => navigate(`/calendar/${classId}`)}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: "10px",
                        width: "100%"
                    }}
                >
                    <Avatar  
                        variant="rounded"
                        onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/calendar/${classId}`);
                        }}    
                        {...avatarProps} 
                    />
                    <Tooltip title={groupTeamName || "Không có tên"} arrow>
                        <span 
                           
                        onClick={(event) => {
                            event.stopPropagation();
                            navigate(`/calendar/${classId}`);    
                        }}       

                        style={{
                            display: "-webkit-box",
                            WebkitLineClamp: "2",
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            fontWeight: "500",
                            transition: "color 0.2s ease",
                            color: "#333",
                        }}>
                            {groupTeamName || "Không có tên"}
                        </span>
                    </Tooltip>
                    <div onClick={(e) => e.stopPropagation()}>
                        <MenuButton menuItem={menuItemsList} />
                    </div>
                </Box>
                <Box
                    sx={{marginTop: "10px"}}
                    
                >
                    <Tooltip title="Announcements">
                        <IconButton>
                            <NotificationsActiveIcon
                                sx={{
                                    '&:hover': {
                                        fill: '#1976d2', 
                                    },
                                }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Assignments">
                        <IconButton>
                            <BusinessCenterIcon
                                sx={{
                                    '&:hover': {
                                        fill: '#1976d2', 
                                    },
                                }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Class work">
                        <IconButton>
                            <SquareFootIcon
                                sx={{
                                    '&:hover': {
                                        fill: '#1976d2', 
                                    },
                                }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>

            {/* Rename Dialog */}
            <Dialog open={openRenameDialog} onClose={() => setOpenRenameDialog(false)}>
                <DialogTitle>Rename Class</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="New Class Name"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRenameDialog(false)}>Cancel</Button>
                    <Button onClick={handleRename} variant="contained" color="primary">
                        Rename
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Quit Dialog */}
            <Dialog open={openQuitDialog} onClose={() => setOpenQuitDialog(false)}>
                <DialogTitle>Quit Class</DialogTitle>
                <DialogContent>
                    <p>Are you sure you want to quit this class? This action cannot be undone.</p>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenQuitDialog(false)}>Cancel</Button>
                    <Button onClick={handleQuit} variant="contained" color="error">
                        Quit Class
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Student List Dialog */}
            <Dialog 
                open={openStudentListDialog} 
                onClose={() => setOpenStudentListDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Student List</DialogTitle>
                <DialogContent>
                    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {students.map((student, index) => (
                            <div key={student.id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar 
                                            src={`${api.defaults.baseURL}/avatars/${student.username}.jpg`}
                                            alt={student.name}
                                        />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={student.name}
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {student.username}
                                                </Typography>
                                                <br />
                                                {student.email}
                                                <br />
                                                {student.phone}
                                            </>
                                        }
                                    />
                                </ListItem>
                                {index < students.length - 1 && <Divider variant="inset" component="li" />}
                            </div>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenStudentListDialog(false)}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default Card;
import { Box } from "@mui/material";
import Avatar from '@mui/material/Avatar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { memo } from "react";
import MenuButton from "./MenuButton";
import Tooltip from '@mui/material/Tooltip';
import { stringAvatar } from "../utils/helper"
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import IconButton from '@mui/material/IconButton';
import { useNavigate } from "react-router-dom"

function Card({groupTeamName, classId}) {
    const navigate = useNavigate();

    const menuItemsList = [
        {
            title: "Information",
            onClick: (e) => {
                e.stopPropagation();
                navigate(`/class/${classId}`)
                console.log("join")
                // navigate("/class")
            }
        },
        {
            title: "Back",
            onClick: (e) => {
                e.stopPropagation();
                console.log("Back")
            }
        },
    ]

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
        </>
    )
}

export default Card;
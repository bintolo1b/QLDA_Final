import { Box, colors, IconButton, Typography, TextField } from "@mui/material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SearchIcon from '@mui/icons-material/Search';
import ActivityCard from "../components/Activity/ActivityCard";
import { useState } from "react";
import CPNB from "../components/Activity/CPNB";
import CPNA from "../components/Activity/CPNA";
import ThreeHorizontalDotsMenu from "../components/Activity/ThreeHorizontalDotsMenu";
import {Routes, Route} from 'react-router-dom' 
import CurrentChatBox from "../components/Chat/CurrentChatBox";
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ChatNotificationCard from "../components/Chat/ChatNotificationCard";


function Chat() {
    const [activatedCard, setActivatedCard] = useState(0)
    const [isEnabledThreeHorizontalDotsMenu, setIsEnabledThreeHorizontalDotsMenu] = useState(false)
    const [enableChatFilter, setEnableChatFilter] = useState(false)

    const cardContents = [
        { id: 0, component: <CPNA /> },
        { id: 1, component: <CPNA /> },
        { id: 2, component: <CPNA /> },
    ]

    const chatWord = {
        fontWeight: 700,
        fontSize: "18px"
    }

    const scrollStyle = {
        "&::-webkit-scrollbar": {
            width: "6px", // Giảm độ rộng thanh cuộn dọc
            height: "6px", // Giảm độ cao thanh cuộn ngang
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#BDBDBD", // Màu của thanh cuộn
            borderRadius: "10px",
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "#F5F5F5", // Màu nền của vùng scroll
        },
    };

    const fillter = {
        padding: "8px 17px",
        border: "1px solid #CECECE",
        borderRadius: "15px",
        fontSize: "13px",
        margin: "2px 0",
        '&:hover':{
            backgroundColor: '#E6E6E6',
            cursor: 'pointer'
        }

    }

    const icon = {
        margin: "auto 5px",
        transition: "color 0.1s ease"
    }

    const container = {
        display: "flex",
        width: '100%',
        height: "95vh",
 
    }


    const chatCardContainer = {
        width: "30%",
        backgroundColor: "#F5F5F5",
        overflowY: "auto", // Hiện scrollbar khi nội dung quá dài
        height: "100%", // Đảm bảo chiều cao là 100% chiều cao của cha,
        ...scrollStyle,
        flexShrink: 0,
    }

    const chat_topside_card_container = {
        padding: "14px 25px",
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "solid 1px #E4E4E4"
    }

    const threeDotIcon = {
        ...icon,
        '&:hover': {
            color: '#5B5FC7',
            cursor: 'pointer'
        },
    }

    const lookUpIcon = {
        ...icon,
        '&:hover': {
            color: '#5B5FC7',
            cursor: 'pointer'
        },
    }

    const statusContainer = {
        display: "flex",
        justifyContent: "space-around",
        flexWrap: "wrap",
        margin: "9px 0"
    }

    const contentContainer = {
        display: 'flex',
        flex: '1',
        flexDirection: 'column',
        overflowY: "hidden", 
        height: "100%",
    }

    const chatTopSideAndStatusContainter = {
        position: 'sticky',
        top: '0px', // Đảm bảo nó có khoảng để dính vào
        backgroundColor: '#F5F5F5', // Nếu không có nền, có thể bị ẩn
        zIndex: 10, // Đảm bảo nó nổi trên các phần khác,
        padding: '0 0 2px 0',
        borderRadius: '3px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
    }


    const iconTopSideContainer = {
        display: 'inline-block',
        position: 'relative'
    }
    
    const cards = [];
    for (let i = 0; i < 20; i++) {
        cards.push(<ChatNotificationCard key={i} link={i%2==0?'/chats/chat1':'/chats/cpnb'} onClick={() => setActivatedCard(i)}  isEnabled = {i===activatedCard?true:false}/>);
    }

    const filterText = {
        width: '90%',
        outline: 'none',
        padding: '5px 10px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        borderBottom: '2px solid transparent',
        transition: 'border-bottom 0.3s ease-in-out',
        '& .MuiInputBase-input': {
            fontSize: '13px', // Chỉnh font-size chữ nhập vào
        },
        '& .MuiInputBase-input::placeholder': {
            fontSize: '13px', // Chỉnh font-size placeholder
            opacity: 0.7, // Giảm độ đậm của placeholder
        }
    };
    

    return (
        <Box sx={container}>
            <Box sx={chatCardContainer}>
                <Box sx={chatTopSideAndStatusContainter}>
                    <Box sx={chat_topside_card_container}>
                        <Box style={chatWord}>Trò truyện</Box>
                        <div>
                            <div 
                                style={iconTopSideContainer} 
                                onClick={() => setIsEnabledThreeHorizontalDotsMenu(!isEnabledThreeHorizontalDotsMenu)}
                                onBlur={() => setIsEnabledThreeHorizontalDotsMenu(false)}
                                tabIndex={0} // Cần để `onBlur` hoạt động trên div
                                >

                                    <MoreHorizIcon sx={threeDotIcon}  />
                                    {isEnabledThreeHorizontalDotsMenu && <ThreeHorizontalDotsMenu />}
                            </div>
                            <FilterAltIcon onClick={()=>setEnableChatFilter(!enableChatFilter)} sx={lookUpIcon}/>      
                        </div>
                    </Box>

                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                        {enableChatFilter && <TextField variant="standard" placeholder="Lọc theo tên đoạn chat" sx={filterText}
                            inputProps={{
                                style: { fontSize: '13px' } // Dành cho chữ nhập vào (nếu không dùng sx)
                            }}
                        />}
                    </Box>
                </Box>
                
                {cards}
            </Box>

            <Box sx={contentContainer}>
                <Routes>
                    <Route path='chat1' element={<CurrentChatBox />}/>
                    <Route path='cpnb' element={<CPNB />}/>
                </Routes>
            </Box>
        </Box>
    );
}

export default Chat;
import React, { useState } from "react";
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import AddIcon from '@mui/icons-material/Add';
import Typography from '@mui/material/Typography';
import EveryoneCard from "./EveryoneCard";
import ChatTextCard from "./ChatTextCard";
import { Box } from "@mui/material";

const CurrentChatBox = () => {
    const [filter, setFilter] = useState(0)
    const [enableMoreOptions, setEnableMoreOptions] = useState(false)

    const styles = {
            chatContainer: {
            background: "#fff",
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
        },
        chatHeader: {
            padding: "13.5px",
            borderBottom: "1px solid #e0e0e0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: 'relative'
        },
        chatHeaderLeft: {
            display: "flex",
            alignItems: "center",
            gap: "21px",
        },
        chatHeaderRight: {
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginRight: '15px'
        },
        chatTitle: {
            fontSize: "16px",
            fontWeight: "600",
        },
        
        chatInput: {
            // position: 'absolute',
            // bottom: '0',
            padding: "15px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            width: '100%',
            backgroundColor: '#fff'
        },
        input: {
            flex: '3',
            padding: "10px 15px",
            border: "1px solid #e0e0e0",
            borderRadius: "10px",
            outline: "none",
            fontSize: "14px",
            minHeight: "40px",
            resize: "none"
        },
        chatInputActions: {
            display: "flex",
            gap: "10px",
            flex: '1',
            alignItems: 'center'
        },
        actionButton: {
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#666",
            fontSize: "20px",
        },
        sendButton: {
            background: "#0078d4",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: "35px",
            height: "35px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
        },
        userAvatar: {
            width: "32px",
            height: "32px",
            borderRadius: "50%",
            backgroundColor: "#e0e0e0",
        },
        groupInfo: {
            display: "flex",
            alignItems: "center",
            gap: "21px",
        },
    };

    

    return (
        <div style={styles.chatContainer}>
            <div style={styles.chatHeader}>
                <div style={styles.chatHeaderLeft}>
                   
                    <img style={styles.userAvatar} src="https://images.pexels.com/photos/56866/garden-rose-red-pink-56866.jpeg?cs=srgb&dl=pexels-pixabay-56866.jpg&fm=jpg" alt="" />
                   
                    <div style={styles.groupInfo}>
                        <span style={styles.chatTitle}>QLDA_22NH11_TTL</span>
                        <DriveFileRenameOutlineIcon/>
                        <Typography sx={{
                            color: filter==0?'#5B5FC7':'black',
                            fontWeight: '350',
                            '&:hover':{
                                cursor: 'pointer',
                                color:'#5B5FC7'
                            }
                        }} onClick={()=>setFilter(!filter)}>Trò chuyện</Typography>
                        <Typography sx={{
                            color: filter==1?'#5B5FC7':'black',
                            fontWeight: '350',
                            '&:hover':{
                                cursor: 'pointer',
                                color:'#5B5FC7'
                            }
                        }} onClick={()=>setFilter(!filter)}>Chia sẻ</Typography>
                    </div>
                </div>
                <div style={styles.chatHeaderRight}>
                    <AddIcon sx={{
                        '&:hover':{
                            cursor: 'pointer',
                            color:'#5B5FC7'
                        }
                    }}/>
                    <Typography onClick = {()=>setEnableMoreOptions(!enableMoreOptions)} sx={{
                        '&:hover':{
                            cursor: 'pointer',
                            color: '#5B5FC7'
                        }
                    }}
                    >•••</Typography >
                </div>
                
                {enableMoreOptions && <EveryoneCard />}

            </div>
            
            <Box sx={{overflowY: 'auto', flex: '1'}}>
                <ChatTextCard typeOfText='taken'/>
                <ChatTextCard typeOfText='send'/>
                <ChatTextCard typeOfText='taken'/>
                <ChatTextCard typeOfText='taken'/>
                <ChatTextCard typeOfText='send'/>
            </Box>
            

            <div style={styles.chatInput}>
                <textarea placeholder="Nhập tin nhắn" style={styles.input}></textarea>
                <div style={styles.chatInputActions}>
                    <button style={styles.actionButton}>📎</button>
                    <button style={styles.actionButton}>😊</button>
                    <button style={styles.actionButton}>🖼️</button>
                    <button style={styles.sendButton}>➤</button>
                </div>
            </div>
        </div>
    );
};

export default CurrentChatBox;
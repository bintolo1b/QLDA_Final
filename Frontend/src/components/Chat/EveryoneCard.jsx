import { List, ListItem, Typography } from "@mui/material";
import React from "react";

function EveryoneCard() {
    const styles = {
        card: {
          zIndex: '3',
          width: "280px",
          background: "#fff",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
          padding: "16px",
          fontFamily: "Arial, sans-serif",
          position: 'absolute',
          right: '25px',
          bottom: '-336px'
        },
        avatar: {
          width: "25px",
          height: "25px",
          borderRadius: "50%",
          marginRight: "10px"
        },
        name: {
          fontSize: "16px",
          fontWeight: "bold"
        },
        tag: {
          fontSize: "14px",
          color: "green",
          marginLeft: "5px"
        },
        actions: {
          marginTop: "15px",
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          
        },
        button: {
          padding: "8px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          background: "#f0f0f0",
          fontSize: '14px',
          textAlign:'left'
        }
        
      };
      
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
    
    const users = [
    { name: "Hồ Quý Ly", avatar: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_4x3.jpg", isYou: false },
    { name: "Trần Xuân Tài", avatar: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_4x3.jpg", isYou: true },
    { name: "Trinh Cong Duyyyyyyyyyyyyyyyyyyyyyyyyyyyyy", avatar: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_4x3.jpg", isYou: false },
    { name: "Võ Văn Tuấn", avatar: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_4x3.jpg", isYou: false },
    { name: "Võ Văn Tuấn", avatar: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_4x3.jpg", isYou: false },
    { name: "Võ Văn Tuấn", avatar: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_4x3.jpg", isYou: false },
    { name: "Võ Văn Tuấn", avatar: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_4x3.jpg", isYou: false },
    { name: "Võ Văn Tuấn", avatar: "https://i.natgeofe.com/n/4f5aaece-3300-41a4-b2a8-ed2708a0a27c/domestic-dog_thumb_4x3.jpg", isYou: false },
    ];
  return (
    <div style={styles.card}>
      <Typography sx={{fontSize: '15px', fontWeight: '400', color: '#686868', marginLeft: '10px'}}>Mọi người</Typography>
      <List sx={{borderBottom: 'solid 1px #ccc', maxHeight: '200px', overflowY: 'auto', ...scrollStyle, overflowX: 'hidden'}}>
        {users.map((user, index) => (
          <ListItem key={index} style={{ display: "flex", alignItems: "center", overflow: 'hidden'}}>
            <img src={user.avatar} alt={user.name} style={styles.avatar} />
            <Typography sx={{
                display: "inline-block",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "200px",
                fontWeight: '300',
                fontSize: '14px'
            }}>{user.name}</Typography>
            {user.isYou && <span style={styles.tag}>Bạn</span>}
          </ListItem>
        ))}
      </List>
      <div style={styles.actions}>
        <button style={styles.button}>➕ Thêm người</button>
        <button style={styles.button}>🚪 Rời khỏi</button>
      </div>
    </div>
  );
};

export default EveryoneCard;

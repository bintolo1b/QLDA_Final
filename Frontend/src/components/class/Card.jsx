import { Box, Button, Input, TextField, Typography } from "@mui/material";
import { useRef, useState } from "react";
import Comment from "./Comment";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SendIcon from '@mui/icons-material/Send';

function Card() {
    const sendButtonRef = useRef(null);
    const [focusReply, setFocusReply] = useState(false);
    const [textComment, setTextComment] = useState('');
    const [hiddenComment, setHiddenComment] = useState(false);

    function blurTextFieldComment(event) {
        if (event.relatedTarget === sendButtonRef.current) {
            setFocusReply(false);
        };
    }

    function sendComment() {
        // setFocusReply(false);
    }

    return (
        <Box sx={styles.container}>
            <Box sx={styles.information}>
                <Box sx={styles.avatar} component="img" src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"></Box>
                <Typography sx={styles.name}>nkduy@dut.udn.vn</Typography>
                <Typography sx={styles.date}>4:31 PM</Typography>
            </Box>
            <Typography sx={styles.title}>Kiem tra giua ky</Typography>
            <Typography sx={styles.description}>Đăng ký và chuẩn bị trình bày về Cảm biến (BT1 thi GK)
                            Các nhóm nhập tên cảm biến kèm mã hiệu vào link (Hạn: trước buổi học tuần sau): https://docs.google.com/spreadsheets/d/170lqbuodF_2oJUdViR-F565ATcvn6Jc3/edit?usp=sharing&ouid=114017105272758041500&rtpof=true&sd=true
                            Từ tuần sau, 5 nhóm b/c trong 1 buổi học. Mỗi nhóm cần chuẩn bị: slide trình bày các thông số của cảm biến, các chân và tác dụng, sơ dồ lắp mạch, nguyên lý HĐ của mạch dùng để demo.
                            Y/c BT này: 1. dùng ngắt để xử lý sự kiện (ngắt có thể sinh ra từ nút nhấn hoặc chân Digital Output của cảm biến); 2. xuất ra giá trị của đại lượng vật lý (ko phải điện áp) mà cảm biến đo được trên Serial hoặc LCD.
                            VĐK-2212_DS nhóm.xlsx - Google スプレッドシート
            </Typography>

            <Box sx={styles.comment}>
                {
                    hiddenComment ? <Button onClick={() => setHiddenComment(false)}><KeyboardArrowDownIcon />see more</Button> : (
                        <Box>
                            <Comment />
                            <Button onClick={() => setHiddenComment(true)}><KeyboardArrowUpIcon />hidden</Button>
                        </Box>
                    )
                }
            </Box>

            <Box sx={styles.reply}>
                <Box sx={styles.reply_avatar} component="img" src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"></Box>
                {
                    focusReply ? 
                        <Box sx={{ width: "100%", position: "relative" }}>
                            <TextField
                                sx={styles.reply_textField}
                                label="Enter comment"
                                variant="outlined"  
                                value={textComment}
                                onChange={text => setTextComment(text.target.value)}
                                onBlur={(event) => blurTextFieldComment(event)}
                                fullWidth 
                                autoFocus
                            />
                            <Button sx={styles.sendButton} onClick={() => sendComment()}>
                                <SendIcon sx={styles.sendIcon}/>
                            </Button>
                        </Box>
                    : <Button sx={styles.reply_button} onClick={() => {setFocusReply(true); }}>Reply</Button>
                }
            </Box>
        </Box>
    )
}

export default Card;

const styles = {
    container: {
        borderRadius: "5px",
        boxShadow: "0px 10px 16px 0px",
        padding: "20px",
        width: "100%",
    },
    information: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "15px",
        marginBottom: "20px"
    },
    avatar: {
        width: "50px",
        height: "50px",
        borderRadius: "100%",
    },
    name: {
        color: "#000000",
        fontSize: "18px"
    },
    date: {
        color: "#AAAAAA",
        fontSize: "17px"
    },
    title: {
        fontSize: "35px",
        color: "#000000",
        marginBottom: "20px",
    },
    description: {
        fontSize: "15px",
        color: "#000000",
        borderBottom: "2px solid #444444",
        paddingBottom: "10px",
    },


    comment: {
        marginBottom: "10px",
        padding: "10px 0px",
        borderBottom: "2px solid #444444"
    },
    reply: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
    },
    reply_avatar: {
        width: "30px",
        height: "30px",
        borderRadius: "100%",
    },
    reply_button: {
        color: "#000000",
        "&:hover": {
          color: "#0099FF",
        },
    },
    reply_textField: {
        '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
                borderColor: '#000000',
            }
        },
        color: "#000000",
        '& .MuiInputBase-root': {
            color: '#000000', 
        },
        '& .MuiInputLabel-root.Mui-focused': {
            color: '#000000', 
        },
    },
    sendButton: {
        position: "absolute",
        top: "50%",
        right: "0",
        transform: "translateY(-50%)",
    },
    sendIcon: {

    }
}
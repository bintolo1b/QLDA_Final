import { Box, Typography } from "@mui/material";

function Comment() {
    return (
        <Box sx={styles.container}>
            <Box sx={styles.information}>
                <Box sx={styles.avatar} component="img" src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"></Box>
                <Typography sx={styles.name}>nkduy@dut.udn.vn</Typography>
                <Typography sx={styles.date}>4:00 PM</Typography>
            </Box>
            <Typography sx={styles.description}>usp=sharing&ouid=114017105272758041500&rtpof=true&sd=true Từ tuần sau, 5 nhóm b/c trong 1 buổi học. Mỗi nhóm cần chuẩn bị: slide trình bày các thông số của cảm biến, các chân và tác dụng, sơ dồ lắp mạch, nguyên lý HĐ của mạch dùng để demo. Y/c BT này: 1. dùng ngắt để xử lý sự kiện (ngắt có thể sinh ra từ nút nhấn hoặc chân Digital Output của cảm biến); 2. xuất ra giá trị của đại lượng vật lý (ko phải điện áp) mà cảm biến đo được trên Serial hoặ</Typography>
        </Box>
    )
}

export default Comment;

const styles = {
    container: {
        marginTop: "5px",
    },
    information: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: "15px",
    },
    avatar: {
        width: "30px",
        height: "30px",
        borderRadius: "100%",
    },
    name: {
        color: "#000000",
        fontSize: "15px"
    },
    date: {
        color: "#AAAAAA",
        fontSize: "14px"
    },
    description: {
        fontSize: "14px",
        color: "#000000",
        marginLeft: "45px",
    }
}
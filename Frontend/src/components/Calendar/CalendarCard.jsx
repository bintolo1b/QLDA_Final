import { Box, Typography } from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const styles = {
  container: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "16px",
    width: "90%", // Thay đổi từ width cố định sang phần trăm
    maxWidth: "900px", // Thêm maxWidth để giới hạn độ rộng tối đa
    backgroundColor: "#fff",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    cursor: 'pointer',
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginLeft: '4px',
    marginRight: '4px',
    alignItems: "center",
    marginBottom: "8px",
  },
  dateContainer: {
    display: "flex",
    alignItems: "center",
    gap: "6px", // Khoảng cách giữa icon và text
  },
  statusBox: (status) => ({
    padding: "4px 12px",
    borderRadius: "15px",
    fontWeight: "bold",
    minWidth: "80px",
    textAlign: "center",
    color: "#333",
    fontSize: '14px',
    backgroundColor:
      status === "Passed"
        ? "#FFD700" // Vàng
        : status === "Now"
        ? "#4CAF50" // Xanh lá cây
        : status === "Pending"
        ? "#ccc" // Xám
        : "#f5f5f5", // Mặc định
  }),
  subContainer: {
    display: "flex",
    justifyContent: "space-between",
  },
  boxItem: {
    flex: 1,
    textAlign: "center",
    padding: "8px",
    borderRadius: "4px",
    backgroundColor: "#f5f5f5",
    margin: "4px",
  },
};

function CalendarCard({ date, status, endTime, total, startTime, lessonId }) {
  const navigate = useNavigate()
  
  const handleClick = () => {
    if (status === "Pending") {
      Swal.fire({
        title: 'Thông báo',
        text: 'Lớp học chưa diễn ra!',
        icon: 'info',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const roles = localStorage.getItem('roles');
    if (roles && roles.includes('ROLE_TEACHER')) {
      navigate(`/calendar/attendance/${lessonId}`);
    }else if (roles && roles.includes('ROLE_STUDENT')){
      navigate(`/calendar/attendance/check/${lessonId}`)
    }
  }

  return (
    <Box sx={{
        ...styles.container,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.2)'
        },
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // cursor: localStorage.getItem('roles')?.includes('ROLE_TEACHER') ? 'pointer' : 'default'
        cursor: 'pointer'
      }}
      onClick={handleClick}
      >
      {/* Phần ngày và trạng thái */}
      <Box style={{...styles.dateContainer, flex: 2}}>
        <ScheduleIcon />
        <Typography fontWeight="bold">{date}</Typography>
      </Box>
      
      {/* Phần thời gian */}
      <Box style={{display: 'flex', flex: 2, justifyContent: 'center'}}>
        <Typography variant="body1">{startTime} - {endTime}</Typography>
      </Box>
      
      {/* Phần trạng thái */}
      <Box style={{flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
        <Typography style={styles.statusBox(status)}>{status}</Typography>
      </Box>
    </Box>
  );
}

export default CalendarCard;

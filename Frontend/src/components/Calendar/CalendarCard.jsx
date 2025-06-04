import { Box, Typography, IconButton } from "@mui/material";
import ScheduleIcon from "@mui/icons-material/Schedule";
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2';

const styles = {
  container: {
    border: "1px solid #ddd",
    borderRadius: "8px", 
    padding: "16px",
    width: "90%",
    maxWidth: "900px",
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
    gap: "6px",
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
        ? "#FFD700"
        : status === "Now"
        ? "#4CAF50"
        : status === "Pending"
        ? "#ccc"
        : "#f5f5f5",
  }),
  deleteButton: {
    color: '#d32f2f',
    padding: '4px',
    transition: 'all 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(211, 47, 47, 0.1)',
      transform: 'scale(1.1)',
      boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
    }
  }
};

function CalendarCard({ date, status, endTime, total, startTime, lessonId, onDelete }) {
  const navigate = useNavigate();
  const isTeacher = localStorage.getItem('roles')?.includes('ROLE_TEACHER');
  
  const handleClick = () => {
    if (status === "Pending") {
      Swal.fire({
        title: 'Thông báo!',
        text: 'Buổi học chưa diễn ra!',
        icon: 'info',
        confirmButtonText: 'Đóng',
        confirmButtonColor: '#3085d6',
        customClass: {
          popup: 'swal2-show',
          title: 'swal2-title',
          content: 'swal2-content',
          confirmButton: 'swal2-confirm'
        }
      });
      return;
    }

    const roles = localStorage.getItem('roles');
    if (roles && roles.includes('ROLE_TEACHER')) {
      navigate(`/calendar/attendance/${lessonId}`);
    } else if (roles && roles.includes('ROLE_STUDENT')){
      navigate(`/calendar/attendance/check/${lessonId}`)
    }
  }

  const handleDelete = async (e) => {
    e.stopPropagation();
    
    const result = await Swal.fire({
      title: 'Xác nhận xóa?',
      text: "Bạn không thể hoàn tác sau khi xóa!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    });

    if (result.isConfirmed) {
      onDelete(lessonId);
    }
  };

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
      
      {/* Phần trạng thái và nút xóa */}
      <Box style={{flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px'}}>
        <Typography style={styles.statusBox(status)}>{status}</Typography>
        {isTeacher && status === "Pending" && (
          <IconButton 
            onClick={handleDelete}
            sx={styles.deleteButton}
            size="small"
            aria-label="delete"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}

export default CalendarCard;

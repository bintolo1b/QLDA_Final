import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, FormGroup, FormControlLabel, Checkbox, Typography, IconButton, Grid, Alert } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import { useState } from "react";

function AddGroupButton({ onClassAdded }) {
    const [open, setOpen] = useState(false);
    const [className, setClassName] = useState("");
    const [weekCount, setWeekCount] = useState("");
    const [selectedDays, setSelectedDays] = useState({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        sunday: false
    });
    const [scheduleTime, setScheduleTime] = useState({
        monday: { startTime: "", endTime: "" },
        tuesday: { startTime: "", endTime: "" },
        wednesday: { startTime: "", endTime: "" },
        thursday: { startTime: "", endTime: "" },
        friday: { startTime: "", endTime: "" },
        saturday: { startTime: "", endTime: "" },
        sunday: { startTime: "", endTime: "" }
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleDayChange = (event) => {
        setSelectedDays({
            ...selectedDays,
            [event.target.name]: event.target.checked
        });
    };

    const handleTimeChange = (day, timeType, value) => {
        setScheduleTime({
            ...scheduleTime,
            [day]: {
                ...scheduleTime[day],
                [timeType]: value
            }
        });
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            setErrorMessage("");
            const selectedDaysWithTime = {};
            Object.keys(selectedDays).forEach(day => {
                if (selectedDays[day]) {
                    selectedDaysWithTime[day] = scheduleTime[day];
                }
            });

            const newClass = {
                name: className,
                numberOfWeeks: parseInt(weekCount),
                schedule: selectedDaysWithTime
            };
            
            const response = await fetch('https://localhost:7070/api/classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newClass),
                credentials: 'include'
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                const data = JSON.parse(errorText);
                throw new Error(data.message);
            }
            
            const data = await response.json();
            console.log("Lớp học đã được tạo:", data);
            
            handleClose();
            resetForm();
            
            if (onClassAdded) {
                onClassAdded();
            }
        } catch (error) {
            console.error("Lỗi khi tạo lớp học:", error);
            setErrorMessage(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const resetForm = () => {
        setClassName("");
        setWeekCount("");
        setSelectedDays({
            monday: false,
            tuesday: false,
            wednesday: false,
            thursday: false,
            friday: false,
            saturday: false,
            sunday: false
        });
        setScheduleTime({
            monday: { startTime: "", endTime: "" },
            tuesday: { startTime: "", endTime: "" },
            wednesday: { startTime: "", endTime: "" },
            thursday: { startTime: "", endTime: "" },
            friday: { startTime: "", endTime: "" },
            saturday: { startTime: "", endTime: "" },
            sunday: { startTime: "", endTime: "" }
        });
        setErrorMessage("");
    };

    return (
        <Box>
            <IconButton 
                color="primary" 
                onClick={handleOpen}
                sx={{
                    backgroundColor: '#2196f3',
                    color: 'white',
                    borderRadius: '50%',
                    '&:hover': {
                        backgroundColor: '#1976d2',
                        transform: 'scale(1.1)',
                        boxShadow: '0 8px 15px rgba(33, 150, 243, 0.3)'
                    },
                    width: '64px',
                    height: '64px',
                    boxShadow: '0 4px 8px rgba(33, 150, 243, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
                <AddIcon sx={{ fontSize: 32 }} />
            </IconButton>

            <Dialog 
                open={open} 
                onClose={handleClose} 
                fullWidth 
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.12)',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    backgroundColor: '#2196f3',
                    color: 'white',
                    padding: '20px 24px',
                    fontSize: '1.5rem',
                    fontWeight: '600',
                }}>
                    Thêm lớp học mới
                </DialogTitle>
                <DialogContent sx={{ padding: '32px 24px' }}>
                    {errorMessage && (
                        <Alert 
                            severity="error" 
                            sx={{ 
                                mb: 3,
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(211, 47, 47, 0.1)'
                            }}
                        >
                            {errorMessage}
                        </Alert>
                    )}
                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Tên lớp học"
                            fullWidth
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': {
                                        borderColor: '#2196f3',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2196f3',
                                    },
                                },
                            }}
                        />
                        
                        <Typography variant="h6" sx={{ 
                            mt: 2, 
                            mb: 1,
                            fontWeight: '600',
                            color: '#1976d2'
                        }}>
                            Lịch học trong tuần
                        </Typography>
                        <FormControl component="fieldset">
                            <FormGroup sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: '20px',
                            }}>
                                {Object.entries({
                                    monday: "Thứ 2",
                                    tuesday: "Thứ 3",
                                    wednesday: "Thứ 4",
                                    thursday: "Thứ 5",
                                    friday: "Thứ 6",
                                    saturday: "Thứ 7",
                                    sunday: "Chủ nhật"
                                }).map(([day, label]) => (
                                    <Box key={day} sx={{ 
                                        border: '2px solid #e3f2fd',
                                        borderRadius: '12px',
                                        padding: '16px',
                                        backgroundColor: selectedDays[day] ? '#e3f2fd' : 'white',
                                        transition: 'all 0.3s ease',
                                        '&:hover': { 
                                            backgroundColor: '#e3f2fd',
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.1)'
                                        }
                                    }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox 
                                                    checked={selectedDays[day]} 
                                                    onChange={handleDayChange} 
                                                    name={day} 
                                                    sx={{
                                                        color: '#2196f3',
                                                        '&.Mui-checked': {
                                                            color: '#2196f3',
                                                        }
                                                    }}
                                                />
                                            }
                                            label={<Typography sx={{ fontWeight: 500 }}>{label}</Typography>}
                                        />
                                        {selectedDays[day] && (
                                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Giờ bắt đầu"
                                                        type="time"
                                                        value={scheduleTime[day].startTime}
                                                        onChange={(e) => handleTimeChange(day, 'startTime', e.target.value)}
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        size="small"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '8px',
                                                                color: 'black !important'
                                                            },
                                                            '& .MuiInputBase-input': {
                                                                color: 'black'
                                                            },
                                                            '& .MuiSvgIcon-root': {
                                                                color: 'black'
                                                            }
                                                        }}
                                                        inputProps={{ step: 300 }}
                                                    />
                                                </Grid>
                                                <Grid item xs={6}>
                                                    <TextField
                                                        label="Giờ kết thúc"
                                                        type="time"
                                                        value={scheduleTime[day].endTime}
                                                        onChange={(e) => handleTimeChange(day, 'endTime', e.target.value)}
                                                        InputLabelProps={{ shrink: true }}
                                                        fullWidth
                                                        size="small"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: '8px'
                                                            },
                                                            '& .MuiInputBase-input': {
                                                                color: 'black'
                                                            },
                                                            '& .MuiSvgIcon-root': {
                                                                color: 'black'
                                                            }
                                                        }}
                                                        inputProps={{ step: 300 }}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    </Box>
                                ))}
                            </FormGroup>
                        </FormControl>
                        
                        <TextField
                            label="Số lượng tuần học"
                            type="number"
                            fullWidth
                            value={weekCount}
                            onChange={(e) => setWeekCount(e.target.value)}
                            inputProps={{ min: 1 }}
                            sx={{
                                mt: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                    '&:hover fieldset': {
                                        borderColor: '#2196f3',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#2196f3',
                                    },
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ 
                    padding: '20px 24px',
                    backgroundColor: '#f8f9fa',
                    borderTop: '1px solid #e9ecef'
                }}>
                    <Button 
                        onClick={handleClose}
                        sx={{
                            color: '#6c757d',
                            fontWeight: '600',
                            borderRadius: '8px',
                            padding: '8px 20px',
                            '&:hover': {
                                backgroundColor: '#e9ecef'
                            }
                        }}
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        disabled={isSubmitting || !className || !weekCount || !Object.values(selectedDays).some(value => value)}
                        sx={{
                            backgroundColor: '#2196f3',
                            fontWeight: '600',
                            borderRadius: '8px',
                            padding: '8px 24px',
                            boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
                            '&:hover': {
                                backgroundColor: '#1976d2',
                                boxShadow: '0 6px 16px rgba(33, 150, 243, 0.3)'
                            },
                            '&.Mui-disabled': {
                                backgroundColor: '#e0e0e0',
                                color: '#9e9e9e'
                            }
                        }}
                    >
                        {isSubmitting ? 'Đang xử lý...' : 'Thêm lớp học'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AddGroupButton;
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
                    backgroundColor: '#1976d2',
                    color: 'white',
                    borderRadius: '50%',
                    '&:hover': {
                        backgroundColor: '#1565c0',
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 10px rgba(0, 0, 0, 0.3)'
                    },
                    width: '56px',
                    height: '56px',
                    boxShadow: '0 3px 5px rgba(0, 0, 0, 0.2)',
                    transition: 'all 0.3s ease'
                }}
            >
                <AddIcon />
            </IconButton>

            <Dialog 
                open={open} 
                onClose={handleClose} 
                fullWidth 
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '16px 24px',
                    fontWeight: 'bold',
                    borderBottom: '1px solid #e0e0e0'
                }}>
                    Thêm lớp học mới
                </DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    {errorMessage && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {errorMessage}
                        </Alert>
                    )}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                        <TextField
                            label="Tên lớp học"
                            fullWidth
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                            margin="normal"
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#1976d2',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#1976d2',
                                    },
                                },
                            }}
                        />
                        
                        <Typography variant="subtitle1" sx={{ 
                            mt: 1, 
                            fontWeight: 600,
                            color: '#333'
                        }}>
                            Lịch học trong tuần
                        </Typography>
                        <FormControl component="fieldset">
                            <FormGroup sx={{ 
                                display: 'flex', 
                                flexDirection: 'column',
                                gap: '16px',
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
                                        border: '1px solid #e0e0e0', 
                                        borderRadius: '8px',
                                        padding: '12px',
                                        '&:hover': { backgroundColor: '#f5f5f5' }
                                    }}>
                                        <FormControlLabel
                                            control={<Checkbox checked={selectedDays[day]} onChange={handleDayChange} name={day} color="primary" />}
                                            label={label}
                                            sx={{ marginBottom: '8px' }}
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
                                                        inputProps={{
                                                            step: 300
                                                        }}
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
                                                        inputProps={{
                                                            step: 300
                                                        }}
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
                            margin="normal"
                            inputProps={{ min: 1 }}
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '&:hover fieldset': {
                                        borderColor: '#1976d2',
                                    },
                                    '&.Mui-focused fieldset': {
                                        borderColor: '#1976d2',
                                    },
                                },
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ 
                    padding: '16px 24px',
                    borderTop: '1px solid #e0e0e0',
                    backgroundColor: '#f5f5f5'
                }}>
                    <Button 
                        onClick={handleClose}
                        sx={{
                            color: '#666',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#e0e0e0'
                            }
                        }}
                    >
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleSubmit} 
                        variant="contained" 
                        color="primary"
                        disabled={isSubmitting || !className || !weekCount || !Object.values(selectedDays).some(value => value)}
                        sx={{
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            padding: '8px 24px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                            '&:hover': {
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)'
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
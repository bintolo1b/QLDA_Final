import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import { Box, Typography } from '@mui/material';


function ThreeHorizontalDotsMenu(){
    const threeHorizontalDotsMenu = {
        zIndex: '4',
        position: 'absolute',
        width: '220px',
        left: '-190px',
        backgroundColor: '#FFFFFF',
        padding: '5px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        fontSize: '14px',
        fontWeight: '350',
        borderRadius: '3px'
    }

    return(
        <Box
        sx={threeHorizontalDotsMenu}>
            <Box
                sx={{
                    '&:hover': {
                    backgroundColor: '#F5F5F5',
                    cursor: 'pointer',
                    '& .CheckReadIcon': { color: '#5B5FC7' }
                    },
                    padding: '7px',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
                >
                <FileDownloadDoneIcon className="CheckReadIcon" sx={{fontSize: '20px' }} />
                <Typography sx={{ verticalAlign: 'middle', fontSize: '14px' }}>Đánh dấu tất cả là đã đọc</Typography>
            </Box>
            <Box
                sx={{
                    '&:hover': {
                    backgroundColor: '#F5F5F5',
                    cursor: 'pointer',
                    '& .settingActivateIcon': { color: '#5B5FC7' }
                    },
                    padding: '7px',
                    borderRadius: '3px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
                >
                <SettingsSuggestIcon className="settingActivateIcon" sx={{fontSize: '20px' }} />
                <Typography sx={{ verticalAlign: 'middle', fontSize: '14px' }}>Cài đặt và thông báo</Typography>
            </Box>
        </Box>
)
}

export default ThreeHorizontalDotsMenu
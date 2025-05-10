import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { Box, Typography } from '@mui/material';

function MoreOptionsAtCard(props){
    
    const style = {
        zIndex: '4',
        position: 'absolute',
        width: '220px',
        top: '-9px',
        right: '30px',
        backgroundColor: '#FFFFFF',
        padding: '1px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        fontSize: '13px',
        fontWeight: '350',
        borderRadius: '3px',
    }

    return(
        <Box
            sx={style} 
            onMouseEnter={(event) => event.stopPropagation()}
            onMouseLeave={(event) => event.stopPropagation()}
            onClick={(event) => {
                event.stopPropagation(); // Chặn sự kiện click lan truyền lên thẻ cha
                props.myOnClose();
            }}
        >
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
                <ClearIcon className="CheckReadIcon" sx={{fontSize: '20px' }} />
                <Typography sx={{ verticalAlign: 'middle', fontSize: '13px' }}>Đánh dấu là chưa đọc</Typography>
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
                <DeleteForeverIcon className="settingActivateIcon" sx={{fontSize: '20px' }} />
                <Typography sx={{ verticalAlign: 'middle', fontSize: '13px' }}>Xóa</Typography>
            </Box>
        </Box>
    )
}

export default MoreOptionsAtCard;

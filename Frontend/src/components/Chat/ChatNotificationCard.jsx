import { Box, colors, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import MoreOptionsAtCard from "../Activity/MoreOptionsAtCard";
import { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';


function ChatNotificationCard(props) {
    const isEnabled = props.isEnabled;
    const [enableMoreOptions, setEnableMoreOptions] = useState(false);
    const moreOptionsRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (moreOptionsRef.current && !moreOptionsRef.current.contains(event.target)) {
                setEnableMoreOptions(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const date = {
        float: "right",
        margin: "0 auto",
        fontSize: "14px",
        display: "block",
        fontWeight: '300'
    };
    
    const from = {
        display: "inline-block",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "200px",
        fontSize: '14px'
    };
    
    const activeIcon = {
        width: "32px",
        margin: "0 25px"
    };

    const content = {
        display: "inline-block",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        maxWidth: "200px",
        fontWeight: '300',
        fontSize: '14px'
    };

    const imgAndDateBox = {
        display: "flex",
        flexDirection: "column",
        gap: "3px"
    };

    const container = {
        display: "flex",
        backgroundColor: isEnabled ? "#FFFFFF" : '#F5F5F5',
        margin: "5px 4px",
        padding: "6px 0",
        minHeight: "80px",
        borderRadius: "4px",
        '&:hover': {
            backgroundColor: '#FFFFFF',
            cursor: 'pointer'
        },
        position: 'relative'
    };

    const topicAndThreeDotBox = {
        width: "100%",
    };

    const threeDot = {
        marginRight: '5px',
        '&:hover': {
            cursor: 'pointer',
            color: '#5B5FC7'
        },
        position: 'absolute',
        right: '0',
        bottom: '-10px'
    };

    const cardContent = {
        width: "100%"
    };

    return (    
        <Box sx={container} onClick={props.onClick}>
            <Link to={props.link}   
               style={{ textDecoration: "none", color: "inherit", display: "flex", width: "100%" }}
            >
                <Box sx={imgAndDateBox}>
                    <img style={activeIcon} src="https://res.cdn.office.net/teamsappdata/app-assets/ring3_6/5db56dd0-534d-467b-aeda-d622bee2574a/5db56dd0-534d-467b-aeda-d622bee2574a_largeImage.png?v=1.1.7" alt="" />
                    <span style={date}>3/2</span>
                </Box>
                <Box sx={cardContent}>
                    <Box>
                        <Box sx={topicAndThreeDotBox}>
                            <span style={from}>From: Trinh Cong Duy</span> 
                        </Box>
                        <Box>
                            <span style={content}>Chon de tai di cac ban!</span>
                        </Box>
                    </Box>
                </Box>               
            </Link>

            <Box sx={{ position: 'absolute' , right: '0 ', top: '40px'}} ref={moreOptionsRef}>
                <MoreVertIcon 
                    sx={threeDot} 
                    onClick={(event) => {
                        event.stopPropagation(); // Chặn nổi bọt
                        setEnableMoreOptions(!enableMoreOptions);
                    }}
                />
                {enableMoreOptions && <MoreOptionsAtCard myOnClose={() => setEnableMoreOptions(false)} />}
            </Box>
        </Box>
    );
}

export default ChatNotificationCard
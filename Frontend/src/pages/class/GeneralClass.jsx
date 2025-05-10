import * as React from 'react';
import { Box, Typography, Menu, MenuItem, IconButton, Button, TextField, Input } from "@mui/material";
import { useState } from "react";
import { Navigate, Route, Router, Routes } from "react-router-dom"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SideBarClass from '../../components/class/SideBarClass';
import Card from '../../components/class/Card';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import CloseIcon from '@mui/icons-material/Close';

function GeneralClass () {
    const [checkPost, setCheckPost] = useState(false);
    const [inputTitle, setInputTitle] = useState('');
    const [inputDescription, setInputDescription] = useState('');
    
    return (
        <Box sx={styles.container}>
           <Card/>
           <Card/>
           {
            checkPost 
                ? 
                    <Box sx={styles.formPost}>
                        <Box sx={styles.header}>
                            <Box sx={styles.information}>
                                <Box sx={styles.avatar} component="img" src="https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"></Box>
                                <Typography sx={styles.name}>Le Trung Phong</Typography>
                            </Box>
                            <Button onClick={() => setCheckPost(false)}><CloseIcon/></Button>
                        </Box>
                        <Input 
                            sx={{ color: "#000000" }}
                            placeholder='Title'
                            value={inputTitle}
                            onChange={(text) => setInputTitle(text.target.value)}
                            required
                        />
                        <Input 
                            sx={{ color: "#000000" }}
                            placeholder='Description'
                            value={inputDescription}
                            onChange={(text) => setInputDescription(text.target.value)}
                            required
                        />
                        <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
                            <Button sx={{ height: "45px", width: "100px" }} variant="contained">Post</Button>
                        </Box>
                    </Box> 
                : 
                    <Box sx={styles.buttonPost}>
                        <Button onClick={() => setCheckPost(true)} sx={{ height: "45px" }} variant="contained"><DriveFileRenameOutlineIcon sx={{ mr: 1 }}/> Start a post</Button>
                    </Box>
           }
        </Box>
    )
}

export default GeneralClass;

const styles = {
    container: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "start",
        alignItems: "center",
        width: "100%",
        padding: "20px 10% 20px 10%",
        gap: "25px",
        overflowY: 'auto',
        height: '100vh',
    },
    formPost: {
        width: "100%",
        borderRadius: "5px",
        boxShadow: "0px 10px 16px 0px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
    },
    header: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        justifyContent: "space-between"
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
        color: "#000000"
    },
    buttonPost: {
        width: "100%",
        marginBottom: '70px',
    }
}
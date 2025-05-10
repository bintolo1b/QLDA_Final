import * as React from 'react';
import { Box, Typography, Menu, MenuItem, IconButton, Button } from "@mui/material";
import { useState } from "react";
import { Navigate, Route, Router, Routes } from "react-router-dom"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SideBarClass from '../../components/class/SideBarClass';
import GeneralClass from './GeneralClass';
import GradleClass from './GradleClass';


function HomeClass() {
    return (
        <Box sx={styles.container}>
            <Box sx={styles.sidebar}>
                <SideBarClass />
            </Box>
            <Box sx={styles.content}>
                <Routes>
                    <Route path="/" element={<Navigate to="/class/general" />} /> 
                    <Route path="/general" element={<GeneralClass />} />  
                    <Route path="/gradles" element={<GradleClass />} />  
                </Routes>
            </Box>
        </Box>
    )
}

export default HomeClass;

const styles = {
    container: {
        display: "flex",
        height: "100%",
        width: "100%",
    },
    sidebar: {
        // flex: 1,
        width: "300px"
    },
    content: {
        flex: 1,
    }
}
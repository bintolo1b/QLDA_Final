import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';

function ToggleSection({ label, children }) {
  const [isVisible, setIsVisible] = useState(true);

  const toggleVisibility = () => {
    setIsVisible(prevState => !prevState);
  };

  return (
    <Box
        sx={{marginBottom: "30px"}}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <IconButton 
          onClick={toggleVisibility} 
          sx={{
            transform: isVisible ? 'rotate(0deg)' : 'rotate(90deg)',
            transition: 'transform 0.3s ease',
            padding: '0'
          }}
        >
          {isVisible ? <ExpandMore /> : <ExpandLess />}
        </IconButton>
        <Typography variant="h6" sx={{ marginLeft: '8px' }}>
          {label}
        </Typography>
      </Box>

      {isVisible && (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: "20px", marginLeft: "10px" }}>
          {children}
        </Box>
      )}
    </Box>
  );
}

export default ToggleSection;

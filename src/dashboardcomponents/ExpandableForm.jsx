import React, { useState } from 'react';
import { Box, Paper, Typography, Collapse } from '@mui/material';

const ExpandableForm = ({ title, onSubmit, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleForm = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    onSubmit(event); // Call the provided onSubmit function
  };

  return (
    <Box sx={{ width: '100%', textAlign: 'left', mt: 2 }}>
      <Paper elevation={1} onClick={toggleForm} sx={{ cursor: 'pointer', p: 2 }}>
        <Typography variant="body1">
          {isExpanded ? `Hide ${title}` : title}
        </Typography>
      </Paper>
      <Collapse in={isExpanded}>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {children}
        </Box>
      </Collapse>
    </Box>
  );
};

export default ExpandableForm;
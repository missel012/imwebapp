import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, List, ListItem, ListItemText, IconButton, Box } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';

const PatientListPopup = ({ open, onClose, patients }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPatients = patients.filter((patient) => {
    if (patient.name && searchTerm) {
      return patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Patient List
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <List>
          {filteredPatients.map((patient) => (
            <ListItem key={patient.id} secondaryAction={
              <IconButton edge="end" aria-label="edit">
                <EditIcon />
              </IconButton>
            }>
              <ListItemText
                primary={patient.name}
                secondary={`ID: ${patient.id}`}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close
        </Button>
      </Box>
    </Dialog>
  );
};

export default PatientListPopup;

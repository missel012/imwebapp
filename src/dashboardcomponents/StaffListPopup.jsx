import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Snackbar
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { supabase } from '../supabaseClient'; // Assuming you have supabase client configured

const StaffListPopup = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [staffMembers, setStaffMembers] = useState([]);
  const [filteredStaffMembers, setFilteredStaffMembers] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedStaffMember, setEditedStaffMember] = useState({
    id: '',
    name: '',
    position: '',
    department: ''
  });
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      const { data, error } = await supabase.from('staff').select('*');
      if (error) {
        throw error;
      }
      setStaffMembers(data);
      setFilteredStaffMembers(data);
    } catch (error) {
      console.error('Error fetching staff members:', error.message);
    }
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = staffMembers.filter((staff) => {
      return (
        staff.name.toLowerCase().includes(searchTerm) ||
        staff.position.toLowerCase().includes(searchTerm) ||
        staff.department.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredStaffMembers(filtered);
  };

  const handleEditStaffMember = (staff) => {
    setEditedStaffMember({
      id: staff.id,
      name: staff.name,
      position: staff.position,
      department: staff.department
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    clearEditedStaffMember();
  };

  const clearEditedStaffMember = () => {
    setEditedStaffMember({
      id: '',
      name: '',
      position: '',
      department: ''
    });
  };

  const handleSaveEditedStaffMember = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .update({
          name: editedStaffMember.name,
          position: editedStaffMember.position,
          department: editedStaffMember.department
        })
        .eq('id', editedStaffMember.id);
      
      if (error) {
        throw error;
      }

      const updatedStaff = staffMembers.map((staff) =>
        staff.id === editedStaffMember.id
          ? {
              ...staff,
              name: editedStaffMember.name,
              position: editedStaffMember.position,
              department: editedStaffMember.department
            }
          : staff
      );

      setStaffMembers(updatedStaff);
      setFilteredStaffMembers(updatedStaff);

      handleCloseEditDialog();

      setSuccessMessage('Staff member details successfully updated.');
      setSuccessSnackbarOpen(true);

      console.log('Successfully saved staff member details:', editedStaffMember);
    } catch (error) {
      console.error('Error saving edited staff member:', error.message);
      setErrorMessage('Failed to update staff member details. Please try again.');
      setErrorSnackbarOpen(true);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>
        Staff List
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '16px' }}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          margin="normal"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {filteredStaffMembers.length === 0 ? (
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
            No matches found
          </Typography>
        ) : (
          <List>
            {filteredStaffMembers.map((staff) => (
              <ListItem key={staff.id} secondaryAction={
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditStaffMember(staff)}>
                  <EditIcon />
                </IconButton>
              }>
                <ListItemText
                  primary={staff.name}
                  secondary={`Position: ${staff.position}, Department: ${staff.department}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} fullWidth maxWidth="sm">
        <DialogTitle>Edit Staff Member Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editedStaffMember.name}
            onChange={(e) => setEditedStaffMember({ ...editedStaffMember, name: e.target.value })}
          />
          <TextField
            label="Position"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editedStaffMember.position}
            onChange={(e) => setEditedStaffMember({ ...editedStaffMember, position: e.target.value })}
          />
          <TextField
            label="Department"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editedStaffMember.department}
            onChange={(e) => setEditedStaffMember({ ...editedStaffMember, department: e.target.value })}
          />
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Button onClick={handleSaveEditedStaffMember} variant="contained" color="primary">
              Save
            </Button>
            <Button onClick={handleCloseEditDialog} variant="contained" color="secondary" sx={{ ml: 2 }}>
              Cancel
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
      {/* End Edit Dialog */}

      <Box sx={{ mt: 2, textAlign: 'center', padding: '16px' }}>
        <Button onClick={onClose} variant="contained" color="secondary">
          Close
        </Button>
      </Box>

      {/* Snackbar for error message */}
      <Snackbar
        open={errorSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setErrorSnackbarOpen(false)}
        message={errorMessage}
        severity="error"
      />
      {/* Snackbar for success message */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSuccessSnackbarOpen(false)}
        message={successMessage}
        severity="success"
      />
    </Dialog>
  );
};

export default StaffListPopup;

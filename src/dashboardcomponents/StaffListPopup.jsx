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
import Autocomplete from '@mui/material/Autocomplete';
import { supabase } from '../supabaseClient'; // Assuming you have supabase client configured

const StaffListPopup = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [staffMembers, setStaffMembers] = useState([]);
  const [filteredStaffMembers, setFilteredStaffMembers] = useState([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedStaffMember, setEditedStaffMember] = useState({
    staff_number: '',
    first_name: '',
    telephone: '',
    position_id: ''
  });
  const [positionOptions, setPositionOptions] = useState([]);
  const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchStaffMembers();
    fetchPositionOptions();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('staff_number, first_name, telephone, position_id');
      if (error) {
        throw error;
      }

      // Fetch position name from the staffposition table
      const staffWithPositionName = await Promise.all(
        data.map(async (staff) => {
          const { data: positionData, error: positionError } = await supabase
            .from('staffposition')
            .select('position_id, position_name')
            .eq('position_id', staff.position_id)
            .single();

          if (positionError) {
            throw positionError;
          }

          return {
            ...staff,
            position_name: positionData ? positionData.position_name : ''
          };
        })
      );

      setStaffMembers(staffWithPositionName);
      setFilteredStaffMembers(staffWithPositionName);
    } catch (error) {
      console.error('Error fetching staff members:', error.message);
    }
  };

  const fetchPositionOptions = async () => {
    try {
      const { data, error } = await supabase.from('staffposition').select('position_id, position_name');
      if (error) {
        throw error;
      }
      setPositionOptions(data);
    } catch (error) {
      console.error('Error fetching position options:', error.message);
    }
  };

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filtered = staffMembers.filter((staff) => {
      return (
        staff.first_name.toLowerCase().includes(searchTerm) ||
        staff.position_name.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredStaffMembers(filtered);
  };

  const handleEditStaffMember = (staff) => {
    setEditedStaffMember({
      staff_number: staff.staff_number,
      first_name: staff.first_name,
      telephone: staff.telephone,
      position_id: staff.position_id
    });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    clearEditedStaffMember();
  };

  const clearEditedStaffMember = () => {
    setEditedStaffMember({
      staff_number: '',
      first_name: '',
      telephone: '',
      position_id: ''
    });
  };

  const handleSaveEditedStaffMember = async () => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .update({
          first_name: editedStaffMember.first_name,
          telephone: editedStaffMember.telephone,
          position_id: editedStaffMember.position_id
        })
        .eq('staff_number', editedStaffMember.staff_number);
      
      if (error) {
        throw error;
      }

      const updatedStaff = staffMembers.map((staff) =>
        staff.staff_number === editedStaffMember.staff_number
          ? {
              ...staff,
              first_name: editedStaffMember.first_name,
              telephone: editedStaffMember.telephone,
              position_id: editedStaffMember.position_id
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
              <ListItem key={staff.staff_number} secondaryAction={
                <IconButton edge="end" aria-label="edit" onClick={() => handleEditStaffMember(staff)}>
                  <EditIcon />
                </IconButton>
              }>
                <ListItemText
                  primary={staff.first_name}
                  secondary={`Telephone: ${staff.telephone}, Position: ${staff.position_name}`}
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
            label="First Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editedStaffMember.first_name}
            onChange={(e) => setEditedStaffMember({ ...editedStaffMember, first_name: e.target.value })}
          />
          <TextField
            label="Telephone"
            variant="outlined"
            fullWidth
            margin="normal"
            value={editedStaffMember.telephone}
            onChange={(e) => setEditedStaffMember({ ...editedStaffMember, telephone: e.target.value })}
          />
          <Autocomplete
            value={positionOptions.find(option => option.position_id === editedStaffMember.position_id) || null}
            onChange={(event, newValue) => {
              setEditedStaffMember({ ...editedStaffMember, position_id: newValue ? newValue.position_id : '' })
            }}
            options={positionOptions}
            getOptionLabel={(option) => option.position_name}
            renderInput={(params) => <TextField {...params} label="Position" variant="outlined" />}
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
      />
      {/* Snackbar for success message */}
      <Snackbar
        open={successSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSuccessSnackbarOpen(false)}
        message={successMessage}
      />
    </Dialog>
  );
};

export default StaffListPopup;
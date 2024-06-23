import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Avatar, IconButton, InputAdornment, Snackbar } from '@mui/material';
import { Visibility, VisibilityOff, Edit } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';

const ProfileDialog = ({ open, handleClose }) => {
  const { user, updateProfile } = useAuth();
  const [profile, setProfile] = useState(user);
  const [staffDetails, setStaffDetails] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [currentPasswordVisible, setCurrentPasswordVisible] = useState(false);
  const [isEmailEditable, setIsEmailEditable] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [emailError, setEmailError] = useState('');
  const [positionName, setPositionName] = useState('');

  useEffect(() => {
    setProfile(user);
    if (user?.staff_number) {
      fetchStaffDetails(user.staff_number);
    }
  }, [user]);

  const fetchStaffDetails = async (staffNumber) => {
    try {
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('first_name, last_name, position_id')
        .eq('staff_number', staffNumber)
        .single();

      if (staffError) {
        throw staffError;
      }

      setStaffDetails(staffData);

      const { data: positionData, error: positionError } = await supabase
        .from('staffposition')
        .select('position_name')
        .eq('position_id', staffData.position_id)
        .single();

      if (positionError) {
        throw positionError;
      }

      setPositionName(positionData.position_name);
    } catch (error) {
      console.error('Error fetching staff details:', error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));

    if (name === 'email') {
      validateEmail(value);
    }
  };

  const validateEmail = (email) => {
    if (!email) {
      setEmailError('Email cannot be empty');
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const toggleCurrentPasswordVisibility = () => {
    setCurrentPasswordVisible((prevVisible) => !prevVisible);
  };

  const handleSave = async () => {
    if (!profile.email || !/\S+@\S+\.\S+/.test(profile.email)) {
      setEmailError(!profile.email ? 'Email cannot be empty' : 'Invalid email format');
      return;
    }

    setConfirmDialogOpen(true);
  };

  const handleConfirmSave = async () => {
    try {
      // Validate current password
      const { data: userData, error: userError } = await supabase
        .from('user')
        .select('user_password')
        .eq('userid', profile.userid)
        .single();

      if (userError) {
        throw userError;
      }

      const hashedPasswordFromDatabase = userData.user_password;
      const isCurrentPasswordValid = await bcrypt.compare(profile.currentPassword, hashedPasswordFromDatabase);

      if (!isCurrentPasswordValid) {
        setSnackbarMessage('Current password is incorrect');
        setSnackbarOpen(true);
        return;
      }

      await updateProfile(profile); // Update user profile including password
      await updateUserDataInDatabase(profile); // Update user data in database
      setSnackbarMessage('Profile updated successfully');
      setSnackbarOpen(true);
      handleClose();

      // Clear password fields in profile state
      setProfile((prevProfile) => ({
        ...prevProfile,
        currentPassword: '',
        newPassword: '',
      }));

    } catch (error) {
      console.error('Error updating profile:', error.message);
      setSnackbarMessage('Failed to update profile');
      setSnackbarOpen(true);
    } finally {
      setConfirmDialogOpen(false);
    }
  };

  const updateUserDataInDatabase = async (updatedProfile) => {
    try {
      const { error } = await supabase
        .from('user')
        .update({
          email: updatedProfile.email,
          user_password: updatedProfile.newPassword ? await bcrypt.hash(updatedProfile.newPassword, 10) : undefined, // Hashing new password if provided
        })
        .eq('userid', updatedProfile.userid);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error updating user data in database:', error.message);
      throw error; // Propagate the error if needed
    }
  };

  const handleCancelSave = () => {
    setConfirmDialogOpen(false);
  };

  const handleEditEmail = () => {
    setIsEmailEditable((prevEditable) => !prevEditable);
  };

  const handleCancelEditEmail = () => {
    setIsEmailEditable(false);
    setProfile(user);
    setEmailError('');
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Profile</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <Avatar alt="Profile" src={profile && profile.img} sx={{ width: 100, height: 100 }} />
          <div style={{ marginLeft: '16px' }}>
            {staffDetails && (
              <div>
                <p>{`${staffDetails.first_name} ${staffDetails.last_name}`} | {positionName}</p>
              </div>
            )}
            <p>{`Staff Number: ${profile && profile.staff_number}`}</p>
          </div>
        </div>
        <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
          <TextField
            margin="dense"
            label="Email Address"
            type="email"
            fullWidth
            name="email"
            value={profile ? profile.email : ''}
            onChange={handleChange}
            disabled={!isEmailEditable}
            error={!!emailError}
            helperText={emailError}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  {!isEmailEditable ? (
                    <IconButton onClick={handleEditEmail} edge="end">
                      <Edit />
                    </IconButton>
                  ) : (
                    <IconButton onClick={handleCancelEditEmail} edge="end">
                      <Edit />
                    </IconButton>
                  )}
                </InputAdornment>
              ),
            }}
          />
        </div>
        <TextField
          margin="dense"
          label="Current Password"
          type={currentPasswordVisible ? 'text' : 'password'}
          fullWidth
          name="currentPassword"
          value={profile ? profile.currentPassword : ''}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={toggleCurrentPasswordVisibility} edge="end">
                  {currentPasswordVisible ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <TextField
          margin="dense"
          label="New Password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          name="newPassword"
          value={profile ? profile.newPassword : ''}
          onChange={handleChange}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={togglePasswordVisibility} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary">
          Save Changes
        </Button>
      </DialogActions>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onClose={handleCancelSave}>
        <DialogTitle>Are you sure you want to save changes?</DialogTitle>
        <DialogActions>
          <Button onClick={handleCancelSave} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmSave} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      />
    </Dialog>
  );
};

export default ProfileDialog;

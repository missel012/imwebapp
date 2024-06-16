import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Avatar } from '@mui/material';
import img from '../../img/user.png'; // Ensure this path is correct

const ProfileDialog = ({ open, handleClose, profileData, onSave }) => {
  const [profile, setProfile] = useState(profileData);

  useEffect(() => {
    setProfile(profileData);
  }, [profileData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(profile);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Profile</DialogTitle>
      <DialogContent>
        <div style={{ textAlign: 'center' }}>
          <Avatar alt="Moira" src={img} sx={{ width: 100, height: 100, margin: 'auto' }} />
          <p>Staff Number: S001</p>
        </div>
        <TextField
          margin="dense"
          label="First Name"
          type="text"
          fullWidth
          name="firstName"
          value={profile.firstName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Last Name"
          type="text"
          fullWidth
          name="lastName"
          value={profile.lastName}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Email Address"
          type="email"
          fullWidth
          name="email"
          value={profile.email}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          name="password"
          value={profile.password}
          onChange={handleChange}
        />
        <TextField
          margin="dense"
          label="Access Level"
          type="text"
          fullWidth
          name="accessLevel"
          value={profile.accessLevel}
          onChange={handleChange}
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
    </Dialog>
  );
};

export default ProfileDialog;
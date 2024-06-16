import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Avatar from '@mui/material/Avatar';
import img from '../../img/user.png';
import ProfileDialog from './ProfileDialog'; // Ensure this path is correct
import '../TopNav.css'; // Import the CSS file

const TopNav = () => {
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "Moira",
    lastName: "Samuel",
    email: "Samuel@gmail.com",
    password: "********",
    accessLevel: "Charge Nurse",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = (updatedProfile) => {
    setProfile(updatedProfile);
    handleClose(); // Close the dialog after saving
  };

  return (
    <div className="top-nav">
      <div className="search-bar-container">
        <TextField
          id="outlined-basic"
          label="Search"
          variant="outlined"
          size="small"
          className="search-bar"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </div>
      <div className="profile-container">
        <Avatar alt={profile.firstName} src={img} className="profile-avatar" onClick={handleClickOpen} />
        <span className="profile-name" onClick={handleClickOpen}>{profile.firstName}</span>
      </div>
      <ProfileDialog open={open} handleClose={handleClose} profileData={profile} onSave={handleSave} />
    </div>
  );
};

export default TopNav;

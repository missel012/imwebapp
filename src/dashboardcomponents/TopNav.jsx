import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import ProfileDialog from './ProfileDialog'; // Ensure this path is correct
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import '../TopNav.css'; // Import the CSS file

const TopNav = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    if (user?.staff_number) {
      fetchStaffDetails(user.staff_number);
    }
  }, [user]);

  const fetchStaffDetails = async (staffNumber) => {
    try {
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('first_name, last_name')
        .eq('staff_number', staffNumber)
        .single();

      if (staffError) {
        throw staffError;
      }

      setProfile({
        firstName: staffData.first_name,
        lastName: staffData.last_name,
      });
    } catch (error) {
      console.error('Error fetching staff details:', error.message);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="top-nav">
      <div className="left-text">
        <span className="hospital-name">Wellmeadows Hospital Management System</span>
      </div>
      <div className="profile-container" onClick={handleClickOpen}>
        <Avatar
          alt={`${profile.firstName} ${profile.lastName}`}
          src={user && user.img} // Ensure user.img is correct based on your setup
          className="profile-avatar"
        />
        <span className="profile-name">{`${profile.firstName} ${profile.lastName}`}</span>
      </div>
      <ProfileDialog open={open} handleClose={handleClose} />
    </div>
  );
};

export default TopNav;

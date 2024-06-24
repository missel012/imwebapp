import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';
import '../sidebar.css';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';
import logo from '../../img/logo.png';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth hook

const Sidebar = () => {
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const { logout } = useAuth(); // Get logout function from useAuth

  const handleLogout = () => {
    setLogoutDialogOpen(true);
  };

  const confirmLogout = async () => {
    try {
      console.log('Logging out...');
      await logout(); // Call logout function from useAuth
      setLogoutDialogOpen(false);
      // Redirect to login page
      window.location.href = '/login'; // Redirect using window.location
    } catch (error) {
      console.error('Failed to logout:', error.message);
      // Handle any errors or display an error message to the user
    }
  };

  const cancelLogout = () => {
    setLogoutDialogOpen(false);
  };

  return (
    <div className="sidebar">
      <div className="logo">
        <Link to="/dashboard/welcome">
          <img src={logo} alt="Wellmeadows Hospital Logo" />
        </Link>
      </div>
      <ul>
        <li style={{ fontSize: '5mm' }}>
        <Link to="/dashboard/welcome">
            <HomeIcon style={{ fontSize: 20, marginRight: 5 }} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/dashboard/patient">
            <PersonIcon style={{ fontSize: 20, marginRight: 10, marginTop: '5%' }} />
            Patient
          </Link>
        </li>
        <li>
          <Link to="/dashboard/staff">
            <PeopleIcon style={{ fontSize: 20, marginRight: 10, marginTop: '5%' }} />
            Staff
          </Link>
        </li>
        <li>
          <Link to="/dashboard/wards">
            <LocalHospitalIcon style={{ fontSize: 20, marginRight: 10, marginTop: '5%' }} />
            Wards
          </Link>
        </li>
        <li>
          <Link to="/dashboard/supply">
            <Inventory2Icon style={{ fontSize: 20, marginRight: 10, marginTop: '5%' }} />
            Supply
          </Link>
        </li>
        <li>
          <Link to="/dashboard/prescription">
            <LocalPharmacyIcon style={{ fontSize: 20, marginRight: 10, marginTop: '5%' }} />
            Prescription
          </Link>
        </li>
        <li>
          <Link to="/dashboard/other">
            <OtherHousesIcon style={{ fontSize: 20, marginRight: 10, marginTop: '5%' }} />
            Other
          </Link>
        </li>
      </ul>
      <div className="logout-container">
        <button className="logout" onClick={handleLogout}>Log Out</button>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={logoutDialogOpen} onClose={cancelLogout}>
        <DialogTitle>Are you sure you want to log out?</DialogTitle>
        <DialogContent>
          <p>Logging out will require you to sign in again to access your account.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelLogout} color="secondary">
            Cancel
          </Button>
          <Button onClick={confirmLogout} color="primary">
            Log Out
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Sidebar;

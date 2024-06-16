import React from 'react';
import { Link } from 'react-router-dom';
import '../dashboardstyle.css';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import PeopleIcon from '@mui/icons-material/People';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import OtherHousesIcon from '@mui/icons-material/OtherHouses';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2 style={{color:'#007bff'}}>Wellmeadows Hospital</h2>
      <ul>
        <li style={{fontSize:'5mm'}}>
          <Link to="/welcome">
            <HomeIcon style={{ fontSize: 20, marginRight: 5}} />
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/dashboard/patient">
            <PersonIcon style={{ fontSize: 20, marginRight: 10, marginTop:'5%' }} />
            Patient
          </Link>
        </li>
        <li>
          <Link to="/dashboard/staff">
            <PeopleIcon style={{ fontSize: 20, marginRight: 10, marginTop:'5%' }} />
            Staff
          </Link>
        </li>
        <li>
          <Link to="/dashboard/wards">
            <LocalHospitalIcon style={{ fontSize: 20, marginRight: 10, marginTop:'5%' }} />
            Wards
          </Link>
        </li>
        <li>
          <Link to="/dashboard/supply">
            <Inventory2Icon style={{ fontSize: 20, marginRight: 10, marginTop:'5%' }} />
            Supply
          </Link>
        </li>
        <li>
          <Link to="/dashboard/prescription">
            <LocalPharmacyIcon style={{ fontSize: 20, marginRight: 10, marginTop:'5%' }} />
            Prescription
          </Link>
        </li>
        <li>
          <Link to="/dashboard/other">
            <OtherHousesIcon style={{ fontSize: 20, marginRight: 10, marginTop:'5%' }} />
            Other
          </Link>
        </li>
      </ul>
      <div>
        <Link to='/'>
          <button className="logout" style={{marginTop:'240px'}}>Log Out</button>
        </Link>
      </div> 
    </div>
  );
};

export default Sidebar;
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import TextField from '@mui/material/TextField';

const Register = () => {
  return (
    <div className="register-container">
      <h1>Register as Staff of Wellmeadows Hospital</h1>
      <div className="register-box">
        <div>
            <PersonAddAlt1Icon style={{ fontSize: 50.5, color:'#0056b3'}}/>
        </div>
        <form>
          <div className="input-group">
            <TextField required id="outlined-basic" label="Email Address" variant="outlined" />
          </div>
          <div className="input-group">
            <TextField required id="outlined-basic" label="Staff number" variant="outlined" />
          </div>
          <div className="input-group">
            <TextField required id="outlined-basic" label="Create Password" type= "password" variant="outlined" />
          </div>
          <div className="input-group">
            <TextField required id="outlined-basic" label="Confirm Password" type= "password" variant="outlined" />
          </div>
          <div>
            <Link to="/dashboard">
                <button type="submit">Sign up</button>
            </Link>
          </div>
          
        </form>
      </div>
      <p>Already have an account? <Link to="/login" style={{color:'red'}}>Login</Link></p>
    </div>
  );
}

export default Register;

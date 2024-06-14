import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';
import TextField from '@mui/material/TextField';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';

const NewLogIn = () => {
  return (
    <div className="login-container">
      <h1>Welcome to Wellmeadows Hospital</h1>
      <div className="login-box">
        <div className="avatar">
            <LockPersonOutlinedIcon style={{ fontSize: 50.5, color:'#0056b3'}} />
        </div>
        <form>
          <div className="input-group">
            <TextField required id="outlined-basic" label="Staff number" variant="outlined" />
          </div>
          <div className="input-group">
            <TextField required id="outlined-basic" label="Password" type= "password" variant="outlined" />
          </div>
          <div>
            <Link to="/dashboard">
                <button type="submit">Login</button>
            </Link>
          </div>
          
        </form>
        
      </div>
      <p>Not registered yet?<Link to="/register" style={{color:'red'}}> Sign up here.</Link></p>
    </div>
  );
}

export default NewLogIn;

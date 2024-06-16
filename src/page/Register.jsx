import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { makeStyles } from '@mui/styles';
import { supabase } from '../supabaseClient';
import bcrypt from 'bcryptjs';

const useStyles = makeStyles({
  registerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    background: `url('../img/hospital.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: '16px',
  },
  registerBox: {
    width: '100%',
    maxWidth: 400,
    padding: '32px',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  icon: {
    fontSize: '80px', // Adjust the icon size here as needed
    color: '#0056b3',
    marginBottom: '16px',
  },
  form: {
    width: '100%',
    marginTop: '8px',
  },
  inputGroup: {
    marginBottom: '16px',
  },
  errorMessage: {
    color: 'red',
    marginBottom: '8px',
    textAlign: 'center',
  },
  successMessage: {
    color: 'green',
    marginBottom: '8px',
    textAlign: 'center',
  },
  link: {
    color: 'red',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const Register = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [staffNumber, setStaffNumber] = useState('');
  const [staffNumberError, setStaffNumberError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
    }
  };

  const handleStaffNumberChange = (e) => {
    setStaffNumber(e.target.value);
    if (!validateStaffNumber(e.target.value)) {
      setStaffNumberError('Please enter a valid staff number');
    } else {
      setStaffNumberError('');
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (e.target.value !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateStaffNumber = (staffNumber) => {
    return staffNumber.length > 0;
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccessMessage('');

    if (!email || !staffNumber || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // Validate staff number and get position ID
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .select('position_id')
        .eq('staff_number', staffNumber)
        .single();

      if (staffError || !staffData) {
        setError('Staff number not found. Please check credentials.');
        return;
      }

      // Get access level from position ID
      const { data: positionData, error: positionError } = await supabase
        .from('staffposition')
        .select('access_level')
        .eq('position_id', staffData.position_id)
        .single();

      if (positionError || !positionData) {
        setError('Staff number not found. Please check credentials.');
        return;
      }

      const accessLevel = positionData.access_level;

      // Proceed with user registration in Supabase auth
      const { user, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert user data into your own 'user' table
      const { error: insertError } = await supabase
        .from('user')
        .insert([
          {
            staff_number: staffNumber,
            email,
            user_password: hashedPassword,
            access_level: accessLevel,
          },
        ]);

      if (insertError) {
        setError(`Error inserting user: ${insertError.message}`);
        return;
      }

      setSuccessMessage('Registration successful!');
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setError(`Registration error: ${error.message}`);
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClickShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);
  const handleMouseDownConfirmPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className={classes.registerContainer}>
      <h1>Register as Staff of Wellmeadows Hospital</h1>
      <div className={classes.registerBox}>
        <PersonAddAlt1Icon className={classes.icon} />
        <form className={classes.form} onSubmit={handleRegister}>
          <div className={classes.inputGroup}>
            <TextField
              required
              id="email"
              label="Email Address"
              variant="outlined"
              fullWidth
              value={email}
              onChange={handleEmailChange}
              error={Boolean(emailError)}
              helperText={emailError}
            />
          </div>
          <div className={classes.inputGroup}>
            <TextField
              required
              id="staff-number"
              label="Staff number"
              variant="outlined"
              fullWidth
              value={staffNumber}
              onChange={handleStaffNumberChange}
              error={Boolean(staffNumberError)}
              helperText={staffNumberError}
            />
          </div>
          <div className={classes.inputGroup}>
            <TextField
              required
              id="password"
              label="Create Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={password}
              onChange={handlePasswordChange}
              error={Boolean(passwordError)}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className={classes.inputGroup}>
            <TextField
              required
              id="confirm-password"
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              error={Boolean(confirmPasswordError)}
              helperText={confirmPasswordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle confirm password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownConfirmPassword}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={classes.inputGroup}
          >
            Sign up
          </Button>
          {error && <p className={classes.errorMessage}>{
            error}</p>}
            {successMessage && <p className={classes.successMessage}>{successMessage}</p>}
          </form>
          <p>
            Already have an account?{' '}
            <Link to="/login" className={classes.link}>
              Login
            </Link>
          </p>
        </div>
      </div>
    );
  };
  
  export default Register;
  
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import LockPersonOutlinedIcon from '@mui/icons-material/LockPersonOutlined';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { makeStyles } from '@mui/styles';
import { supabase } from '../supabaseClient'; // Adjust path based on your project structure
import bcrypt from 'bcryptjs';

const useStyles = makeStyles({
  loginContainer: {
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
  loginBox: {
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
  link: {
    color: 'red',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
});

const NewLogIn = () => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (!validateEmail(e.target.value)) {
      setEmailError('Please enter a valid email');
    } else {
      setEmailError('');
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

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email');
      return;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      // Fetch user credentials from the user table
      const { data: userData, error: fetchError } = await supabase
        .from('user')
        .select('*')
        .eq('email', email)
        .single();

      if (fetchError) {
        console.error('User fetch error:', fetchError.message);
        setError('Invalid credentials.');
        setIsLoading(false);
        return;
      }

      if (!userData || !(await bcrypt.compare(password, userData.user_password))) {
        setError('Invalid credentials.');
        setIsLoading(false);
        return;
      }

      console.log('Login successful:', userData);

      // Navigate to dashboard on successful login
      // Replace "/dashboard" with your desired route
      navigate('/dashboard');

    } catch (error) {
      console.error('Login error:', error.message);
      setError('Invalid credentials.');
      setIsLoading(false);
    }
  };

  return (
    <div className={classes.loginContainer}>
      <h1>Welcome to Wellmeadows Hospital</h1>
      <div className={classes.loginBox}>
        <LockPersonOutlinedIcon className={classes.icon} />
        <form className={classes.form} onSubmit={handleLogin}>
          <div className={classes.inputGroup}>
            <TextField
              required
              id="email"
              label="Email address"
              variant="outlined"
              fullWidth
              value={email}
              onChange={handleEmailChange}
              error={Boolean(emailError)}
              helperText={emailError}
              disabled={isLoading}
            />
          </div>
          <div className={classes.inputGroup}>
            <TextField
              required
              id="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={password}
              onChange={handlePasswordChange}
              error={Boolean(passwordError)}
              helperText={passwordError}
              disabled={isLoading}
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
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={isLoading}
            className={classes.inputGroup}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          {error && <p className={classes.errorMessage}>{error}</p>}
        </form>
      </div>
      <p>
        Not registered yet?{' '}
        <Link to="/register" className={classes.link}>
          Sign up here.
        </Link>
      </p>
    </div>
  );
};

export default NewLogIn;

import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  TextField,
  IconButton,
  Button,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
  InputAdornment
} from "@mui/material";
import {
  VisibilityOff as VisibilityOffIcon,
  Lock as LockIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import RestService from "../Services/RestService";

const RegistrationPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [usernameEror, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    firstName: '',
    middleName: '',
    lastName: '',
    confirmPassword: '',
    position: 'ADAS'
  });
  const [formValid, setFormValid] = useState(true); // Track form validity

  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (input) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(input);
  };

  const validatePassword = (input) => {
    const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(input);
  };

  const handleInputChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    });

    switch (key) {
      case 'email':
        setEmailError(value !== '' && !validateEmail(value));
        break;
      case 'password':
        setPasswordError(value !== '' && !validatePassword(value));
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          setConfirmPasswordError(true);
        } else {
          setConfirmPasswordError(false);
        }
        break;
      case 'confirmPassword':
        setConfirmPasswordError(value !== '' && value !== formData.password);
        break;
      default:
        break;
    }
  };

  const handlePositionChange = (event) => {
    setFormData({
      ...formData,
      position: event.target.value
    });
  };

  const handleExistingEmail = async (event) => {
    try {
      const exists = await RestService.validateUsernameEmail(event.target.value)
      exists ? setEmailError(true) : setEmailError(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleExistingUsername = async (event) => {
    try {
      const exists = await RestService.validateUsernameEmail(event.target.value)
      exists ? setUsernameError(true) : setUsernameError(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async () => {
    const { email, password, username, firstName, middleName, lastName, position } = formData;

    if (!email || !password || !username || !firstName || !middleName || !lastName || !position) {
      console.log("All fields are required");
      setFormValid(false); // Set form validity to false
      setTimeout(() => {
        setFormValid(true); // Clear the form validity error after 800 milliseconds
      }, 800);
      return; // Exit the function if any field is empty
    }

    // Further validation logic for email, password, and confirmPassword
    if (!emailError && !passwordError && !confirmPasswordError) {
      try {
        const response = await RestService.createUser(firstName, middleName, lastName, username, email, password, position);
        if (response) {
          console.log("Registration successful");
          setRegistrationError('');
          // Clear form fields after successful registration
          setFormData({
            email: '',
            password: '',
            username: '',
            firstName: '',
            middleName: '',
            lastName: '',
            confirmPassword: '',
            position: ''
          });
          // Redirect to login page or display a success message
          window.location.href = "/dashboard"; // Change this to the correct URL if needed
        } else {
          setRegistrationError("Registration failed");
        }
      } catch (error) {
        console.error("Error:", error);
        setRegistrationError("Registration failed");
      }
    } else {
      console.log("Form contains errors");
    }
  };

  function getErrorCondition(item) {
    const { key } = item;

    if (key === 'email') {
      return emailError ? "Existing or invalid email address" : false;
    }

    if (key === 'username') {
      return usernameEror ? "Existing or invalid username" : false;
    }

    if (key === 'password') {
      return passwordError ? "Password must contain at least 8 characters and one special character" : false;
    }

    if (key === 'confirmPassword') {
      return confirmPasswordError ? "Passwords don't match" : false;
    }

    if (!formValid && !formData[key]) {
      return "This field is required";
    }

    return false;
  }

  return (
    <Container
      maxWidth={false}
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "auto",
        backgroundImage: `url(/bg.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
      }} />
      <Container
        maxWidth="sm"
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
          zIndex: 1
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <b style={{ fontSize: "2rem", fontFamily: "Mulish", color: "#000" }}>Create a new account</b>
        </div>
        {[
          { label: "Email", icon: <EmailIcon />, key: 'email' },
          { label: "Username", icon: <PersonIcon />, key: 'username', maxLength: 20 },
          { label: "First Name", icon: <PersonIcon />, key: 'firstName', maxLength: 20 },
          { label: "Middle Name", icon: <PersonIcon />, key: 'middleName', maxLength: 20 },
          { label: "Last Name", icon: <PersonIcon />, key: 'lastName', maxLength: 20 },
          { label: "Password", icon: <LockIcon />, key: 'password', maxLength: 20 },
          { label: "Confirm Password", icon: <LockIcon />, key: 'confirmPassword' },
        ].map((item, index) => (
          <TextField
            key={index}
            style={{ marginBottom: "1rem", width: "100%" }}
            color="primary"
            onBlur={(event) => {
              item.key === 'email' && handleExistingEmail(event)
              item.key === 'username' && handleExistingUsername(event)
            }}
            label={item.label}
            variant="outlined"
            type={index >= 5 ? (showPassword ? "text" : "password") : "text"}
            value={formData[item.key]}
            onChange={(e) => handleInputChange(item.key, e.target.value)}
            error={
              (item.key === 'email' && emailError) ||
              (item.key === 'username' && usernameEror) ||
              (item.key === 'password' && passwordError) ||
              (item.key === 'confirmPassword' && confirmPasswordError) ||
              (!formValid && !formData[item.key])} // Add error condition for required fields
            helperText={getErrorCondition(item)}
            InputProps={{
              startAdornment: <InputAdornment position="start">{item.icon}</InputAdornment>,
              endAdornment: index >= 5 && (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPasswordClick} aria-label="toggle password visibility">
                    <VisibilityOffIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            inputProps={{ maxLength: item.maxLength }} // Set maxlength attribute
            sx={{ backgroundColor: "#DBF0FD", '& .MuiOutlinedInput-notchedOutline': { borderColor: "#DBF0FD" }, borderRadius: '8px' }} // Set background color and outline color
          />
        ))}


        <FormControl required sx={{ minWidth: 120 }} variant="outlined" fullWidth style={{ marginBottom: "1rem", textAlign: "left", backgroundColor: "#DBF0FD", }}>
          <InputLabel id="position-select-label" color="primary">Position</InputLabel>
          <Select
            labelId="position-select-label"
            id="position-select"
            value={formData.position}
            onChange={handlePositionChange}
            label="Position"
            sx={{ '& .MuiOutlinedInput-notchedOutline': { borderColor: "#DBF0FD" }, borderRadius: '8px' }} // Set outline color
          >
            <MenuItem value="ADAS">ADAS</MenuItem>
            <MenuItem value="ADOF">ADOF</MenuItem>
          </Select>
        </FormControl>
        {registrationError && (
          <div style={{ color: "red", marginBottom: "1rem" }}>{registrationError}</div>
        )}
        <Button
          sx={{
            backgroundColor: "#4a99d3", color: "#fff", textTransform: "none", width: "100%", marginBottom: "1rem", padding: "15px", borderRadius: "1.5px", cursor: "pointer", transition: "background-color 0.3s", "&:hover": { backgroundColor: "#474bca", },
          }}
          disableElevation
          variant="contained"
          onClick={handleSubmit}
        >
          Create Account
        </Button>
        <Link to="/login" className="signInLink" style={{ textDecoration: "none", color: "#3048c1" }}>
          <span>{`Do you have an account? `}</span>
          <b>Sign in</b>
        </Link>
      </Container>
    </Container>
  );
};

export default RegistrationPage;

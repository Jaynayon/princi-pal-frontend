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
  const [usernameError, setUsernameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [emailExistsError, setEmailExistsError] = useState(false); // Separate state for email existence check
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
    let modifiedValue = value;
    if (key === 'firstName' || key === 'middleName' || key === 'lastName') {
      // Replace non-letter characters with an empty string
      modifiedValue = modifiedValue
        .replace(/^\s+/, '') // Remove leading spaces
        .replace(/[^a-zA-Z ]+/g, '') // Remove non-letter characters
        .replace(/\s+/g, ' ') // Normalize spaces
        .replace(/\b\w/g, match => match.toUpperCase()); // Capitalize first letter of each word
    }
    if (key === 'username') {
      // Allow only alphanumeric characters for username (letters and numbers)
      modifiedValue = modifiedValue.replace(/[^a-zA-Z0-9]/g, '');
    }
    setFormData({
      ...formData,
      [key]: modifiedValue
    });

    switch (key) {
      case 'email':
        setEmailError(value !== '' && !validateEmail(value));
        if (!emailExistsError) {
          setEmailExistsError(false);
        }
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
    const value = event.target.value;
    if (value && validateEmail(value)) {
      try {
        const exists = await RestService.validateUsernameEmail(value); // returns boolean
        setEmailExistsError(exists);
      } catch (error) {
        console.error(error);
      }
    } else {
      setEmailExistsError(false); // Clear email existence error if email is invalid or empty
    }
  };

  const handleExistingUsername = async (event) => {
    const value = event.target.value;
    if (value) {
      try {
        const exists = await RestService.validateUsernameEmail(value);
        setUsernameError(exists);
      } catch (error) {
        console.error(error);
      }
    } else {
      setUsernameError(false); // Clear username error if username is empty
    }
  };

  const handleSubmit = async () => {
    const { email, password, username, firstName, middleName, lastName, position } = formData;

    if (!email || !password || !username || !firstName || !middleName || !lastName || !position) {
      console.log("All fields are required");
      setFormValid(false); // Set form validity to false immediately
      return; // Exit the function
    }

    // Further validation logic for email, password, and confirmPassword
    if (!emailError && !emailExistsError && !passwordError && !confirmPasswordError) {
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
          //window.location.href = "/login"; // Change this to the correct URL if needed
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
      if (formData.email === '') {
        return false; // No error if email field is empty
      }
      let message;
      if (formData.email && !validateEmail(formData.email)) {
        message = "Invalid email address";
      } else if (emailExistsError) {
        message = "Email address already exists";
      }
      return emailError || emailExistsError ? message : false;
    }

    if (key === 'username') {
      return usernameError ? "Existing or invalid username" : false;
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
              if (item.key === 'email') handleExistingEmail(event);
              if (item.key === 'username') handleExistingUsername(event);
            }}
            label={item.label}
            variant="outlined"
            type={index >= 5 ? (showPassword ? "text" : "password") : "text"}
            value={formData[item.key]}
            onChange={(e) => handleInputChange(item.key, e.target.value)}
            error={!!getErrorCondition(item)}
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
          disabled={
            (usernameError || emailError || emailExistsError || passwordError || confirmPasswordError) ||
            (formData.email === '' || formData.username === '' || formData.password === '' || formData.confirmPassword === '')
          }
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

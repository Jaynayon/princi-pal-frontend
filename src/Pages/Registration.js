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

  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  const validateEmail = (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);

  const validatePassword = (input) => /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(input);

  const handleInputChange = (key, value) => {
    setFormData({
      ...formData,
      [key]: value
    });

    switch (key) {
      case 'email':
        setEmailError(!validateEmail(value));
        break;
      case 'password':
        setPasswordError(!validatePassword(value));
        if (formData.confirmPassword && value !== formData.confirmPassword) {
          setConfirmPasswordError(true);
        } else {
          setConfirmPasswordError(false);
        }
        break;
      case 'confirmPassword':
        setConfirmPasswordError(value !== formData.password);
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

  const handleSubmit = async () => {
    const { email, password, username, firstName, middleName, lastName, position } = formData;

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
          { label: "Username", icon: <PersonIcon />, key: 'username' },
          { label: "First Name", icon: <PersonIcon />, key: 'firstName' },
          { label: "Middle Name", icon: <PersonIcon />, key: 'middleName' },
          { label: "Last Name", icon: <PersonIcon />, key: 'lastName' },
          { label: "Password", icon: <LockIcon />, key: 'password' },
          { label: "Confirm Password", icon: <LockIcon />, key: 'confirmPassword' },
        ].map((item, index) => (
          <TextField
            key={index}
            style={{ marginBottom: "1rem", width: "100%" }}
            color="primary"
            label={item.label}
            variant="outlined"
            type={index >= 5 ? (showPassword ? "text" : "password") : "text"}
            value={formData[item.key]}
            onChange={(e) => handleInputChange(item.key, e.target.value)}
            error={(item.key === 'email' && emailError) || (item.key === 'password' && passwordError) || (item.key === 'confirmPassword' && confirmPasswordError)}
            helperText={(item.key === 'email' && emailError) ? "Invalid email address" : ((item.key === 'password' && passwordError) ? "Password must contain at least 8 characters and one special character" : ((item.key === 'confirmPassword' && confirmPasswordError) ? "Passwords don't match" : ""))}
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
            sx={{ 
              backgroundColor: "#DBF0FD", 
              '& .MuiOutlinedInput-notchedOutline': { borderColor: item.error ? "red" : "#DBF0FD" }, 
              borderRadius: '8px' 
            }}
          />
        ))}
        <FormControl required sx={{ m: 1, minWidth: 120 }} variant="outlined" fullWidth style={{ marginBottom: "1rem", textAlign: "left", backgroundColor: "#DBF0FD", }}>
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

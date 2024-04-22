import { useState } from "react";
import { Link } from "react-router-dom";
import FormHelperText from '@mui/material/FormHelperText';

import { Container, TextField, InputAdornment, IconButton, Button, Select, InputLabel, MenuItem, FormControl } from "@mui/material";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import RestService from "../Services/RestService";

const RegistrationPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [position, setPosition] = useState('');

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

  const handleEmailChange = (event) => {
    const { value } = event.target;
    setEmail(value);
    setEmailError(!validateEmail(value));
  };

  const handlePasswordChange = (event) => {
    const { value } = event.target;
    setPassword(value);
    setPasswordError(!validatePassword(value));
    if (confirmPassword && value !== confirmPassword) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const { value } = event.target;
    setConfirmPassword(value);
    if (password && value !== password) {
      setConfirmPasswordError(true);
    } else {
      setConfirmPasswordError(false);
    }
  };

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
  };

  const handleSubmit = async () => {
  if (!emailError && !passwordError && !confirmPasswordError) {
    try {
      const response = await RestService.createUser(firstName, middleName, lastName, username, email, password, position);
      if (response) {
        console.log("Registration successful");
        // Clear form fields after successful registration
        setEmail('');
        setPassword('');
        setUsername('');
        setFirstName('');
        setMiddleName('');
        setLastName('');
        setConfirmPassword('');
        setPosition('');
        // Clear any registration error message
        setRegistrationError('');
        // Redirect to login page or display a success message
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
    <Container maxWidth={false} style={{
      width: "100vw",
      height: "100vh",
      position: "relative",
      overflow: "auto",
      backgroundImage: `url(/bg.png)`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }}>
      <div style={{
        position: "absolute",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
      }} />
      <Container maxWidth="sm" style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        zIndex: 1
      }}>
        <div style={{ marginBottom: "1rem" }}>
          <b style={{ fontSize: "2rem", fontFamily: "Mulish", color: "#000" }}>Create a new account</b>
        </div>
        {[
          { label: "Email", icon: <EmailIcon />, value: email, error: emailError, onChange: handleEmailChange },
          { label: "Username", icon: <PersonIcon />, value: username, error: false, onChange: (e) => setUsername(e.target.value) },
          { label: "First Name", icon: <PersonIcon />, value: firstName, error: false, onChange: (e) => setFirstName(e.target.value) },
          { label: "Middle Name", icon: <PersonIcon />, value: middleName, error: false, onChange: (e) => setMiddleName(e.target.value) },
          { label: "Last Name", icon: <PersonIcon />, value: lastName, error: false, onChange: (e) => setLastName(e.target.value) },
          { label: "Password", icon: <LockIcon />, value: password, error: passwordError, onChange: handlePasswordChange },
          { label: "Confirm Password", icon: <LockIcon />, value: confirmPassword, error: confirmPasswordError, onChange: handleConfirmPasswordChange },
        ].map((item, index) => (
          <TextField
            key={index}
            style={{ marginBottom: "1rem", width: "100%" }}
            color="primary"
            label={item.label}
            variant="outlined"
            type={index >= 5 ? (showPassword ? "text" : "password") : "text"}
            value={item.value}
            onChange={item.onChange}
            error={item.error && index === 0}
            helperText={item.error && index === 0 ? "Invalid email address" : (index === 5 && passwordError ? "Password must contain at least 8 characters and one special character" : (index === 6 && confirmPasswordError ? "Passwords don't match" : ""))}
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
            sx={{ backgroundColor: "#DBF0FD" }}
          />
        ))}
        <FormControl required sx={{ m: 1, minWidth: 120 }} variant="outlined" fullWidth style={{ marginBottom: "1rem", textAlign: "left", backgroundColor: "#DBF0FD" }}>
          <InputLabel id="position-select-label" color="primary">Position *</InputLabel>
          <Select
              labelId="position-select-label"
              id="position-select"
              value={position}
              onChange={handlePositionChange}
              label="Position *"
          >
              <MenuItem value="">
                  <em>None</em>
              </MenuItem>
              <MenuItem value="ADAS">ADAS</MenuItem>
              <MenuItem value="Principal">Principal</MenuItem>
              <MenuItem value="ADOF">ADOF</MenuItem>
          </Select>
      </FormControl>
        {registrationError && (
          <div style={{ color: "red", marginBottom: "1rem" }}>{registrationError}</div>
        )}
        <Button
        style={{ backgroundColor: "#4a99d3", color: "#fff", textTransform: "none", width: "100%", marginBottom: "1rem" }}
        disableElevation
        variant="contained"
        onClick={() => {
          handleSubmit(); // Call the submit function to handle registration
          // Redirect to the dashboard after successful registration
          window.location.href = "/dashboard"; // Change this to the correct URL if needed
        }}
      >
        Create Account
      </Button>
        <Link to="/Login" className="signInLink" style={{ textDecoration: "none", color: "#3048c1" }}>
          <span>{`Do you have an account? `}</span>
          <b>Sign in</b>
        </Link>
      </Container>
    </Container>
  );
};

export default RegistrationPage;

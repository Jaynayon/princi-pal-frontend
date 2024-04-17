import { useState } from "react";
import { Link } from "react-router-dom";
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
  const { createUser } = require('../Services/RestService')

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
        const response = await RestService.createUser(firstName, middleName, lastName, username, email, password, 'ADAS')//dapat position ta ni diri
        if (response) {
          console.log("Registration successful");
          // Redirect to login page or display a success message
        } else {
          //const data = await response.json();
          //setRegistrationError(data.error || "Registration failed");
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
        background: "linear-gradient(1.02deg, #4a99d3 7.81%, rgba(74, 153, 211, 0)), #fff",
        boxShadow: "0px 4px 16px rgba(75, 0, 129, 0.26)",
        transform: "rotate(-180deg)",
        transformOrigin: "0 0",
        opacity: "0.2"
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
        <FormControl variant="outlined" fullWidth style={{ marginBottom: "1rem", textAlign: "left", backgroundColor: "#DBF0FD" }}>
          <InputLabel color="primary">Position</InputLabel>
          <Select color="primary" label="Position" displayEmpty value={position} onChange={handlePositionChange}>
            <MenuItem value="" disabled>Choose your position</MenuItem>
            <MenuItem value="administrator">ADAS</MenuItem>
            <MenuItem value="principal">Principal</MenuItem>
            <MenuItem value="guest">ADOF</MenuItem>
          </Select>
        </FormControl>
        {registrationError && (
          <div style={{ color: "red", marginBottom: "1rem" }}>{registrationError}</div>
        )}
        <Button
          style={{ backgroundColor: "#4a99d3", color: "#fff", textTransform: "none", width: "100%", marginBottom: "1rem" }}
          disableElevation
          variant="contained"
          onClick={handleSubmit}
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

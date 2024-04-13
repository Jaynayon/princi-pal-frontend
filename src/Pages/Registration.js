import { useState } from "react";
import { Link } from "react-router-dom";
import { Container, TextField, InputAdornment, IconButton, Button, Select, InputLabel, MenuItem, FormControl } from "@mui/material";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';

const RegistrationPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPasswordClick = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth={false} style={{ width: "100vw", height: "100vh", position: "relative", backgroundColor: "#fff" }}>
      <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%", background: "linear-gradient(1.02deg, #4a99d3 7.81%, rgba(74, 153, 211, 0)), #fff", boxShadow: "0px 4px 16px rgba(75, 0, 129, 0.26)", transform: "rotate(-180deg)", transformOrigin: "0 0", opacity: "0.2" }} />
      <Container maxWidth="sm" style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <div style={{ marginBottom: "1rem" }}>
          <b style={{ fontSize: "2rem", fontFamily: "Mulish", color: "#000" }}>Create a new account</b>
        </div>
        {[{ label: "Email", icon: <EmailIcon /> }, { label: "Username", icon: <PersonIcon /> }, { label: "Fullname", icon: <PersonIcon /> }, { label: "Password", icon: <LockIcon /> }, { label: "Confirm Password", icon: <LockIcon /> }].map((item, index) => (
          <TextField
            key={index}
            style={{ marginBottom: "1rem", width: "100%" }}
            color="primary"
            label={item.label}
            variant="outlined"
            type={index >= 3 ? (showPassword ? "text" : "password") : "text"}
            InputProps={{
              startAdornment: <InputAdornment position="start">{item.icon}</InputAdornment>,
              endAdornment: index >= 3 && (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPasswordClick} aria-label="toggle password visibility">
                    <VisibilityOffIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ backgroundColor: "#fff" }}
          />
        ))}
        <FormControl variant="outlined" fullWidth style={{ marginBottom: "1rem", textAlign: "left" }}>
          <InputLabel color="primary">Position</InputLabel>
          <Select color="primary" label="Position" displayEmpty>
            <MenuItem value="" disabled>Choose your position</MenuItem>
            <MenuItem value="administrator">ADAS</MenuItem>
            <MenuItem value="principal">Principal</MenuItem>
            <MenuItem value="guest">ADOF</MenuItem>
          </Select>
        </FormControl>
        <Button style={{ backgroundColor: "#4a99d3", color: "#fff", textTransform: "none", width: "100%", marginBottom: "1rem" }} disableElevation variant="contained">
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

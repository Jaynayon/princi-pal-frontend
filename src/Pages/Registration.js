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
    <Container maxWidth={false} style={{ width: "100vw", height: "100vh", position: "relative", backgroundColor: "#fff", overflow: "auto", textAlign: "left", fontSize: "16px", color: "#03014c", fontFamily: "'Open Sans'", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", top: "0", left: "0", width: "100%", height: "100%" }}>
        <div style={{ position: "absolute", top: "100%", left: "100%", background: "linear-gradient(1.02deg, #4a99d3 7.81%, rgba(74, 153, 211, 0)), #fff", boxShadow: "0px 4px 16px rgba(75, 0, 129, 0.26)", width: "100%", height: "100%", transform: "rotate(-180deg)", transformOrigin: "0 0", opacity: "0.2" }} />
        <Link to="/Login" className="signInLink" style={{ cursor: "pointer", textDecoration: "none", position: "absolute", top: "880px", left: "585px", color: "#3048c1" }}>
          <span>{`Do you have an account? `}</span>
          <b>Sign in</b>
        </Link>
      </div>
      <b style={{ position: "absolute", top: "88px", left: "470px", fontSize: "48px", fontFamily: "Mulish", color: "#000" }}>Create a new account</b>
      {[{ label: "Email", icon: <EmailIcon /> }, { label: "Username", icon: <PersonIcon /> }, { label: "Fullname", icon: <PersonIcon /> }, { label: "Password", icon: <LockIcon /> }, { label: "Confirm Password", icon: <LockIcon /> }].map((item, index) => (
        <TextField
          key={index}
          style={{ border: "none", backgroundColor: "transparent", position: "absolute", top: `${index * 103.7 + 197}px`, left: "465px", fontFamily: "Inter", fontWeight: "600", fontSize: "15.8px", color: "#03014c", width: "491.1px", height: "76.3px" }}
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
          sx={{ "& .MuiInputBase-root": { height: "76.3px" }, width: "491.1px" }}
        />
      ))}
      <Button style={{ position: "absolute", top: "780px", left: "465px", backgroundColor: "#4a99d3", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0px", minWidth: "491.1px", height: "76.3px", textDecoration: "none", whiteSpace: "nowrap", textTransform: "none", color: "#fff" }} disableElevation color="primary" variant="outlined" href="/Dashboard">
        Create Account
      </Button>
      <FormControl style={{ position: "absolute", top: "706px", left: "465px", fontFamily: "Inter", fontWeight: "600", fontSize: "15.8px", color: "#03014c", width: "491.1px", height: "76.3px" }} variant="outlined" fullWidth>
        <InputLabel color="primary">Account Type</InputLabel>
        <Select color="primary" label="Account Type" displayEmpty>
          <MenuItem value="" disabled>Select Account Type</MenuItem>
          <MenuItem value="administrator">Administrator</MenuItem>
          <MenuItem value="principal">Principal</MenuItem>
          <MenuItem value="guest">Guest</MenuItem>
        </Select>
      </FormControl>
    </Container>
  );
};

export default RegistrationPage;

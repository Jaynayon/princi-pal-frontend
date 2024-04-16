import { useState } from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { TextField, InputAdornment, IconButton, Button, Typography, Paper, Container } from "@mui/material";

const LoginPage = ({ setIsLoggedIn }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleShowPasswordClick = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };  

    return (
        <Container maxWidth="false" style={{ backgroundColor: "linear-gradient(1.02deg, #4a99d3 7.81%, rgba(74, 153, 211, 0)), #fff", height: "100vh", overflow: "auto", textAlign: "left", fontSize: "15px", color: "#000", fontFamily: "Mulish", position: "relative", display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Paper elevation={0} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: -1, opacity: 0.2, background: "linear-gradient(1.02deg, #4a99d3 7.81%, rgba(74, 153, 211, 0)), #fff" }} />
            <TextField color="primary" label="Enter your email id" variant="outlined" sx={{ "& .MuiInputBase-root": { height: "47px" }, width: "445px", position: "absolute", top: "442px", left: "159px" }} />
            <Typography variant="subtitle1" sx={{ position: "absolute", top: "393px", left: "159px", fontSize: "18px", fontWeight: "600" }}>Email</Typography>
            <TextField color="primary" label="Enter your password" variant="outlined" type={showPassword ? "text" : "password"} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={handleShowPasswordClick} aria-label="toggle password visibility"><VisibilityOffIcon /></IconButton></InputAdornment>) }} sx={{ "& .MuiInputBase-root": { height: "47px" }, width: "445px", position: "absolute", top: "596px", left: "159px" }} />
            <Typography variant="subtitle1" sx={{ position: "absolute", top: "547px", left: "155px", fontSize: "18px", fontWeight: "600" }}>Password</Typography>
            <Typography sx={{ position: "absolute", top: "698px", left: "161px", fontWeight: "500" }}>Remember Me</Typography>
            <Typography sx={{ position: "absolute", top: "697px", left: "451px", fontWeight: "600", color: "#474bca" }}>Forgot Password?</Typography>
            <Button onClick={() => setIsLoggedIn(true)} variant="contained" href="/dashboard" sx={{ position: "absolute", top: "766px", left: "160px", width: "443px", height: "44px", borderRadius: "5px" }}>Log in</Button>
            <Button variant="contained" href="/Register" sx={{ position: "absolute", top: "147px", left: "calc(50% + 409px)", width: "167px", height: "43px", borderRadius: "5px", backgroundColor: "#4a99d3" }}>Sign Up</Button>
            <Typography sx={{ position: "absolute", top: "242px", left: "154px", fontSize: "20px" }}>{`Hi, Welcome back 👋 `}</Typography>
            <Typography component="b" sx={{ position: "absolute", top: "147px", left: "154px", fontSize: "48px" }}>Login to your account</Typography>
            <img style={{ position: "absolute", top: "362px", left: "720px", width: "450px", height: "371px", objectFit: "cover" }} alt="" src="/reshotillustrationwebsitedesignu3pzxdsevy-1@2x.png" />
        </Container>
    );
};

export default LoginPage;

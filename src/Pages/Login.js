import { useState } from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { TextField, InputAdornment, IconButton, Button, Typography, Paper, Container } from "@mui/material";
import RestService from "../Services/RestService";
import { Link } from 'react-router-dom';
const LoginPage = ({ setIsLoggedIn }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const handleEmailFieldClick = () => {
    setLoginError('');
};

const handlePasswordFieldClick = () => {
    setLoginError('');
};
    const handleShowPasswordClick = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    const handleLogin = async () => {
        try {
            if (!email.trim() || !password.trim()) {
                setLoginError('Please input your email and password.');
                return;
            }
    
            // Make a POST request to the backend to validate the credentials
            const response = await RestService.authenticateUser(email, password);
            console.log(response);
    
            if (response) {
                // Credentials are valid, set isLoggedIn to true
                setIsLoggedIn(true);
                window.location.href = "http://localhost:3000/dashboard";
            } else {
                // Invalid credentials, display error message
                setLoginError('Incorrect email or password');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.message.includes('404')) {
                setLoginError('Endpoint not found. Please check the server configuration.');
            } else {
                setLoginError('An error occurred while logging in. Please try again later.');
            }
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
            <TextField color="primary" label="Enter your email id" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ "& .MuiInputBase-root": { height: "47px" }, width: "445px", position: "absolute", top: "442px", left: "159px" }} />
            <Typography variant="subtitle1" sx={{ position: "absolute", top: "393px", left: "159px", fontSize: "18px", fontWeight: "600" }}>Email</Typography>
            <TextField color="primary" label="Enter your password" variant="outlined" type={showPassword ? "text" : "password"} InputProps={{ endAdornment: (<InputAdornment position="end"><IconButton onClick={handleShowPasswordClick} aria-label="toggle password visibility"><VisibilityOffIcon /></IconButton></InputAdornment>) }} value={password} onChange={(e) => setPassword(e.target.value)} sx={{ "& .MuiInputBase-root": { height: "47px" }, width: "445px", position: "absolute", top: "596px", left: "159px" }} />
            <Typography variant="subtitle1" sx={{ position: "absolute", top: "547px", left: "155px", fontSize: "18px", fontWeight: "600" }}>Password</Typography>
            {loginError && <Typography color="error" sx={{ position: "absolute", top: "650px", left: "159px", fontSize: "14px" }}>{loginError}</Typography>}
            <Typography sx={{ position: "absolute", top: "698px", left: "161px", fontWeight: "500" }}>Remember Me</Typography>
            <Typography sx={{ position: "absolute", top: "697px", left: "451px", fontWeight: "600", color: "#474bca" }}>Forgot Password?</Typography>
            <Button onClick={handleLogin} variant="contained" sx={{ position: "absolute", top: "766px", left: "160px", width: "443px", height: "44px", borderRadius: "5px" }}>Log in</Button>
            <Typography variant="subtitle1" sx={{ position: "absolute", top: "820px", left: "18%", fontWeight: "600" }}>
                Go back to 
                <Link to="/" style={{ color: '#474bca', textDecoration: 'none', marginLeft: '5px' }}>Welcome Page</Link>
            </Typography>
            <Button variant="contained" href="/Register" sx={{ position: "absolute", top: "147px", left: "calc(50% + 409px)", width: "167px", height: "43px", borderRadius: "5px", backgroundColor: "#4a99d3" }}>Sign Up</Button>
            <Typography sx={{ position: "absolute", top: "242px", left: "154px", fontSize: "20px" }}>{`Hi, Welcome back 👋 `}</Typography>
            <Typography component="b" sx={{ position: "absolute", top: "147px", left: "154px", fontSize: "48px" }}>Login to your account</Typography>
            <img style={{ position: "absolute", top: "362px", left: "720px", width: "450px", height: "371px", objectFit: "cover" }} alt="" src="/reshotillustrationwebsitedesignu3pzxdsevy-1@2x.png" />
        </Container>
    );
};

export default LoginPage;

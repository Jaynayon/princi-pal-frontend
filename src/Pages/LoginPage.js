import { useState } from "react";
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { TextField, InputAdornment, IconButton, Button, Typography, Container, Grid } from "@mui/material";
import { Link } from 'react-router-dom';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Box from '@mui/material/Box';
import { useAppContext } from "../Context/AppProvider";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { authenticateUser } = useAppContext();

    const handleShowPasswordClick = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    const handleBtnRegister = () => {
        // Logic for handling register button click
        // Redirect to the registration page
        window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/register`;
    };

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            const emailValue = getEmailorUsername(); // Get email or username
            const passwordValue = getPassword(); // Get password

            if (!emailValue.trim() || !passwordValue.trim()) {
                if (!emailValue.trim() && !passwordValue.trim()) {
                    setLoginError('Email or password cannot be empty.');
                } else if (!emailValue.trim()) {
                    setLoginError('Please enter your email.');
                } else {
                    setLoginError('Please enter your password.');
                }
                return;
            }

            // Make a POST request to the backend to validate the credentials
            const response = await authenticateUser(emailValue, passwordValue);

            if (!response) {
                // Invalid credentials, display error message
                setLoginError('Incorrect email or password.');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response && error.response.status === 404) {
                setLoginError('Endpoint not found. Please check the server configuration.');
            } else {
                setLoginError('Incorrect email or password.');
            }
        } finally {
            setIsLoading(false);
        }
    };


    const getEmailorUsername = () => {
        // Logic to get email or username from the input field
        return email;
    };

    const getPassword = () => {
        // Logic to get password from the input field
        return password;
    };

    const loginButtonActionListener = () => {
        handleLogin();
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
            <Grid container spacing={4}>
                {/* Left side: Login fields */}
                <Grid item xs={12} md={5} sx={{ alignItems: 'flex-start', marginTop: '5%', textAlign: 'left', marginLeft: '5%' }}> {/* Updated marginLeft */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-start'
                    }}
                    >
                        <IconButton
                            onClick={() => console.log('test')}
                            href="/"
                            sx={{ right: '20px' }}>
                            <ChevronLeftIcon color='inherit' sx={{ fontSize: '50px' }} />
                        </IconButton>
                    </Box>
                    <Typography variant="h4" sx={{ fontSize: "48px", fontWeight: "bold", mt: 2 }}>Login to your account</Typography> {/* Updated marginTop */}
                    <Typography variant="body1" sx={{ fontSize: "20px", mt: 6 }}>Hi, Welcome back 👋 </Typography> {/* Updated spacing */}
                    <Typography variant="subtitle1" sx={{ marginTop: '3%', fontSize: "18px", fontWeight: "600", mt: 15 }}>Email</Typography> {/* Updated marginTop */}
                    <TextField
                        color="primary"
                        label="Enter your email id"
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        fullWidth
                        sx={{ mt: 2, backgroundColor: "#DBF0FD", '& .MuiOutlinedInput-notchedOutline': { borderColor: '#DBF0FD' }, borderRadius: '8px' }} // Adjusted borderRadius
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleLogin(); // Invoke handleLogin on Enter key press
                            }
                        }}
                    />
                    <Typography variant="subtitle1" sx={{ fontSize: "18px", fontWeight: "600", mt: 4 }}>Password</Typography> {/* Updated spacing */}
                    <TextField
                        color="primary"
                        label="Enter your password"
                        variant="outlined"
                        type={showPassword ? "text" : "password"}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleShowPasswordClick} aria-label="toggle password visibility">
                                        <VisibilityOffIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                            sx: { borderColor: "#DBF0FD" } // Removed padding
                        }}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                        sx={{ mt: 2, backgroundColor: "#DBF0FD", '& .MuiOutlinedInput-notchedOutline': { borderColor: '#DBF0FD' }, borderRadius: '8px' }} // Adjusted borderRadius
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleLogin(); // Invoke handleLogin on Enter key press
                            }
                        }}
                    />
                    {loginError && <Typography color="error" sx={{ fontSize: "14px", mt: 2 }}>{loginError}</Typography>}
                    <Button disabled={isLoading} onClick={loginButtonActionListener} variant="contained" sx={{ mt: 7, width: "100%", height: "44px", borderRadius: "5px", }}>Log in</Button>
                    <Typography variant="body1" sx={{ mt: 2, marginLeft: '25%' }}>
                        Not registered yet? <span style={{ color: '#6C6FD5' }}>Create an account </span>
                        <Link style={{ color: '#6EADDC', textDecoration: 'none', fontWeight: 'bold', borderBottom: '1px solid' }}
                            onClick={() => handleBtnRegister()}>Signup</Link>
                    </Typography>
                </Grid>

                {/* Right side: Sign-up button and image */}
                <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', mt: 8, marginTop: '10%' }}> {/* Updated marginTop */}
                    <Button variant="contained" href="/register" sx={{ marginLeft: 'auto', width: "167px", height: "43px", borderRadius: "5px", backgroundColor: "#4a99d3" }}>Sign Up</Button> {/* Updated marginLeft */}
                    <img style={{ mt: 8, marginTop: '20%', marginLeft: 'auto', marginRight: 'auto', width: "100%", maxWidth: "450px", objectFit: "cover" }} alt="" src="/reshotillustrationwebsitedesignu3pzxdsevy-1@2x.png" /> {/* Updated marginLeft */}
                </Grid>
            </Grid>
        </Container>
    );
};

export default LoginPage;

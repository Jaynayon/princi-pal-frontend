import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Container, Box, Snackbar, IconButton, InputAdornment, Alert } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LinkOffIcon from '@mui/icons-material/LinkOff';


const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [page, setPage] = useState('reset');
    const location = useLocation();
    const navigate = useNavigate();

    const validatePassword = (input) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(input);
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (!token) {
            setError("Invalid or expired token.");
            return;
        }

        const validateToken = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL_BASE}/validate-token`, {
                    params: { token }
                });

                if (response.status !== 200) {
                    setPage('invalid');
                    setError("Token expired or invalid.");
                }
            } catch (error) {
                setPage('invalid');
                if (error.response) {
                    console.error("Response error:", error.response.data);
                    setError(`Server error: ${error.response.data}`);
                } else if (error.request) {
                    console.error("No response received:", error.request);
                    setError("No response received from the server.");
                } else {
                    console.error("Error setting up request:", error.message);
                    setError("Error validating token.");
                }
            }
        };

        validateToken();
    }, [location.search]);

    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);

        if (!value) {
            setPasswordError(false);
            setError('');
        } else if (!validatePassword(value)) {
            setPasswordError(true);
            setError("Password must contain at least 8 characters, including one special character, one letter, and one number.");
        } else {
            setPasswordError(false);
            setError('');
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);

        if (!value) {
            setError('');
        } else if (newPassword && value !== newPassword) {
            setError("Passwords do not match.");
        } else {
            setError('');
        }
    };

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError("Both fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL_BASE}/reset-password`, null, {
                params: { token, password: newPassword },
            });

            if (response.status === 200) {
                setSuccessMessage("Password changed successfully!");
                setOpenSnackbar(true);
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError("Failed to change password.");
            }
        } catch {
            setError("An error occurred. Please try again.");
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
        navigate('/login');
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
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                maxWidth="sm"
                sx={{
                    padding: "20px",
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white',
                    textAlign: 'center',
                    backgroundImage: page === 'reset' ? `url(/bg.png)` : 'none',
                }}
            >
                {page === "reset" ? (
                    <React.Fragment>
                        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>Reset Password</Typography>

                        <TextField
                            fullWidth
                            label="New Password"
                            variant="outlined"
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={handleNewPasswordChange}
                            error={passwordError}
                            helperText={passwordError ? error : ''}
                            sx={{
                                mb: 1,
                                backgroundColor: "#DBF0FD",
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#DBF0FD' },
                                borderRadius: '8px'
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Confirm Password"
                            variant="outlined"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            error={newPassword !== "" && confirmPassword !== "" && newPassword !== confirmPassword}
                            helperText={newPassword && confirmPassword && newPassword !== confirmPassword ? "Passwords do not match." : ''}
                            sx={{
                                mb: 2,
                                backgroundColor: "#DBF0FD",
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#DBF0FD' },
                                borderRadius: '8px'
                            }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={handleChangePassword}
                            sx={{ backgroundColor: '#4a99d3' }}
                            disabled={!newPassword || !confirmPassword || passwordError || (newPassword !== confirmPassword)}
                        >
                            Change Password
                        </Button>
                    </React.Fragment>
                ) : (
                    <Box>
                        <Typography variant="h4" sx={{ color: 'red', fontWeight: "bold", mb: 4 }}>404 OOPS!</Typography>
                        <Alert severity="error" icon={<LinkOffIcon />} sx={{ mb: 2 }}>
                            It looks like the link you’ve used is either broken, expired, or invalid.
                            If you’re trying to reset your password or access a secure area,
                            please request a new link or contact support for further assistance.
                        </Alert>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/login')}
                            sx={{ backgroundColor: '#4a99d3' }}
                        >
                            Go Back
                        </Button>
                    </Box>
                )}
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={successMessage}
            />
        </Container>
    );
};

export default ResetPasswordPage;

import { useState, useEffect } from "react";
import { TextField, Button, Typography, Container, Box, Snackbar, IconButton, InputAdornment } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // Toggle for new password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Toggle for confirm password visibility
    const location = useLocation();
    const navigate = useNavigate();

    // Password complexity validation function
    const validatePassword = (input) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(input);
    };

    // UseEffect to validate token
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

                if (response.status === 200) {
                    console.log('Token validation successful', response.data);
                } else {
                    setError("Token expired or invalid.");
                }
            } catch (error) {
                setError("Error validating token.");
            }
        };

        validateToken();
    }, [location.search]);

    const handleChangePassword = async () => {
        if (!newPassword || !confirmPassword) {
            setError("Both fields are required.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (!validatePassword(newPassword)) {
            setPasswordError(true);
            setError("Password must contain at least 8 characters, including one special character, one letter, and one number.");
            return;
        } else {
            setPasswordError(false);
        }

        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (!token) {
            setError("Token is missing.");
            return;
        }

        try {
            const response = await axios.put(`${process.env.REACT_APP_API_URL_BASE}/reset-password`, null, {
                params: {
                    token: token,
                    password: newPassword,
                },
            });

            if (response.status === 200) {
                setSuccessMessage("Password changed successfully!");
                setOpenSnackbar(true);
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setError("Failed to change password.");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
        navigate('/login');
    };

    // Toggle password visibility for both fields
    const handleShowPasswordClick = () => {
        setShowPassword(!showPassword);
    };

    const handleShowConfirmPasswordClick = () => {
        setShowConfirmPassword(!showConfirmPassword);
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
                alignItems: 'center'
            }}
        >
            <Box
                maxWidth="sm"
                style={{
                    padding: "20px",
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>Reset Password</Typography>

                {/* General Error Message */}
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
                )}

                {/* New Password Field with visibility toggle */}
                <TextField
                    fullWidth
                    label="New Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={passwordError}
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleShowPasswordClick} aria-label="toggle password visibility">
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Confirm Password Field with visibility toggle */}
                <TextField
                    fullWidth
                    label="Confirm Password"
                    variant="outlined"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={handleShowConfirmPasswordClick} aria-label="toggle password visibility">
                                    {showConfirmPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Submit Button */}
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleChangePassword}
                    sx={{ backgroundColor: '#4a99d3' }}
                >
                    Change Password
                </Button>
            </Box>

            {/* Snackbar for Success Message */}
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

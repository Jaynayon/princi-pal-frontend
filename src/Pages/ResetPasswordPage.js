import { useState, useEffect } from "react";
import { TextField, Button, Typography, Container, Box, Snackbar, IconButton, InputAdornment } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
        const token = queryParams.get('token'); // Get token from query params

        if (!token) {
            setError("Invalid or expired token.");
            return; // Exit if token is not present
        }

        // Validate token with the backend
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
                if (error.response) {
                    // Server responded with a status code out of 2xx range
                    console.error("Response error:", error.response.data);
                    setError(`Server error: ${error.response.data}`);
                } else if (error.request) {
                    // No response received
                    console.error("No response received:", error.request);
                    setError("No response received from the server.");
                } else {
                    // Other errors
                    console.error("Error setting up request:", error.message);
                    setError("Error validating token.");
                }
            }
        };

        validateToken(); // Call the validation function
    }, [location.search]);

    // Validate password on change
    const handleNewPasswordChange = (e) => {
        const value = e.target.value;
        setNewPassword(value);

        if (!value) {
            // If the newPassword field is empty, reset errors
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

    // Validate confirm password on change
    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmPassword(value);

        if (!value) {
            // If confirmPassword is empty, reset the error
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

                {/* New Password Field */}
                <TextField
                    fullWidth
                    label="New Password"
                    variant="outlined"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    error={passwordError} // Use boolean here
                    helperText={passwordError ? error : ''} // Helper text can display the error string
                    sx={{ mb: 1 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => {
                                    setShowPassword(!showPassword);
                                    setShowConfirmPassword(!showPassword); // Toggle confirm password visibility
                                }} aria-label="toggle password visibility">
                                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />

                {/* Confirm Password Field */}
                <TextField
                    fullWidth
                    label="Confirm Password"
                    variant="outlined"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={newPassword && confirmPassword && newPassword !== confirmPassword} // boolean condition here
                    helperText={newPassword && confirmPassword && newPassword !== confirmPassword ? "Passwords do not match." : ''} // Helper text for error message
                    sx={{ mb: 2 }}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label="toggle password visibility">
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
                    disabled={!newPassword || !confirmPassword || passwordError || (newPassword !== confirmPassword)} // Disable button if there's any issue
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

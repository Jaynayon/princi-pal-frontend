import { useState } from "react";
import { Box, Button, Divider, List, ListItem, ListItemText, TextField, Typography, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(''); // For non-email-related errors
    const [emailError, setEmailError] = useState(''); // For email validation errors
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Email validation function
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleInputChange = (e) => {
        const inputEmail = e.target.value;
        setEmail(inputEmail);

        // Reset errors if the input is empty
        if (inputEmail === '') {
            setEmailError('');
            setError('');
        } else {
            // Validate email and set appropriate error message
            if (!validateEmail(inputEmail)) {
                setEmailError("Please enter a valid email address.");
            } else {
                setEmailError(''); // Clear email error if valid
            }
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_BASE}/forgot-password`, null, {
                params: { email }
            });
            return response;
        } catch (error) {
            throw error;
        }
    };

    const handleForgotPassword = async () => {
        if (!email) {
            setError("Email is required.");
            return;
        }

        if (emailError) {
            return; // Exit if email is invalid
        }

        setLoading(true);

        try {
            const response = await forgotPassword(email);

            if (response.status === 200 && response.data === "Email sent") {
                setSuccessMessage("Password reset link sent to your email!");
                setOpenSnackbar(true);
                setEmail(''); // Clear email input after success
            } else {
                setError("Failed to send password reset link. Please try again.");
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setError("Email is not registered.");
                } else {
                    setError("An error occurred: " + (error.response.data || error.message));
                }
            } else {
                setError("An error occurred: " + error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
        navigate('/login');
    };

    const style = {
        width: '100%',
        maxWidth: 500,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: '#F5F5F5', // Set background color to #E4E0E1
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    };

    return (
        <Box
            sx={{
                width: "100vw",
                height: "100vh",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: `url(/bg.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            <List sx={style}>
                <ListItem>
                    <ListItemText
                        primary="Forgot Password"
                        primaryTypographyProps={{ variant: 'h5', fontWeight: 'bold', sx: { color: '#003366' } }}
                    />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                    <Box sx={{ width: '100%' }}>
                        <Typography variant="body2">
                            Please enter your email address to receive a password reset link.
                        </Typography>
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={handleInputChange}
                            error={!!emailError} // Show error if emailError is not empty
                            helperText={emailError} // Display the email validation error
                            sx={{ mb: 2, mt: 2 }}
                        />
                        {/* Display general error messages here */}
                        {error && (
                            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                                {error}
                            </Typography>
                        )}
                    </Box>
                </ListItem>
                <Divider component="li" />
                <ListItem sx={{ justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/login')}
                        sx={{
                            mr: 1,
                            backgroundColor: '#E4E0E1',
                            color: '#3C3D37',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: 'darkgray'
                            }
                        }}
                        size="small"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleForgotPassword}
                        sx={{
                            backgroundColor: '#4a99d3',
                            color: 'white',
                            fontWeight: 'bold',
                            '&:hover': {
                                backgroundColor: '#3380a0'
                            }
                        }}
                        disabled={loading || !!emailError || !email} // Disable button if loading, emailError, or empty email
                        size="small"
                    >
                        {loading ? 'Sending...' : 'Send'}
                    </Button>
                </ListItem>
            </List>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                message={successMessage}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position Snackbar above center
            />
        </Box>
    );
};

export default ForgotPasswordPage;

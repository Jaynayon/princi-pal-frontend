import { useState, useEffect } from "react";
import { Box, Button, Divider, List, ListItem, ListItemText, TextField, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';

const EmailVerificationPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState(''); // For non-email-related errors 
    const [emailError, setEmailError] = useState(''); // For email validation errors
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null); // To manage verification state
    const navigate = useNavigate();
    const location = useLocation(); // To access the URL parameters

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

    const sendVerificationEmail = async (email) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_BASE}/send-verification`, null, {
                params: { email }
            });
            return response;
        } catch (error) {
            throw error;
        }
    };

    // New function to verify email with the token
    const verifyEmail = async (token) => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL_BASE}/verify-email`, {
                params: { token }
            });

            if (response.status === 200) {
                setSuccessMessage(response.data); // Show success message from the server
                setVerificationStatus(true);
            }
        } catch (error) {
            if (error.response) {
                setError(error.response.data || "An error occurred during email verification.");
                setVerificationStatus(false);
            } else {
                setError("An error occurred: " + error.message);
                setVerificationStatus(false);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendVerificationEmail = async () => {
        if (!email) {
            setError("Email is required.");
            return;
        }

        if (emailError) {
            return; // Exit if email is invalid
        }

        setLoading(true);

        try {
            const response = await sendVerificationEmail(email);

            if (response.status === 200 && response.data === "Verification email sent.") {
                setSuccessMessage("Verification link sent to your email! Please check your inbox.");
                setOpenSnackbar(true);
                setEmail(''); // Clear email input after success
            } else {
                setError("Failed to send verification link. Please try again.");
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
        navigate('/login'); // Navigate to login or appropriate page after closing snackbar
    };

    // Extract the token from the URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            verifyEmail(token);
        }
    }, [location.search]);

    const style = {
        width: '100%',
        maxWidth: 500,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: '#F5F5F5',
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
                {verificationStatus === null ? ( // Show email input if verification status is not set
                    <>
                        <ListItem>
                            <ListItemText
                                primary="Email Verification"
                                primaryTypographyProps={{ variant: 'h5', fontWeight: 'bold', sx: { color: '#003366' } }}
                            />
                        </ListItem>
                        <Divider component="li" />
                        <ListItem>
                            <Box sx={{ width: '100%' }}>
                                <Typography variant="body2">
                                    Please enter your email address to receive a verification link.
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
                                onClick={handleSendVerificationEmail}
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
                    </>
                ) : verificationStatus ? ( // Show success message
                    <Box
                        sx={{
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            p: 4,
                        }}
                    >
                        <MarkEmailReadIcon
                            sx={{ fontSize: 100, color: '#4CAF50', mb: 2 }} // Big green icon for success
                        />
                        <Typography
                            variant="h4"
                            sx={{ color: '#4CAF50', fontWeight: 'bold', mb: 1 }}
                        >
                            Email Verified!
                        </Typography>
                        <Typography
                            variant="body1"
                            sx={{ color: '#666', mb: 4 }}
                        >
                            Your email has been successfully verified.
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/login')}
                            sx={{
                                backgroundColor: '#4a99d3',
                                color: 'white',
                                fontWeight: 'bold',
                                '&:hover': {
                                    backgroundColor: '#3380a0',
                                },
                                px: 4, // Padding for the button to make it wider
                            }}
                        >
                            Continue to Login
                        </Button>
                    </Box>
                ) : ( // Show error message
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
            </List>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default EmailVerificationPage;

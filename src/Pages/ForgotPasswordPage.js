import { useState } from "react";
import { TextField, Button, Typography, Container, Box, Snackbar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from 'axios'; // Ensure axios is imported for making HTTP requests
import React from 'react';
 
const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
 
    // Function to handle the forgot password API call
    const forgotPassword = async (email) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_BASE}/forgot-password`, null, {
                params: { email: email }
            });
            console.log('Response:', response);
            return response; // Return entire response to check status code and data
        } catch (error) {
            console.error('Error sending forgot password request:', error);
            throw error;
        }
    };
    
    const handleForgotPassword = async () => {
        if (!email) {
            setError("Email is required.");
            return;
        }
    
        setError('');
        setLoading(true);
    
        try {
            const response = await forgotPassword(email);
    
            // Check if the response is 200 and the message is "Email sent"
            if (response.status === 200 && response.data === "Email sent") {
                setSuccessMessage("Password reset link sent to your email!");
                setOpenSnackbar(true);
                setEmail(''); // Clear the email field after success
            } else {
                setError("Failed to send password reset link. Please try again.");
            }
        } catch (error) {
            setError("An error occurred: " + (error.response?.data || error.message));
        } finally {
            setLoading(false);
        }
    };
    
    
 
    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
        navigate('/login'); // Navigate to login page after showing the success message
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
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>Forgot Password</Typography>
                {error && (
                    <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
                )}
                <TextField
                    fullWidth
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    fullWidth
                    onClick={handleForgotPassword}
                    sx={{ backgroundColor: '#4a99d3' }}
                    disabled={loading} // Disable button while loading
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </Button>
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
 
export default ForgotPasswordPage;
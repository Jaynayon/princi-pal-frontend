import React from 'react';
import { Container, Typography, Button, Box, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const TokenExpiredPage = () => {
    const navigate = useNavigate();
    const [openSnackbar, setOpenSnackbar] = React.useState(false);

    const handleOkClick = () => {
        setOpenSnackbar(true);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
        navigate('/login'); // Redirect to login after closing snackbar
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
                style={{
                    padding: "20px",
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    textAlign: 'center',
                    backgroundColor: 'white', // Set background color to white
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>Access Token Expired</Typography>
                <Alert severity="error" sx={{ mb: 2 }}>
                    Your access token has expired and cannot be extended. To continue, please request a new password reset link.
                </Alert>

                <Button
                    variant="contained"
                    onClick={handleOkClick}
                    sx={{ backgroundColor: '#4a99d3' }}
                >
                    OK
                </Button>
            </Box>

            {/* Snackbar for redirect confirmation */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000}
                onClose={handleSnackbarClose}
                message="Redirecting to login..."
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Centered above
                sx={{ marginTop: '20px' }} // Optional: adds a bit of space from the top
            />
        </Container>
    );
};

export default TokenExpiredPage;

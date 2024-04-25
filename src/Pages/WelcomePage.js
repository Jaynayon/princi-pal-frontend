import React from "react";
import { Typography, Container, Box, Button, Grid } from "@mui/material";

const WelcomePage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
      }}
    >
      {/* Grid Container for Layout */}
      <Grid container spacing={0}
        sx={{
          height: '100%', // Ensure container takes full height
        }}
      >
        {/* Left Sidebar (Blue Box) */}
        <Grid item xs={12} md={4} lg={4}>
          <Box
            sx={{
              height: '100%',
              backgroundColor: '#4a99d3',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
            }}
          >
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '30px'
            }}>
              <img
                style={{
                  width: "243px",
                  height: "185px",
                  objectFit: "cover",
                }}
                alt=""
                src="/logoremovebgpreview-1@2x.png"
              />
              <Typography
                variant="h4"
                sx={{
                  lineHeight: '26px',
                  width: '354px',
                  height: '23px',
                  fontWeight: 500,
                  color: 'white',
                  fontSize: 'calc(0.4 * 4.5rem)' // Font size calculation based on h4 font size and scale factor of 1.5
                }}
              >
                Welcome to PrinciPal
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontSize: '14px',
                  lineHeight: '26px',
                  width: '330px',
                  color: 'white',
                  letterSpacing: '-0.4px', // Adjust the letter spacing as needed
                }}
              >
                Navigate School Management Effortlessly
              </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px',
                width: '100%',
                height: '100%',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '80%',
                  height: '100%',
                }}
              >
                <Button
                  sx={{
                    borderRadius: '100px',
                    width: '100%',
                    padding: '9px 16px',
                    fontWeight: 'bold',
                    marginBottom: '16px',
                    backgroundColor: 'rgba(12, 120, 181, 0.89)',
                  }}
                  disableElevation
                  color="primary"
                  variant="contained"
                  href="/register"
                >
                  Register
                </Button>
                <Button
                  sx={{
                    borderRadius: '100px',
                    width: '100%',
                    padding: '9px 16px',
                    fontWeight: 'bold',
                    backgroundColor: '#dadada',
                    color: '#31363F',
                  }}
                  disableElevation
                  color="primary"
                  variant="contained"
                  href="/login"
                >
                  Log in
                </Button>
              </Box>
              <Typography variant="body2" sx={{
                alignSelf: 'center', marginBottom: '30px', color: 'white'
              }}>
                By continuing, you agree to the <strong>Terms of Service</strong> and confirm that you have read our{' '}
                <strong>Privacy Policy</strong>.
              </Typography>
            </Box>
          </Box>
        </Grid>

        {/* Main Content Area (Right Side) */}
        <Grid item xs={12} md={8} lg={8}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              overflowY: 'auto', // Enable vertical scrolling if needed
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '20px',
              color: "#4a99d3",
              backgroundImage: 'url("/bg.png")', // Add the URL of the background image here
              backgroundSize: 'cover',
            }}
          >
            <Container maxWidth="md">
              <Typography variant="h3" fontWeight="500" sx={{ marginBottom: "20px", textAlign: 'left' }}>
                PrinciPal: Streamlined Public School Document Management System
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: "140.63%", textAlign: 'left' }}>
                The pinnacle of innovation in public school document management. Step
                into a realm where efficiency, organization, and productivity converge
                to redefine how educational institutions handle their vital paperwork.
              </Typography>
            </Container>
          </Box>
        </Grid>
      </Grid>
    </Box >
  );
};

export default WelcomePage;
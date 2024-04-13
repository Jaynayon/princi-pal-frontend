import React from "react";
import { Typography, Container, Box, Button } from "@mui/material";

const Layout = () => {
  return (
    <Container
      sx={{
        position: 'fixed', // Changed position to fixed
        top: 0,
        left: 0,
        backgroundColor: '#4a99d3',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        width: '40%', // Adjusted width to 40%
        height: '100%',
        overflow: 'hidden',
        textAlign: 'center',
        fontSize: '36px',
        color: '#fff',
        fontFamily: 'Mulish',
      }}
    >
      <img
        style={{
          position: "absolute",
          top: "10%", // Adjusted top position using percentage
          left: "50%",
          transform: "translateX(-50%)",
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
          position: 'absolute',
          top: '30%', // Adjusted top position using percentage
          left: '20%', // Adjusted left position using percentage
          lineHeight: '26px',
          width: '384px',
          height: '23px',
          fontWeight: 500,
        }}
      >
        Welcome to PrinciPal
      </Typography>
      <Typography
        variant="body1"
        sx={{
          position: 'absolute',
          top: '33%', // Adjusted top position using percentage
          left: '24%', // Adjusted left position using percentage
          fontSize: '14px',
          lineHeight: '26px',
          width: '340px',
          fontWeight: 600,
        }}
      >
        Navigate School Management Effortlessly
      </Typography>
      <Box
        sx={{
          position: 'absolute',
          top: '658px',
          left: 'calc(50% - 164px)',
          width: '328px',
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
          href="/Login"
        >
          Log in
        </Button>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          bottom: '22px',
          left: 'calc(50% - 165px)',
          fontSize: '11px',
          lineHeight: '19px',
          width: '328px',
        }}
      >
        <Typography variant="body2">
          By continuing, you agree to the <strong>Terms of Service</strong> and confirm that you have read our{' '}
          <strong>Privacy Policy</strong>.
        </Typography>
      </Box>
    </Container>
  );
};

const WelcomePage = () => {
  return (
    <Container
      maxWidth={false}
      sx={{
        position: "relative", 
        backgroundColor: "linear-gradient(1.02deg, #4a99d3 7.81%, rgba(74, 153, 211, 0)), #fff",
        boxShadow: "0px 4px 16px rgba(75, 0, 129, 0.26)",    
        height: "100vh",
        textAlign: "left",
        fontSize: "24px",
        color: "#4a99d3",
        fontFamily: "Mulish",
        margin: 0,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "40%", // Adjusted top position using percentage
          left: "50%", // Adjusted left position using percentage
          width: "40%", // Adjusted width using percentage
          height: "40%", // Adjusted height using percentage
        }}
      >
        <Typography variant="h3" fontWeight="500" sx={{ marginBottom: "20px" }}>
          PrinciPal: Streamlined Public School Document Management System
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: "140.63%" }}>
          The pinnacle of innovation in public school document management. Step
          into a realm where efficiency, organization, and productivity converge
          to redefine how educational institutions handle their vital paperwork.
        </Typography>
      </Box>
      <Layout />
    </Container>
  );
};

export default WelcomePage;

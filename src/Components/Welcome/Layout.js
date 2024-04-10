import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';

const Layout = () => {
  return (
    <Container
      sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        backgroundColor: '#4a99d3',
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        width: 542,
        height: 1024,
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
          top: "90px",
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
          top: '298px',
          left: '78px',
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
          top: '324px',
          left: '101px',
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
          href="/Registration"
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

export default Layout;

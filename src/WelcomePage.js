import React from "react";
import Layout from "./Components/Welcome/Layout";
import { Typography, Container, Box } from "@mui/material";

const WelcomePage = () => {
  return (
    <Container
      sx={{
        position: "relative",
        backgroundColor: "#fff",
        minHeight: "100vh",
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
          top: "1024px",
          left: "1440px",
          background:
            "linear-gradient(1.02deg, #4a99d3 7.81%, rgba(74, 153, 211, 0)), #fff",
          boxShadow: "0px 4px 16px rgba(75, 0, 129, 0.26)",
          width: "1440px",
          height: "1024px",
          transform: "rotate(-180deg)",
          transformOrigin: "0 0",
          opacity: "0.2",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "300px", // Adjusted top position for the description text
          left: "680px",
          width: "689px",
          height: "360px",
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

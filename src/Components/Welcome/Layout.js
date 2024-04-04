import { Button, Container, Typography } from "@mui/material";

const Layout = () => {
  return (
    <Container
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        backgroundColor: "#4a99d3",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        width: 542,
        height: 1024,
        overflow: "hidden",
        textAlign: "center",
        fontSize: "36px",
        color: "#fff",
        fontFamily: "Mulish",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={500}
        sx={{
          position: "absolute",
          top: "298px",
          left: "78px",
          lineHeight: "26px",
          width: "384px",
          height: "23px",
        }}
      >
        Welcome to PrinciPal
      </Typography>
      <Typography
        variant="body1"
        fontWeight={600}
        sx={{
          position: "absolute",
          top: "324px",
          left: "101px",
          fontSize: "14px",
          lineHeight: "26px",
          width: "340px",
        }}
      >
        Navigate School Management Effortlessly
      </Typography>
      <Button
        sx={{
          position: "absolute",
          top: "658px",
          left: "calc(50% - 164px)",
          borderRadius: "100px",
          backgroundColor: "rgba(12, 120, 181, 0.89)",
          width: "328px",
          padding: "9px 16px",
          boxSizing: "border-box",
          textTransform: "none",
          fontWeight: "bold",
        }}
        disableElevation
        color="primary"
        variant="contained"
        href="/22-registration-page"
      >
        Register
      </Button>
      <Button
        sx={{
          position: "absolute",
          top: "716px",
          left: "calc(50% - 164px)",
          borderRadius: "100px",
          backgroundColor: "#dadada",
          width: "328px",
          padding: "9px 16px",
          boxSizing: "border-box",
          color: "#000",
          textTransform: "none",
          fontWeight: "bold",
        }}
        disableElevation
        color="primary"
        variant="contained"
        href="/Login"
      >
        Log in
      </Button>
      <div
        style={{
          position: "absolute",
          bottom: "22px",
          left: "calc(50% - 165px)",
          fontSize: "11px",
          lineHeight: "19px",
          width: "328px",
        }}
      >
        <Typography variant="body2">
          By continuing, you agree to the <strong>Terms of Service</strong> and confirm that you have read our <strong>Privacy Policy</strong>.
        </Typography>
      </div>
    </Container>
  );
};

export default Layout;

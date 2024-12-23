import React, { useState, useEffect, useCallback } from "react";
import { styled, createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import axios from "axios";
import Button from "@mui/material/Button";

// Custom imports
import { styling } from "./styling";
import DisplayItems from './DisplayItems';
import ProfileTab from "../Modal/ProfileTab";
import { useNavigationContext } from "../../Context/NavigationProvider";
import CustomizedSwitches from "./CustomizedSwitches";
import NavigationSearchBar from "./NavigationSearchBar";
import NotificationTab from './NotificationTab';
import EmailVerificationModal from "../Modal/EmailVerificationModal";
import { useAppContext } from "../../Context/AppProvider";

const drawerWidth = 220;

// Styled components for AppBar and Drawer
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["width", "margin", "padding"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  paddingLeft: 5,
  ...(open && {
    transition: theme.transitions.create(["width", "margin", "padding"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(open
      ? {}
      : {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7.7),
      }),
  },
}));

export function transformSchoolText(input) {
  return input
    .split(" ")
    .map((word, index) => {
      return index === input.split(" ").length - 1
        ? word.toUpperCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

const displayTitle = (selected) => {
  if (["Dashboard", "Settings", "People", "Logout"].includes(selected)) {
    return selected;
  }
  return (
    <span>
      School <span style={{ color: "#20A0F0" }}>({transformSchoolText(selected || "None")})</span>
    </span>
  );
};

// Function to send verification email
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

export default function Navigation({ children }) {
  const { currentUser, fetchCurrentUser } = useAppContext();
  const { list, setSelected, selected, open, toggleDrawer, navStyle, mobileMode } = useNavigationContext();
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [, setIsVerified] = useState(false);

  const defaultTheme = createTheme({
    typography: {
      fontFamily: "Mulish",
    },
    navStyle: styling[navStyle],
  });

  // Check if currentUser is verified
  useEffect(() => {
    if (currentUser) {
      setIsVerified(currentUser.verified);
    }
  }, [currentUser]);

  const handleVerifyClick = async () => {
    setLoading(true);
    try {
      await sendVerificationEmail(currentUser.email);
      setOpenModal(true);
    } catch (error) {
      console.error("Failed to send verification email:", error);
      alert("Failed to send verification email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = useCallback(() => {
    setOpenModal(false);
  }, []);

  const drawerContent = () => {
    return (
      <React.Fragment>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Box sx={{ height: "75px", display: "flex", alignItems: "center" }}>
            <IconButton
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{ color: (theme) => theme.navStyle.color, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <Toolbar sx={{ px: [0.5], width: "100%", display: !open && { display: "none" } }}>
            <ProfileTab />
            <IconButton onClick={toggleDrawer} sx={{ color: (theme) => theme.navStyle.color }}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
        </Box>
        <List component="nav" sx={{ margin: "5px" }}>
          <DisplayItems list={list} selected={selected} setSelected={setSelected} />
        </List>
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%", mb: "20px" }}>
          <CustomizedSwitches />
        </Box>
      </React.Fragment>
    )
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        {/* Mobile or Desktop Drawer */}
        {mobileMode ?
          <MuiDrawer
            anchor="left"
            open={open}
            onClose={toggleDrawer}
            sx={{
              "& .MuiDrawer-paper": {
                backgroundColor: (theme) => theme.navStyle.base,
                boxShadow: "none",
                borderRight: "none"
              },
            }}
          >
            {drawerContent()}
          </MuiDrawer>
          :
          <Drawer
            variant="permanent"
            open={open}
            onClose={toggleDrawer}
            sx={{
              "& .MuiDrawer-paper": {
                backgroundColor: (theme) => theme.navStyle.base,
                boxShadow: "none",
                borderRight: "none"
              },
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawerContent()}
          </Drawer>
        }
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth={false} disableGutters>
            <AppBar
              position="relative"
              open={open}
              sx={{ boxShadow: "none", backgroundColor: "transparent", paddingTop: "5px" }}
            >
              <Toolbar sx={{ color: "#C5C7CD" }}>
                <IconButton
                  aria-label="open drawer"
                  onClick={toggleDrawer}
                  sx={{
                    display: !mobileMode ? "none" : null,
                    color: '#252733'
                  }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  component="h1"
                  variant="h6"
                  color="inherit"
                  noWrap
                  sx={{
                    flexGrow: 1,
                    textAlign: "left",
                    color: "#252733",
                    fontWeight: "bold",
                    width: "400px",
                  }}
                >
                  {displayTitle(selected)}
                </Typography>
                <NavigationSearchBar />
                <NotificationTab
                  currentUser={currentUser}
                  fetchCurrentUser={fetchCurrentUser}
                />
              </Toolbar>
            </AppBar>

            {/* Email Verification Indicator */}
            {currentUser && !currentUser.verified && (
              <Container>
                <Box
                  sx={{
                    backgroundColor: "#f44336",
                    padding: "10px",
                    borderRadius: "4px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: "20px",
                  }}
                >
                  <Typography variant="body2" color="white" sx={{ flexGrow: 1 }}>
                    Please check your email to verify your account and keep your current username.
                  </Typography>
                  <Button
                    onClick={handleVerifyClick}
                    variant="outlined" // Change to outlined variant
                    sx={{
                      minWidth: "80px",
                      minHeight: "30px",
                      textTransform: "none", // Remove uppercase transformation
                      borderColor: "white", // Set the border color to white
                      color: "white", // Set the text color to white
                      fontSize: "0.75rem", // Set the font size to 0.75rem
                      "&:hover": {
                        borderColor: "white", // Ensure the border stays white on hover
                        backgroundColor: "rgba(255, 255, 255, 0.1)", // Optional: Add a light background on hover
                      },
                    }}
                    disabled={loading}
                  >
                    <Typography variant="body2" color="white">
                      {loading ? "Sending..." : "Resend Email"}
                    </Typography>
                  </Button>
                </Box>
              </Container>

            )}
            {children}
          </Container>
        </Box>
      </Box>

      {/* Modal for verification email status */}
      <EmailVerificationModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        currentUser={currentUser}
      />
    </ThemeProvider>
  );
}

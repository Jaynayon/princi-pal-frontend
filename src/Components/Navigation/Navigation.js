// React imports
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate


// Material-UI imports
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
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

// Custom imports
import { styling } from "./styling";
import DisplayItems from './DisplayItems'; // Correct import for the default export
import ProfileTab from "../Modal/ProfileTab";
import { useNavigationContext } from "../../Context/NavigationProvider";
import CustomizedSwitches from "./CustomizedSwitches";
import NavigationSearchBar from "./NavigationSearchBar";
import NotificationTab from './NotificationTab';

const drawerWidth = 220;

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

export default function Navigation({ children }) {
  const navigate = useNavigate(); // Use the useNavigate hook
  const { list, setSelected, selected, open, toggleDrawer, navStyle, mobileMode, isEmailVerified } = useNavigationContext();

  const defaultTheme = createTheme({
    typography: {
      fontFamily: "Mulish",
    },
    navStyle: styling[navStyle],
  });

  const handleVerifyClick = () => {
    console.log("Verify button clicked!"); // Debugging log
    navigate("/verify-email"); // Ensure navigate is called correctly
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          open={open}
          sx={{
            "& .MuiDrawer-paper": {
              backgroundColor: (theme) => theme.navStyle.base,
              boxShadow: "none",
              borderRight: "none",
              display: mobileMode && !open ? "none" : null,
            },
          }}
        >
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
        </Drawer>
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
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, pl: 4 }}>
            <Grid container spacing={3}>
              <AppBar position="relative" open={open} sx={{ boxShadow: "none", backgroundColor: "transparent", paddingTop: "5px" }}>
                <Toolbar sx={{ pr: "24px", color: "#C5C7CD", pl: 1 }}>
                  <IconButton
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{ display: !mobileMode ? "none" : null, color: (theme) => theme.navStyle.color }}
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
                  {/* Search Bar */}
                  <NavigationSearchBar />
                  <NotificationTab />
                </Toolbar>
              </AppBar>

              {/* Email Verification Indicator */}
              {!isEmailVerified && (
                <Box
                  sx={{
                    backgroundColor: "#f44336", // Red background
                    padding: "10px",
                    borderRadius: "4px",
                    mb: "20px",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    pl: "15px",
                    pr: "15px",
                    width: "100%", // Full width
                  }}
                >
                  <Typography variant="body1" color="white" sx={{ flexGrow: 1 }}>
                    Verify your email
                  </Typography>
                  <button
                    style={{
                      backgroundColor: "white", // Button background color
                      color: "#f44336", // Text color for the button
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 16px",
                      cursor: "pointer",
                      fontWeight: "bold",
                      fontSize: "14px",
                    }}
                    onClick={handleVerifyClick} // Call the handler
                  >
                    Verify
                  </button>
                </Box>
              )}

              {children}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

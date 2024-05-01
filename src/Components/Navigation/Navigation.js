// React imports
import * as React from "react";
import { useEffect, useState } from "react";

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
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SearchIcon from "@mui/icons-material/Search";
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

// Custom imports
import { styling } from "./styling";
import { DisplayItems, ProfileTab } from "./DisplayItems";
import { useNavigationContext } from "../../Context/NavigationProvider";
import CustomizedSwitches from "./CustomizedSwitches";
import NavigationSearchBar from "./NavigationSearchBar";

//Static object testing
const User = {
  name: "Jay Nayon",
  email: "jay.nayonjr@cit.edu",
};

const drawerWidth = 220;
//const initialWidth = 70;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  transition: theme.transitions.create(["width", "margin", "padding"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  paddingLeft: 5, //starts with an initial padding instead of 0
  ...(open && {
    //marginLeft: drawerWidth,
    //paddingLeft: 0, //removes the space and adjust to the drawer
    //width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin", "padding"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => {
  const [mobileMode, setMobileMode] = useState(false); // State to track position

  const updateMobileMode = () => {
    const { innerWidth } = window;
    setMobileMode(innerWidth < 600);
  };

  useEffect(() => {
    // Call the function to set initial mobileMode state
    updateMobileMode();

    const handleResize = () => {
      // Call the function to update mobileMode state on resize
      updateMobileMode();
    };

    // Add event listener for resize
    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Run effect only on mount and unmount

  return {
    "& .MuiDrawer-paper": {
      position: mobileMode ? "absolute" : "relative",
      whiteSpace: "nowrap",
      width: drawerWidth,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: "border-box",
      ...(!open && {
        overflowX: "hidden",
        transition: theme.transitions.create("width", {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7.7),
        [theme.breakpoints.up("sm")]: {
          width: theme.spacing(7.7),
        },
      }),
    },
  };
});

const displayTitle = (selected) => {
  if (
    selected === "Dashboard" ||
    selected === "Settings" ||
    selected === "People" ||
    selected === "Logout"
  ) {
    return selected; // Return selected if it matches any of the specified values
  }

  return (
    <>
      <span>School </span>
      <span style={{ color: "grey" }}>({selected})</span>
    </>
  );
};

export default function Navigation({ children }) {
  const { open, toggleDrawer, selected, navStyle, mobileMode } = useNavigationContext();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const [options, setOptions] = React.useState([
    'CIT-U is inviting you to be a part of the organization',
    'Your application at CTU has been cancelled',
    'Budget limit exceeded; urgent action required to align expenses with allocated funds',
    'Congratulations, you have passed the first phase of the application process',
    'CIM is inviting you to be a part of the organization',
  ]);

  const handleClearOptions = () => {
    setOptions([]); // Clear options by setting it to an empty array
  };

  const ITEM_HEIGHT = 48;

  const defaultTheme = createTheme({
    typography: {
      fontFamily: "Mulish",
    },
    navStyle: styling[navStyle], //default or light
  });

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
              display: mobileMode && !open ? "none" : null
            },
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center", // Center items vertically
            }}
          >
            <Box
              sx={{
                height: "75px",
                display: "flex",
                alignItems: "center", // Center items vertically
              }}
            >
              <IconButton
                aria-label="open drawer"
                onClick={toggleDrawer}
                sx={{
                  color: (theme) => theme.navStyle.color,
                  ...(open && { display: "none" }),
                }}
              >
                <MenuIcon />
              </IconButton>
            </Box>

            <Toolbar
              sx={{
                px: [0.5],
                width: "100%",
                display: "flex",
                ...(!open && { display: "none" }),
              }}
            >
              <ProfileTab user={User} />
              <IconButton
                onClick={toggleDrawer}
                sx={{
                  //justifyContent: 'flex-end',
                  color: (theme) => theme.navStyle.color,
                }}
              >
                <ChevronLeftIcon color="inherit" />
              </IconButton>
            </Toolbar>
          </Box>
          <List
            component="nav"
            sx={{
              marginRight: "5px",
              marginLeft: "5px",
              paddingTop: "5px",
              marginTop: "5px",
            }}
          >
            <DisplayItems />
          </List>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end", // Align items at the bottom
              height: "100%",
              marginBottom: "20px",
            }}
          >
            <CustomizedSwitches />
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4, pl: 4 }}>
            <Grid container spacing={3}>
              <AppBar
                position="relative"
                open={open}
                sx={{
                  boxShadow: "none",
                  backgroundColor: "transparent",
                  paddingTop: "5px",
                }}
              >
                <Toolbar
                  sx={{
                    pr: "24px", // keep right padding when drawer closed
                    color: "#C5C7CD", //gets inherited
                    pl: 1
                  }}
                >
                  <IconButton
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                      display: !mobileMode ? "none" : null,
                      color: (theme) => theme.navStyle.color,
                      //...(open && { display: "none" }),
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
                      width: '400px'
                    }}
                  >
                    {displayTitle(selected)}
                  </Typography>

                  {/* Search Bar */}
                  <NavigationSearchBar />
                  <Box>
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                      <Badge badgeContent={5} color="secondary">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                      PaperProps={{
                        style: {
                          maxHeight: ITEM_HEIGHT * 10.5,
                          width: '70ch',
                        },
                      }}
                    >
                      <Typography variant="subtitle1" sx={{ paddingLeft: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        Notifications
                        <DeleteOutlineIcon sx={{ ml: 60 }} onClick={handleClearOptions} />
                      </Typography>

                      <Tabs
                        value={0}
                        variant="fullWidth"
                        textColor="primary"
                        indicatorColor="primary"
                      >
                        <Tab label="All" />
                      </Tabs>

                      {options.map((option, index) => [
                        <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleMenuClose}>
                          {option}
                        </MenuItem>,
                        index !== options.length - 1 && <Divider key={`divider-${index}`} />
                      ])}
                    </Menu>
                  </Box>
                </Toolbar>
              </AppBar>
              {children}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

// React imports
import React, { useEffect, useState, useCallback } from "react";
import axios from 'axios';

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
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Divider from '@mui/material/Divider';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Button from '@mui/material/Button';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';


// Custom imports
import { styling } from "./styling";
import { DisplayItems, ProfileTab } from "./DisplayItems";
import { useNavigationContext } from "../../Context/NavigationProvider";
import CustomizedSwitches from "./CustomizedSwitches";
import NavigationSearchBar from "./NavigationSearchBar";
import { useSchoolContext } from '../../Context/SchoolProvider';


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
})(({ theme, open }) => {
  const [mobileMode, setMobileMode] = useState(false);

  const updateMobileMode = () => {
    const { innerWidth } = window;
    setMobileMode(innerWidth < 600);
  };

  useEffect(() => {
    updateMobileMode();

    const handleResize = () => {
      updateMobileMode();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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

export function transformSchoolText(input) {
  let words = input.split(' ');
  return words.map((word, index) => {
    if (index === words.length - 1) {
      return word.toUpperCase();
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  }).join(' ');
}

const displayTitle = (selected) => {
  if (
    selected === "Dashboard" ||
    selected === "Settings" ||
    selected === "People" ||
    selected === "Logout"
  ) {
    return selected;
  }

  return (
    <>
      <span>School </span>
      <span style={{ color: "grey" }}>({transformSchoolText(selected || "None")})</span>
    </>
  );
};

export default function Navigation({ children }) {
  const { open, toggleDrawer, selected, navStyle, mobileMode, currentUser, options, setOptions, fetchUserNotifications, } = useNavigationContext();
  const { month, year, currentDocument, currentSchool } = useSchoolContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleMenuOpen = async (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  
const handleClearOptions = async () => {
  // Check if the current user is available
  if (!currentUser || !currentUser.id) {
    console.log('No current user ID');
    return;
  }

    try {
      await axios.delete(`${process.env.REACT_APP_API_URL_NOTIF}/user/${currentUser.id}`, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
        }
      });

    // Clear options after deletion
    setOptions([]);

    // Manage localStorage for notifications
    let savedNotifications = JSON.parse(localStorage.getItem('createdNotifications')) || [];
    let deletedNotifications = JSON.parse(localStorage.getItem('deletedNotifications')) || [];

    // Move saved notifications to the deleted notifications list
    savedNotifications.forEach(NotificationsKey => {
      deletedNotifications.push(NotificationsKey);
    });

    // Update localStorage
    localStorage.setItem('deletedNotifications', JSON.stringify(deletedNotifications));
    localStorage.removeItem('createdNotifications');
  } catch (error) {
    console.error('Error clearing notifications:', error);
  } finally {
    handleMenuClose();
  }
};

  const handleAcceptNotification = async (notificationId) => {
    try {
      if (!notificationId) {
        throw new Error("Invalid request: notificationId is required.");
      }
      await axios.post(`${process.env.REACT_APP_API_URL_ASSOC}/approve/${notificationId}`, {}, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
        }
      });
      const updateNotificationUrl = `${process.env.REACT_APP_API_URL_NOTIF}/accept/${notificationId}`;
      await axios.put(updateNotificationUrl, {
        details: 'You accepted the invitation',
        hasButtons: false,
      }, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
        }
      });

  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
    } else if (error.request) {
      console.error('No Response:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
};


const handleRejectNotification = async (notificationId) => {
  try {
    if (!notificationId) {
      throw new Error("Invalid request: notificationId is required.");
    }

      const rejectNotificationUrl = `${process.env.REACT_APP_API_URL_NOTIF}/reject/${notificationId}`;
      await axios.put(rejectNotificationUrl, {}, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
        }
      });


      const deleteAssociation = `${process.env.REACT_APP_API_URL_ASSOC}/delete/${notificationId}`;
      await axios.delete(deleteAssociation, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
        }
      });

      const deleteNotification = `${process.env.REACT_APP_API_URL_NOTIF}/${notificationId}`;
      await axios.delete(deleteNotification, {
        headers: {
          'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
        }
      });

  } catch (error) {
    if (error.response) {
      console.error('Server Error:', error.response.data);
    } else if (error.request) {
      console.error('No Response:', error.request);
    } else {
      console.error('Error:', error.message);
    }
  }
};

useEffect(() => {
  if (currentDocument && currentDocument.budgetLimit > 0) {
    const NotificationsKey = `budgetLimit-positive-${currentDocument.id || ''}`;
    const savedNotifications = JSON.parse(localStorage.getItem('createdNotifications')) || [];
    if (!savedNotifications.includes(NotificationsKey)) {
      const notificationPayload = {
        userId: currentUser.id,
        details: `The budget limit for ${month} ${year} has been set to ₱${currentDocument.budgetLimit}.`,
        timestamp: new Date().toISOString(),
      };

      axios.post(`${process.env.REACT_APP_API_URL_NOTIF}/create`, notificationPayload, {
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
        }
    })
        .then(response => {
          console.log("Notification created successfully:", response.data);
          fetchUserNotifications(currentUser.id);
          savedNotifications.push(NotificationsKey);
          localStorage.setItem('createdNotifications', JSON.stringify(savedNotifications));
        })
        .catch(error => {
          console.error("Error creating notification:", error.response ? error.response.data : error.message);
        });
    }
  }
}, [currentDocument, currentUser, month, year, fetchUserNotifications]);

useEffect(() => {
  if (currentDocument && currentDocument.budgetLimit > 0 && currentDocument.budgetLimitExceeded) {
    const NotificationsKey = `budgetLimit-exceeded-${currentDocument.id || ''}`;
    const savedNotifications = JSON.parse(localStorage.getItem('createdNotifications')) || [];
    if (!savedNotifications.includes(NotificationsKey)) {
      const notificationPayload = {
        userId: currentUser.id,
        details: `Attention: The budget limit for ${month} ${year} has been exceeded.`,
        timestamp: new Date().toISOString(),
      };

      axios.post(`${process.env.REACT_APP_API_URL_NOTIF}/create`, notificationPayload, {
        headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
        }
    })
        .then(response => {
          console.log("Notification created successfully:", response.data);
          fetchUserNotifications(currentUser.id);
          savedNotifications.push(NotificationsKey);
          localStorage.setItem('createdNotifications', JSON.stringify(savedNotifications));
        })
        .catch(error => {
          const errorDetails = error.response ? JSON.stringify(error.response.data) : error.message;
          console.error("Error creating notification:", errorDetails);
        });
    }
  }
}, [currentDocument, currentUser, month, year, fetchUserNotifications]);


useEffect(() => {
  if (currentUser?.id) {
      fetchUserNotifications(currentUser.id);
  }
}, [currentUser, fetchUserNotifications]);

  const ITEM_HEIGHT = 48;

  const defaultTheme = createTheme({
    typography: {
      fontFamily: "Mulish",
    },
    navStyle: styling[navStyle],
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
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                height: "75px",
                display: "flex",
                alignItems: "center",
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
              <ProfileTab />
              <IconButton
                onClick={toggleDrawer}
                sx={{
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
              justifyContent: "flex-end",
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
                    pr: "24px",
                    color: "#C5C7CD",
                    pl: 1
                  }}
                >
                  <IconButton
                    aria-label="open drawer"
                    onClick={toggleDrawer}
                    sx={{
                      display: !mobileMode ? "none" : null,
                      color: (theme) => theme.navStyle.color,
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
                      <Badge badgeContent={options.length} color="secondary">
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
                              maxHeight: ITEM_HEIGHT * 13,
                              width: '42ch',
                              position: 'fixed',
                          },
                      }}
                  >
                      <Typography variant="subtitle1" sx={{ paddingLeft: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                          Notifications
                          <DeleteOutlineIcon sx={{ ml: 25 }} onClick={handleClearOptions} />
                      </Typography>

                      <Tabs
                          value={0}
                          variant="fullWidth"
                          textColor="primary"
                          indicatorColor="primary"
                      >
                          <Tab label="All" />
                      </Tabs>
                      {loading && <Typography sx={{ padding: '16px' }}>Loading...</Typography>}
                      {error && <Typography sx={{ padding: '16px', color: 'red' }}>Error: {error}</Typography>}
                      {options.map((option, index) => {
                        console.log("Option ID:", option.id); // Ensure correct property is accessed
                        return (
                          <div key={option.id}>
                            <MenuItem onClick={handleMenuClose} sx={{ whiteSpace: 'normal' }}>
                              <CircleNotificationsIcon sx={{ marginRight: '8px' }} />
                              {option.details}
                              {option.hasButtons && (
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                  <Button 
                                    onClick={() => handleAcceptNotification(option.id)} 
                                    sx={{ marginRight: '8px' }}
                                  >
                                    Accept
                                  </Button>
                                  <Button onClick={() => handleRejectNotification(option.id)}
                                    sx={{ marginRight: '8px' }}
                                  >
                                    Reject
                                  </Button>
                                </Box>
                              )}
                            </MenuItem>
                            {index !== options.length - 1 && <Divider />}
                          </div>
                        );
                      })}
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

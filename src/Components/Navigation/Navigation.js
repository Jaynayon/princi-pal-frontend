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

// Static object testing
const User = {
  name: "Jay Nayon",
  email: "jay.nayonjr@cit.edu",
};

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
  const { open, toggleDrawer, selected, navStyle, mobileMode, currentUser } = useNavigationContext();
  const { month, year, currentDocument, jev, currentSchool } = useSchoolContext();
  const [anchorEl, setAnchorEl] = useState(null);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previousBalance, setPreviousBalance] = useState(null);

  const handleMenuOpen = async (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
 
  const fetchUserNotifications = useCallback(async (userId) => {
    if (!userId) {
        console.log('No user ID');
        return;
    }

    console.log('Fetching notifications for user ID:', userId);
    setLoading(true);
    try {
        // Updated URL structure based on new endpoint for fetching notifications via association
        const response = await axios.get(`http://localhost:4000/Notifications/user/${userId}/all`);
        console.log('Fetched notifications data:', response.data);

        if (Array.isArray(response.data)) {
            console.log('Number of notifications:', response.data.length);
            setOptions(response.data.reverse()); // Reverse to show newest notifications first
        } else {
            console.error('Unexpected response format:', response.data);
        }

        setError(null);
    } catch (error) {
        setError(error.message);
        console.error('Error fetching notifications:', error);
    } finally {
        setLoading(false);
    }
}, []);

const createNotification = useCallback(async (userId, details, NotificationsKey) => {
    if (!currentUser || !currentUser.id) {
        console.log('No current user or user ID');
        return;
    }

    let savedNotifications = JSON.parse(localStorage.getItem('createdNotifications')) || [];
    let deletedNotifications = JSON.parse(localStorage.getItem('deletedNotifications')) || [];

    if (savedNotifications.includes(NotificationsKey) || deletedNotifications.includes(NotificationsKey)) {
        console.log('Notification key already exists or is deleted');
        return;
    }

    const notification = {
        userId: userId,
        details,
    };

    try {
        await axios.post('http://localhost:4000/Notifications/create', notification, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

       
        fetchUserNotifications(userId);

        savedNotifications.push(NotificationsKey);
        localStorage.setItem('createdNotifications', JSON.stringify(savedNotifications));
    } catch (error) {
        console.error('Error creating notification:', error);
    }
}, [fetchUserNotifications]);
  
  
const handleClearOptions = async () => {
  if (!currentUser || !currentUser.id || !currentSchool || !currentSchool.id) {
    console.log('No current user or school ID');
    return;
  }

  try {
    await axios.delete(`http://localhost:4000/Notifications/user/${currentUser.id}`);

    setOptions([]);

    let savedNotifications = JSON.parse(localStorage.getItem('createdNotifications')) || [];
    let deletedNotifications = JSON.parse(localStorage.getItem('deletedNotifications')) || [];

    savedNotifications.forEach(NotificationsKey => {
      deletedNotifications.push(NotificationsKey);
    });

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
    const response = await axios.post(`http://localhost:4000/associations/approve/${notificationId}`, {
     
    });
    const updateNotificationUrl = `http://localhost:4000/Notifications/accept/${notificationId}`;
        await axios.put(updateNotificationUrl, {
          details: 'You accepted the invitation',
          hasButtons: false
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

    const rejectNotificationUrl = `http://localhost:4000/Notifications/reject/${notificationId}`;
    const rejectResponse = await axios.put(rejectNotificationUrl);


    const deleteAssociation = `http://localhost:4000/associations/delete/${notificationId}`;
        await axios.delete(deleteAssociation);

        const deleteNotification = `http://localhost:4000/Notifications/${notificationId}`;
        await axios.delete(deleteNotification);   

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
  if (currentUser && currentUser.id) {
    fetchUserNotifications(currentUser.id);
  }
}, [currentUser, fetchUserNotifications]);

  useEffect(() => {
    if (currentDocument) {
      const balance = (currentDocument.cashAdvance || 0) - (currentDocument.budget || 0);
      const NotificationsKey = `balance-negative-${currentDocument.id || ''}`;
  
      const savedNotifications = JSON.parse(localStorage.getItem('createdNotifications')) || [];
  
      if (balance < 0 && previousBalance !== null && previousBalance >= 0 && !savedNotifications.includes(NotificationsKey)) {
        createNotification(
          currentUser.id,
          `Your balance has gone negative. Current balance: ₱${balance}`,
          NotificationsKey
        );
      }
  
      setPreviousBalance(balance);
    }
  }, [currentDocument, createNotification, currentUser, previousBalance]);
  
  useEffect(() => {
    if (jev && jev.length) {
      jev.forEach(row => {
        const exceededBudget = row.budget > 0 && row.amount > row.budget;
        const NotificationsKey = `budget-exceeded-${row.id || ''}`;
  
        const savedNotifications = JSON.parse(localStorage.getItem('createdNotifications')) || [];
  
        if (exceededBudget && !savedNotifications.includes(NotificationsKey)) {
          createNotification(
            currentUser.id,
            `As of ${month} ${year}, the expenditure for UACS ${row.uacsName} has surpassed the designated budget. Current Expenditure: ₱${row.amount}, Allocated Budget: ₱${row.budget}`,
            NotificationsKey
          );
        }
      });
    }
  }, [jev, createNotification, currentUser]);
  
  useEffect(() => {
    if (currentDocument && currentDocument.budgetLimit > 0) {
      const NotificationsKey = `budgetLimit-positive-${currentDocument.id || ''}`;
  
      const savedNotifications = JSON.parse(localStorage.getItem('createdNotifications')) || [];
  
      if (!savedNotifications.includes(NotificationsKey)) {
        createNotification(
          currentUser.id,
          `The budget limit for ${month} ${year} has been set to ₱${currentDocument.budgetLimit}.`,
          NotificationsKey
        );
      }
    }
  }, [currentDocument, createNotification, currentUser]);

  useEffect(() => {
    if (currentDocument && currentDocument.budgetLimit > 0 && currentDocument.budgetLimitExceeded) {
      const NotificationsKey = `budgetLimit-exceeded-${currentDocument.id || ''}`;
  
      const savedNotifications = JSON.parse(localStorage.getItem('createdNotifications')) || [];
  
      if (!savedNotifications.includes(NotificationsKey)) {
        createNotification(
          currentUser.id,
          `Attention: The budget limit for ${month} ${year} has been exceeded.`,
  
          NotificationsKey
        );
      }
    }
  }, [currentDocument, createNotification, currentUser, month, year]);

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

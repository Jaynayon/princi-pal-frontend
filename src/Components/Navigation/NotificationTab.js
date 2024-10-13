// React imports
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigationContext } from '../../Context/NavigationProvider';

// Material-UI imports
import { Box, IconButton, Badge, Menu, Typography, MenuItem, Button, CircularProgress, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const ITEM_HEIGHT = 48;

export default function NotificationTab() {
    const { currentUser } = useNavigationContext();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const fetchNotifications = useCallback(async (userId) => {
        if (!userId) {
            console.error("Error: userId is undefined.");
            setError('User ID is undefined. Unable to fetch notifications.');
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const token = JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"));
            const response = await axios.get(`${process.env.REACT_APP_API_URL_NOTIF}/user/${userId}/associations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(response.data || []); // Ensure data or fallback to empty array
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Failed to fetch notifications.');
        } finally {
            setLoading(false);
        }
    }, []);
    
    useEffect(() => {
        if (currentUser && currentUser.id) {
            fetchNotifications(currentUser.id);
    
            // Set up polling for notifications every 30 seconds
            const interval = setInterval(() => {
                fetchNotifications(currentUser.id);
            }, 30000); // 30 seconds interval
    
            // Clean up the interval on component unmount
            return () => clearInterval(interval);
        }
    }, [currentUser, fetchNotifications]);
    
    

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleAcceptInvitation = async (notificationId) => {
        try {
            if (!notificationId) {
                throw new Error("Invalid request: notificationId is required.");
            }
    
            const token = JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"));
            if (!token) {
                throw new Error("Authorization token is missing.");
            }
    
            // First, call the association approval endpoint
            await axios.post(
                `${process.env.REACT_APP_API_URL_ASSOC}/approve/${notificationId}`,
                {},
                {
                    headers: {
                       'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                    }
                }
            );
    
            // Then, update the notification to reflect the acceptance
            await axios.put(
                `${process.env.REACT_APP_API_URL_NOTIF}/accept/${notificationId}`,
                {
                    details: 'You accepted the invitation',
                    hasButtons: false
                },
                {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                    }
                }
            );
    
            // Refresh notifications after accepting
            fetchNotifications();
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
    
    const handleRejectInvitation = async (notificationId) => {
        try {
            if (!notificationId) {
                throw new Error("Invalid request: notificationId is required.");
            }
    
            // Retrieve the token (update the key if needed)
            const token = JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"));
            if (!token) {
                throw new Error("Authentication token is missing. Please log in.");
            }
    
            // Endpoint for rejecting the invitation
            const rejectInvitationUrl = `${process.env.REACT_APP_API_URL_NOTIF}/reject/${notificationId}`;
    
            // Send a PUT request with the Authorization header
            const response = await axios.put(rejectInvitationUrl, null, {
                headers: {
                   'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                }
            });
            fetchNotifications();
            console.log('Invitation rejected and associated data updated successfully:', response.data);
        } catch (error) {
            if (error.response) {
                console.error('Server Error:', error.response.data);
            } else if (error.request) {
                console.error('No Response from the server:', error.request);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    const handleClearNotifications = async () => {
        try {
            // Send a DELETE request to remove all notifications for the current user
            await axios.delete(`${process.env.REACT_APP_API_URL_NOTIF}/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                }
            });

            // Clear notifications in the state after successful deletion
            setNotifications([]);
            localStorage.removeItem("NOTIFICATIONS");
            console.log('All notifications cleared successfully.');
        } catch (error) {
            if (error.response) {
                console.error('Server Error:', error.response.data);
            } else if (error.request) {
                console.error('No Response from the server:', error.request);
            } else {
                console.error('Error:', error.message);
            }
        }
    };
    
    return (
        <Box>
            <IconButton color="inherit" onClick={handleMenuOpen}>
                <Badge badgeContent={notifications.length} color="secondary">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Menu
                id="notification-menu"
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
                    <IconButton sx={{ marginLeft: '210px' }} onClick={handleClearNotifications}>
                        <DeleteOutlineIcon />
                    </IconButton>
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
                {Array.isArray(notifications) && notifications.length === 0 && !loading && (
                    <Typography sx={{ padding: '16px' }}>No notifications available.</Typography>
                )}
                {Array.isArray(notifications) && notifications.map((notification, index) => (
                    <div key={notification.id}>
                        <MenuItem onClick={handleMenuClose} sx={{ whiteSpace: 'normal', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <CircleNotificationsIcon sx={{ marginRight: '8px' }} />
                                <Typography variant="body2">{notification.details}</Typography>
                            </Box>
                            {notification.hasButtons && (
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                    <Button
                                        size="small"
                                        onClick={() => handleAcceptInvitation(notification.id)}
                                        sx={{ marginRight: '8px' }}
                                    >
                                        Accept
                                    </Button>
                                    <Button
                                        size="small"
                                        onClick={() => handleRejectInvitation(notification.id)}
                                        sx={{ marginRight: '8px' }}
                                    >
                                        Reject
                                    </Button>
                                </Box>
                            )}
                        </MenuItem>
                        {index !== notifications.length - 1 && <Divider />}
                    </div>
                ))}
            </Menu>
        </Box>
    );
}

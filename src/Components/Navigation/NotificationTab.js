// React imports
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigationContext } from '../../Context/NavigationProvider';
import { useAppContext } from '../../Context/AppProvider';

// Material-UI imports
import { Box, IconButton, Badge, Menu, Typography, MenuItem, Button, Divider } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

const ITEM_HEIGHT = 48;

export default function NotificationTab() {
    const { fetchCurrentUser } = useAppContext();
    const { currentUser } = useNavigationContext();
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const fetchNotifications = useCallback(async () => {
        if (!currentUser || !currentUser.id) {
            console.error("Error: userId is undefined.");
            setError('User ID is undefined. Unable to fetch notifications.');
            return;
        }
        setError(null);
        try {
            const token = JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"));
            const response = await axios.get(`${process.env.REACT_APP_API_URL_NOTIF}/user/${currentUser.id}/associations`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications(response.data || []); // Ensure data or fallback to empty array
        } catch (err) {
            console.error('Error fetching notifications:', err);
            setError('Failed to fetch notifications.');
        }
    }, [currentUser]);

    useEffect(() => {
        let timeoutId;

        const updateNotificationData = () => {
            // Fetch data
            fetchNotifications().finally(() => {
                // Set the next timeout after the fetch is complete
                timeoutId = setTimeout(updateNotificationData, 3000); // 3 seconds
            });
        };

        // Check if user is not null and has an ID
        if (currentUser && currentUser.id) {
            updateNotificationData();
        }

        // Cleanup function to clear the timeout
        return () => clearTimeout(timeoutId);
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
        } finally {
            fetchCurrentUser(); // Reload user to render new school/s
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
            await axios.put(rejectInvitationUrl, null, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                }
            });
            fetchNotifications();
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
            // Filter out notifications without `hasButtons` or with `hasButtons` set to false
            const notificationsToKeep = notifications.filter(
                (notif) => notif.hasButtons === true
            );

            // Send a DELETE request to remove all notifications for the current user
            await axios.delete(`${process.env.REACT_APP_API_URL_NOTIF}/${currentUser.id}`, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                }
            });

            // Update the state with remaining notifications
            setNotifications(notificationsToKeep);

            localStorage.removeItem("NOTIFICATIONS");
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
                        // maxHeight: ITEM_HEIGHT * 13,
                        maxHeight: '70vh', // Sets the max-height to 70% of the viewport height
                        width: '42ch',
                        position: 'fixed',
                    },
                }}
            >
                <Typography
                    variant="subtitle1"
                    sx={{
                        paddingLeft: '20px',
                        paddingRight: '10px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        justifyContent: 'space-between',
                        display: 'flex',
                    }}
                >
                    Notifications
                    <IconButton onClick={handleClearNotifications}>
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
                {notifications.length === 0 ? (
                    <Typography sx={{ padding: '16px' }}>No notifications available.</Typography>
                ) : (
                    notifications.map((notification, index) => (
                        <div key={notification.id}>
                            <MenuItem
                                onClick={handleMenuClose}
                                sx={{
                                    whiteSpace: 'normal',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                }}
                            >
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
                    ))
                )}
            </Menu>
        </Box>
    );
}

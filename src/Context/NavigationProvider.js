import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from './AppProvider';

const NavigationContext = createContext();

export const useNavigationContext = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
    const { currentUser } = useAppContext();

    const list = ['Dashboard', 'Schools', 'People', 'Settings', 'Logout'];
    const [selected, setSelected] = useState('Dashboard');
    const [open, setOpen] = useState(true);
    const [openSub, setOpenSub] = useState(false);
    const [navStyle, setNavStyle] = React.useState('light'); // Initial theme
    const [mobileMode, setMobileMode] = useState(false); // State to track position
    const [currentSchool, setCurrentSchool] = useState(null);
    const prevOpenRef = useRef(false);
    const location = useLocation();
    const navigate = useNavigate();

    const [options, setOptions] = useState([]);

    const fetchUserNotifications = useCallback(async (userId) => {
        if (!userId) {
            console.log('No user ID provided');
            return;
        }
    
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL_NOTIF}/user/${userId}/all`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`  // Assuming a Bearer token is used for authentication
                }
            });
            if (Array.isArray(response.data)) {
                const sortedNotifications = response.data
                    .filter(notification => notification.details !== "Balance is negative!")
                    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Correcting sorting order to newest first
                setOptions(sortedNotifications);
            } else {
                console.error('Unexpected response format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    }, []);
    

    const toggleDrawer = () => {
        setOpen(prevOpen => {
            prevOpenRef.current = prevOpen;
            return !prevOpen;
        });
    };

    const updateMobileMode = () => {
        const { innerWidth } = window;
        if (innerWidth < 600) {
            setMobileMode(true);
            setOpen(false)
        } else {
            setMobileMode(false);
        }
    };

    const createUser = async (fname, mname, lname, username, email, password, position) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_USER}/create`, {
                fname,
                mname,
                lname,
                username,
                email,
                password,
                position
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response) {
                console.log(response.data)
            }

            return response.status === 201;
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.response && error.response.status === 409) {
                throw new Error("User with the same email or username already exists.");
            } else {
                throw new Error("Registration failed. Please try again later.");
            }
        }
    };

    const validateUsernameEmail = async (email) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_USER}/exists`, {
                emailOrUsername: email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response) {
                console.log(response.data);
            }

            return response.data
        } catch (error) {
            console.error('Error validating username/email:', error);
            throw new Error("Validation failed. Please try again later.");
        }
    };

    const updateUserPassword = async (userId, newPassword) => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL_USER}/${userId}/password`, {
                newPassword,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                }
            });

            return response.status === 200;
        } catch (error) {
            console.error('Error updating password:', error);
            return false;
        }
    };

    const updateUserAvatar = async (userId, avatar) => {
        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL_USER}/${userId}/avatar`, {
                avatar,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                }
            });

            return response.status === 200;
        } catch (error) {
            console.error('Error updating password:', error);
            return false;
        }
    };

    // RegEx that transform route text to school name
    function transformText(input = "") {
        if (typeof input !== 'string') {
            return ''; // Return an empty string or handle it according to your needs
        }
        return input
            .replace(/-/g, ' ')   // Replace all hyphens with spaces
            .replace(/\//g, '')   // Remove all forward slashes
            .toUpperCase();       // Convert all letters to uppercase
    }

    useEffect(() => {
        // Extract the root route if it's the /schools route
        const extractRoute = location.pathname.split('/').slice(0, 2).join('/');

        // if current user is not null or undefined, or not in /schools, set default school
        if (currentUser && !currentSchool && (extractRoute !== "/schools")) {
            setCurrentSchool(currentUser.schools[0]);
        }

        // Define a mapping between paths and the desired local storage values
        const pathToLocalStorageValue = {
            "/": "Dashboard",
            '/dashboard': 'Dashboard',
            '/people': 'People',
            '/settings': 'Settings',
        };

        if (currentUser && currentUser.position !== "Super administrator") {
            // Get the local storage value based on the current path
            let localStorageValue = pathToLocalStorageValue[location.pathname];

            if (!localStorageValue) {
                if (extractRoute === "/schools") {
                    // Extract the school name
                    const schoolNameRoute = location.pathname.split('/')[2];
                    const schoolName = transformText(schoolNameRoute); // Set school name as local storage value

                    // Check if schoolName is present in the name property of any object in currentUser.schools
                    const isSchoolValid = currentUser.schools.some(school => school?.name === schoolName);
                    const matchedSchool = currentUser.schools.find(school => school?.name === schoolName)

                    // Set localStorageValue based on the validity of schoolName
                    localStorageValue = isSchoolValid ? schoolName : "Dashboard";

                    // School url is invalid/does not exist with user
                    if (!isSchoolValid) { navigate('/dashboard'); }

                    // Fetch selected school data by setting the current school state
                    if (matchedSchool) { setCurrentSchool(matchedSchool); }
                } else {
                    // If user is logged in, redirect to inner modules
                    navigate('/');
                }
            }
            // Set the state with the current local storage value
            if (localStorageValue !== null || localStorageValue !== undefined) {
                setSelected(localStorageValue)
            } else {
                window.localStorage.setItem("LOCAL_STORAGE_SELECTED", JSON.stringify("Dashboard"));
                setSelected("Dashboard")
            }
        }
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
    }, [currentUser, currentSchool, location, navigate]);

    useEffect(() => {
        window.localStorage.setItem("LOCAL_STORAGE_SELECTED", JSON.stringify(selected));
    }, [selected]);

    useEffect(() => {
        if (currentUser?.id) {
            const intervalId = setInterval(() => {
                fetchUserNotifications(currentUser.id);
            }, 5000); // Fetch every 10 seconds

            return () => clearInterval(intervalId); // Clean up on component unmount
        }
    }, [currentUser, fetchUserNotifications]);

    return (
        <NavigationContext.Provider value={{
            list,
            location,
            mobileMode,
            open, toggleDrawer,
            openSub, setOpenSub,
            prevOpen: prevOpenRef.current,
            selected, setSelected,
            navStyle, setNavStyle,
            currentUser, setCurrentSchool,
            currentSchool,
            createUser,
            validateUsernameEmail,
            updateUserPassword,
            updateUserAvatar,
            options,
            setOptions,
            fetchUserNotifications,
            // header
        }}>
            {children}
        </NavigationContext.Provider>
    );
};

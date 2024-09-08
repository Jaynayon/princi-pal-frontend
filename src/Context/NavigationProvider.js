import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import RestService from "../Services/RestService"
import axios from 'axios';

const NavigationContext = createContext();

export const useNavigationContext = () => useContext(NavigationContext);

//Function that allows us to accept credentials
const instance = axios.create({
    baseURL: 'http://localhost:4000', // Set your backend URL
    withCredentials: true, // Enable sending cookies with cross-origin requests
});

export const NavigationProvider = ({ children }) => {
    const list = ['Dashboard', 'Schools', 'People', 'Settings', 'Logout'];
    const [selected, setSelected] = useState('Dashboard');
    const [open, setOpen] = useState(true);
    const [openSub, setOpenSub] = useState(false);
    const [navStyle, setNavStyle] = React.useState('light'); // Initial theme
    const [mobileMode, setMobileMode] = useState(false); // State to track position
    const [currentUser, setCurrentUser] = useState(null);
    const [currentSchool, setCurrentSchool] = useState(null);
    const [userId, setUserId] = useState(null);
    const prevOpenRef = useRef(false);
    const location = useLocation();
    const navigate = useNavigate();

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

    const authenticateUser = async (email, password) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_AUTH}/login`, {
                emailOrUsername: email,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response) {
                console.log(response.data)
            }

            return response.data;
        } catch (error) {
            console.error('Error authenticating user:', error);
            throw new Error("Authentication failed. Please try again later.");
        }
    };

    const createUser = async (fname, mname, lname, username, email, password, position) => {
        try {
            const response = await instance.post(`${process.env.REACT_APP_API_URL_USER}/create`, {
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
            })

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
            const response = await instance.post(`${process.env.REACT_APP_API_URL_USER}/exists`, {
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
            const response = await instance.patch(`${process.env.REACT_APP_API_URL_USER}/${userId}/password`, {
                newPassword,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response.status === 200;
        } catch (error) {
            console.error('Error updating password:', error);
            return false;
        }
    };

    // Fetch current user details
    const fetchUser = useCallback(async () => {
        // Extract the root route if it's the /schools route
        const extractRoute = location.pathname.split('/').slice(0, 2).join('/');
        try {
            const jwtCookie = document.cookie
                .split('; ')
                .find(row => row.startsWith('jwt='));

            if (jwtCookie) {
                const token = jwtCookie.split('=')[1];
                console.log('JWT Token Provider:', token);

                // Call RestService to validate the token
                const data = await RestService.validateToken(token);

                if (data) { //data.decodedToken
                    setUserId(data)
                    if (!currentUser) {
                        const user = await RestService.getUserById(data.id);
                        if (currentUser !== user) {
                            setCurrentUser(user);
                        }
                    }
                }
                // Note: A default school will be presented upon load if the user is not in /schools route
                // should the user be in /schools, the currentSchool is set on their school of choice.
                if (currentUser && (extractRoute !== "/schools")) { // if current user is not null or undefined, or in /schools, set school
                    setCurrentSchool(currentUser.schools[0]);
                }
                console.log(currentUser)
                // Handle response as needed
            } else {
                //setIsLoggedIn(false)
                console.log('JWT Token not found in cookies.');
            }
        } catch (error) {
            console.error('Error validating token:', error);
        }
    }, [currentUser, location]);

    useEffect(() => {
        if (!currentUser) {
            fetchUser();
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
    }, [currentUser, location, fetchUser]); // Run effect only on mount and unmount

    useEffect(() => {
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
                // Extract the root route if it's the /schools route
                const extractRoute = location.pathname.split('/').slice(0, 2).join('/');
                // Extract the school name
                const schoolNameRoute = location.pathname.split('/')[2];

                if (extractRoute === "/schools") {
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

                    const schoolName = transformText(schoolNameRoute); // Set school name as local storage value

                    // Check if schoolName is present in the name property of any object in currentUser.schools
                    const isSchoolValid = currentUser.schools.some(school => school?.name === schoolName);

                    const matchedSchool = currentUser.schools.find(school => school?.name === schoolName)

                    // Set localStorageValue based on the validity of schoolName
                    localStorageValue = isSchoolValid ? schoolName : "Dashboard";

                    // School url is invalid/does not exist with user
                    if (!isSchoolValid) {
                        navigate('/dashboard');
                    }

                    // Fetch selected school data by setting the current school state
                    if (matchedSchool) {
                        setCurrentSchool(matchedSchool);
                    }
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
    }, [currentUser, location, navigate]);

    useEffect(() => {
        window.localStorage.setItem("LOCAL_STORAGE_SELECTED", JSON.stringify(selected));
    }, [selected]);

    return (
        <NavigationContext.Provider value={{
            open, toggleDrawer, prevOpen: prevOpenRef.current, list, selected, setSelected,
            navStyle, setNavStyle, mobileMode, userId, currentUser, setCurrentSchool, currentSchool,
            openSub, setOpenSub, location, authenticateUser, createUser, validateUsernameEmail,
            updateUserPassword
        }}>
            {children}
        </NavigationContext.Provider>
    );
};

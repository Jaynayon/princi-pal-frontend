import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import RestService from "../Services/RestService"

const NavigationContext = createContext();

export const useNavigationContext = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
    const list = ['Dashboard', 'Schools', 'People', 'Settings', 'Logout'];
    const [selected, setSelected] = useState('Dashboard');
    const [open, setOpen] = useState(true);
    const [openSub, setOpenSub] = useState(false);
    const [navStyle, setNavStyle] = React.useState('light'); // Initial theme
    const [mobileMode, setMobileMode] = useState(false); // State to track position
    const [currentUser, setCurrentUser] = useState(null);
    const [currentSchool, setCurrentSchool] = useState(null);
    const [userId, setUserId] = useState(null)
    const prevOpenRef = useRef(false);
    const location = useLocation();

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

    const fetchUser = useCallback(async () => {
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
                        setCurrentUser(user);
                    }
                }
                if (currentUser) { // if current user is not null or undefined, set school
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
    }, [currentUser]);



    // useEffect(() => {
    //     // Your code to run when URL changes
    //     console.log('URL changed:', location.pathname);
    // }, [location]);

    useEffect(() => {
        if (currentUser && currentUser.position !== "Super administrator") {
            const data = JSON.parse(window.localStorage.getItem("LOCAL_STORAGE_SELECTED"));
            console.log(data)
            console.log('URL changed:', location.pathname);
            const path = window.location.pathname;

            // Define a mapping between paths and the desired local storage values
            const pathToLocalStorageValue = {
                '/dashboard': 'Dashboard',
                '/people': 'People',
                '/settings': 'Settings',
            };

            // RegEx that transform route text to school name
            function transformText(input) {
                return input
                    .split('-') // Split the string at the hyphen
                    .map((word, index) => index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.toUpperCase())
                    .join(' '); // Join the parts with a space
            }

            // Get the local storage value based on the current path
            let localStorageValue = pathToLocalStorageValue[path];

            if (!localStorageValue) {
                // Extract the route if it's the /schools route
                const extractRoute = location.pathname.split('/').slice(0, 2).join('/');
                // Extract the school name
                const schoolName = location.pathname.split('/')[2];

                if (extractRoute === "/schools") {
                    localStorageValue = transformText(schoolName); // Set school name as local storage value
                } else {
                    localStorageValue = "Dashboard"
                }
            }

            // Update local storage
            if (localStorageValue !== data) {
                window.localStorage.setItem("LOCAL_STORAGE_SELECTED", JSON.stringify(localStorageValue));
            }

            // Set the state with the current local storage value
            data !== null || data !== undefined ? setSelected(localStorageValue) : setSelected("Dashboard")
        }
    }, [currentUser, location])

    useEffect(() => {
        window.localStorage.setItem("LOCAL_STORAGE_SELECTED", JSON.stringify(selected));
    }, [selected])

    useEffect(() => {
        // Fetch current user details
        fetchUser();

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
    }, [currentUser, fetchUser]); // Run effect only on mount and unmount

    return (
        <NavigationContext.Provider value={{
            open, toggleDrawer, prevOpen: prevOpenRef.current, list, selected, setSelected,
            navStyle, setNavStyle, mobileMode, userId, currentUser, setCurrentSchool, currentSchool,
            openSub, setOpenSub
        }}>
            {children}
        </NavigationContext.Provider>
    );
};

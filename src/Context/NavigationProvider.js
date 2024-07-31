import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
                        setCurrentUser(user);
                    }
                }
                // Note: A default school will be presented upon load if the user is not in /schools route
                // should the user be in /schools, the currentSchool is set on their school of choice.
                if (currentUser && extractRoute !== "/schools") { // if current user is not null or undefined, or in /schools, set school
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
    }, [currentUser, location.pathname]);

    useEffect(() => {
        if (currentUser && currentUser.position !== "Super administrator") {
            //const localStorageData = window.localStorage.getItem("LOCAL_STORAGE_SELECTED");
            //const data = "localStorageData ? JSON.parse(localStorageData) : null;"

            // RegEx that transform route text to school name
            function transformText(input) {
                return input
                    .split('-') // Split the string at the hyphen
                    .map((word, index) => index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word.toUpperCase())
                    .join(' '); // Join the parts with a space
            }

            // Define a mapping between paths and the desired local storage values
            const pathToLocalStorageValue = {
                '/dashboard': 'Dashboard',
                '/people': 'People',
                '/settings': 'Settings',
            };

            // Get the local storage value based on the current path
            let localStorageValue = pathToLocalStorageValue[location.pathname];

            if (!localStorageValue) {
                // Extract the root route if it's the /schools route
                const extractRoute = location.pathname.split('/').slice(0, 2).join('/');
                // Extract the school name
                const schoolNameRoute = location.pathname.split('/')[2];

                if (extractRoute === "/schools") {
                    const schoolName = transformText(schoolNameRoute); // Set school name as local storage value

                    // Check if schoolName is present in the name property of any object in currentUser.schools
                    const isSchoolValid = currentUser.schools.some(school => school.name === schoolName);

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

            // // Update local storage
            // if (localStorageValue !== data) {
            //     window.localStorage.setItem("LOCAL_STORAGE_SELECTED", JSON.stringify(localStorageValue));
            // }

            // Set the state with the current local storage value
            localStorageValue !== null || localStorageValue !== undefined ? setSelected(localStorageValue) : setSelected("Dashboard")
        }
    }, [currentUser, location, navigate])

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
            openSub, setOpenSub, location
        }}>
            {children}
        </NavigationContext.Provider>
    );
};

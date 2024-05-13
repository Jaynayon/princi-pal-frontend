import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
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

    console.log("Navigation Provider render");
    console.log(selected)
    console.log(openSub)

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
                        setCurrentUser({
                            ...user,
                            schools: [{
                                id: "6634e7fc43d8096920d765ff",
                                name: 'Jaclupan ES'
                            }, {
                                id: "66354cb59de52335e7ad78ab",
                                name: 'Talisay ES'
                            }
                            ]
                        })

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

    useEffect(() => {
        console.log("Navigation Provider useEffect render");


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
    }, [currentUser]); // Run effect only on mount and unmount

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

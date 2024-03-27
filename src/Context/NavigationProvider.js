import React, { createContext, useState, useRef, useContext } from 'react';

const NavigationContext = createContext();

export const useNavigationContext = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
    const [open, setOpen] = useState(true);
    const prevOpenRef = useRef(open);
    const toggleDrawer = () => {
        setOpen(prevOpen => {
            prevOpenRef.current = prevOpen;
            return !prevOpen;
        });
    };

    return (
        <NavigationContext.Provider value={{ open, toggleDrawer, prevOpen: prevOpenRef.current }}>
            {children}
        </NavigationContext.Provider>
    );
};

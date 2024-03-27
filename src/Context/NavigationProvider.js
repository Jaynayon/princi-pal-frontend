import React, { createContext, useState, useContext } from 'react';

const NavigationContext = createContext();

export const useNavigationContext = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
    const [open, setOpen] = useState(true);
    const toggleDrawer = () => {
        setOpen(!open);
    };

    return (
        <NavigationContext.Provider value={{ open, toggleDrawer }}>
            {children}
        </NavigationContext.Provider>
    );
};

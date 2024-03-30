import React, { createContext, useState, useRef, useContext } from 'react';

const NavigationContext = createContext();

export const useNavigationContext = () => useContext(NavigationContext);

export const NavigationProvider = ({ children }) => {
    const list = ['Dashboard', 'Schools', 'People', 'Settings', 'Logout'];
    const [selected, setSelected] = useState('Dashboard');
    const [open, setOpen] = useState(true);
    const prevOpenRef = useRef(false);

    const toggleDrawer = () => {
        setOpen(prevOpen => {
            prevOpenRef.current = prevOpen;
            return !prevOpen;
        });
    };

    return (
        <NavigationContext.Provider value={{
            open, toggleDrawer, prevOpen: prevOpenRef.current, list, selected, setSelected
        }}>
            {children}
        </NavigationContext.Provider>
    );
};

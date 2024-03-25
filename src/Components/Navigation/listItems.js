import React, { useState } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Link } from 'react-router-dom';

const styles = {
    icon: {
        color: 'white',
        fontSize: '19px',
        width: '50%',
    },
    typography: {
        fontFamily: 'Mulish-Regular',
        color: 'white'
    },
    primary: {
        fontFamily: 'Mulish-Bold'
    },
    button: {
        "&.Mui-selected": {
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Change to desired highlight color
            borderRadius: '10px',
        },
        "& .MuiTouchRipple-root": {
            color: 'white'
        },
        marginRight: '5px',
        marginLeft: '5px',
        paddingTop: '5px',
        marginTop: '5px',
    }
}

function iterateItems() {
    const list = ['dashboard', 'schools', 'people', 'settings', 'testing'];

    return list.map((item, index) => (
        <ListItemButton key={index} component={Link} to={`/${item}`} selected={true}
            sx={styles.button}>
            <ListItemIcon sx={{ width: 'auto', minWidth: '40px' }}>
                {index === 0 ? <DashboardIcon sx={styles.icon} /> :
                    index === 1 ? <SchoolIcon sx={styles.icon} /> :
                        index === 2 ? <PeopleIcon sx={styles.icon} /> :
                            index === 3 ? <SettingsIcon sx={styles.icon} /> :
                                <BarChartIcon sx={styles.icon} />}
            </ListItemIcon>
            <ListItemText
                primary={item.charAt(0).toUpperCase() + item.slice(1)}
                primaryTypographyProps={styles.typography}
            />


        </ListItemButton>
    ));
}
export const mainListItems = (
    <React.Fragment>
        {iterateItems()}
    </React.Fragment>
);

export const secondaryListItems = (
    <React.Fragment>
        <ListItemButton sx={styles.button} selected={true}>
            <ListItemIcon sx={{ minWidth: '40px' }}>
                <LogoutIcon sx={styles.icon} />
            </ListItemIcon>
            <ListItemText primary="Logout"
                primaryTypographyProps={styles.typography} />
        </ListItemButton>
    </React.Fragment>
);

export const profileTab = ({ name, email }) => {
    const adjustSecondaryTypography = () => {
        // Define a threshold length for email after which font size will be reduced
        const thresholdLength = 15;

        // Check if email length exceeds the threshold
        if (email.length > thresholdLength) {
            return { ...styles.typography, fontSize: 10 }; // Adjust font size if email is too long
        }

        return { ...styles.typography, fontSize: 12 }; // Use default font size
    };

    return (
        <React.Fragment>
            <ListItemButton sx={{ marginLeft: '-8px' }}>
                <ListItemIcon>
                    <AccountCircleIcon sx={{ fontSize: 40 }} />
                </ListItemIcon>
                <ListItemText
                    primary={name}
                    secondary={email}
                    primaryTypographyProps={{ fontFamily: 'Mulish-Bold', color: 'white' }}
                    secondaryTypographyProps={adjustSecondaryTypography()} // Call the adjustSecondaryTypography function
                />
            </ListItemButton>
        </React.Fragment>
    );
};

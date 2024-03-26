import React, { useState, useEffect } from 'react';
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
import Divider from '@mui/material/Divider';
import { Link } from 'react-router-dom';


export function DisplayItems({ secondary }) {
    const list = ['dashboard', 'schools', 'people', 'settings', 'testing', 'logout'];
    const [selected, setSelected] = useState('dashboard');

    useEffect(() => {
        console.log(selected);
    }, [selected]); // useEffect will trigger whenever selected state changes

    function displayPrimary() {
        return list.map((item, index) => (
            <React.Fragment>
                {index > 4 ?
                    <Divider sx={styles.divider} />
                    : <></>}
                <ListItemButton key={index}
                    component={Link}
                    to={`/${item}`}
                    selected={selected === item}
                    value={item}
                    onClick={() => { setSelected(item) }}
                    sx={styles.button}
                >
                    <ListItemIcon sx={{ width: 'auto', minWidth: '40px' }}>
                        {index === 0 ? <DashboardIcon sx={styles.icon} /> :
                            index === 1 ? <SchoolIcon sx={styles.icon} /> :
                                index === 2 ? <PeopleIcon sx={styles.icon} /> :
                                    index === 3 ? <SettingsIcon sx={styles.icon} /> :
                                        index === 4 ? <BarChartIcon sx={styles.icon} /> :
                                            <LogoutIcon sx={styles.icon} />}
                    </ListItemIcon>
                    <ListItemText
                        primary={item.charAt(0).toUpperCase() + item.slice(1)}
                        primaryTypographyProps={styles.typography}
                    />
                </ListItemButton>
            </React.Fragment>
        ));
    }

    return (
        <React.Fragment>
            {displayPrimary()}
        </React.Fragment>
    )
}

export const ProfileTab = ({ user }) => {
    const adjustSecondaryTypography = () => {
        // Define a threshold length for email after which font size will be reduced
        const thresholdLength = 10;

        // Check if email length exceeds the threshold
        if (user.email.length > thresholdLength) {
            return { ...styles.typography, fontSize: 10 }; // Adjust font size if email is too long
        }

        return { ...styles.typography, fontSize: 12 }; // Use default font size
    };

    return (
        <React.Fragment>
            <ListItemButton sx={{
                "&.Mui-selected": {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Change to desired highlight color
                    borderRadius: '10px',
                },
                "& .MuiTouchRipple-root": {
                    color: 'white'
                }, padding: '5px'
            }} selected={true}>
                <ListItemIcon sx={{ minWidth: '40px', width: '50px' }}>
                    <AccountCircleIcon sx={{
                        color: 'white',
                        fontSize: '35px',
                        width: '100%',
                    }} />
                </ListItemIcon>
                <ListItemText
                    primary={user.name}
                    secondary={user.email}
                    primaryTypographyProps={{ fontFamily: 'Mulish-Bold', color: 'white' }}
                    secondaryTypographyProps={adjustSecondaryTypography()} // Call the adjustSecondaryTypography function
                />
            </ListItemButton>
        </React.Fragment>
    );
};

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
    divider: {
        my: 1, bgcolor: 'white', marginRight: '15px', marginLeft: '15px'
    },
    button: {
        "&.Mui-selected": {
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Change to desired highlight color
            borderRadius: '10px',
        },
        "& .MuiTouchRipple-root": {
            color: 'white'
        },
        /*'&:hover, &.Mui-focusVisible': {
            backgroundColor: 'white'
        },*/
        marginRight: '5px',
        marginLeft: '5px',
        paddingTop: '5px',
        marginTop: '5px',
    }
}
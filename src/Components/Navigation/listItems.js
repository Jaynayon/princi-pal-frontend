// React imports
import React, { useState, useEffect } from 'react';

// Material-UI imports
import { Link } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// Material-UI icons imports
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

// Custom component import
import DisplaySchools from './DisplaySchools';


export function DisplayItems() {
    const list = ['dashboard', 'schools', 'people', 'settings', 'logout'];
    const [selected, setSelected] = useState('dashboard');

    useEffect(() => {
        console.log(selected);
    }, [selected]);

    return (
        list.map((item, index) => (
            <React.Fragment>
                {index > 3 && <Divider sx={styles.divider.horizontal} /> /*Render divider after the Testing tab*/}
                {
                    index === 1 ? <DisplaySchools selected={selected} setSelected={setSelected} /> :
                        <ListItemButton
                            key={index}
                            component={Link}
                            to={index < 4 ? `/${item}` : '/'} //Logout route has not yet been implemented
                            selected={selected === item}
                            value={item}
                            onClick={() => { setSelected(item) }}
                            sx={styles.button}
                        >
                            <ListItemIcon
                                sx={{
                                    width: 'auto',
                                    minWidth: '40px'
                                }}
                            >
                                {index === 0 ? <DashboardIcon sx={styles.icon} /> :
                                    index === 2 ? <PeopleIcon sx={styles.icon} /> :
                                        index === 3 ? <SettingsIcon sx={styles.icon} /> :
                                            index === 4 ? <LogoutIcon sx={styles.icon} /> :
                                                null}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.charAt(0).toUpperCase() + item.slice(1)}
                                primaryTypographyProps={styles.typography}
                            />
                        </ListItemButton>
                }
            </React.Fragment>
        ))
    )
}

export const ProfileTab = ({ user }) => {
    const [selected, setSelected] = useState(false);
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
            <ListItemButton
                sx={{
                    ...styles.button,
                    padding: '5px'
                }}
                selected={selected}
                onClick={() => setSelected(!selected)}>
                <ListItemIcon
                    sx={{
                        minWidth: '40px',
                        width: '50px'
                    }}
                >
                    <AccountCircleIcon
                        sx={{
                            color: 'white',
                            fontSize: '35px',
                            width: '100%',
                        }}
                    />
                </ListItemIcon>
                <ListItemText
                    primary={user.name}
                    secondary={user.email}
                    primaryTypographyProps={{ fontWeight: 'bold', color: 'white' }}
                    secondaryTypographyProps={adjustSecondaryTypography()} // Call the adjustSecondaryTypography function
                />
            </ListItemButton>
        </React.Fragment>
    );
};

export function VerticalLine({ width, color = 'black' }) {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                width: width
            }}
        >
            <div
                style={{
                    height: '100%',
                    width: '1px',
                    backgroundColor: color,
                    margin: '0 auto'
                }} />
        </div>
    );
}

export const styles = {
    icon: {
        color: 'white',
        fontSize: '19px',
    },
    typography: {
        school: {
            fontWeight: 'bold',
            color: 'white'
        },
        color: 'white'
    },
    divider: {
        horizontal: {
            my: 1,
            bgcolor: 'white',
            marginRight: '15px',
            marginLeft: '15px'
        }
    },
    button: {
        "&.Mui-selected": {
            backgroundColor: 'rgba(255, 255, 255, 0.10)', // Change to desired highlight color
            borderRadius: '10px',
        },
        "& .MuiTouchRipple-root": {
            color: 'white'
        },
        '&:hover, &.Mui-focusVisible': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
        },
    }
}
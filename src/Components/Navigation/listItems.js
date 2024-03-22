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
        //backgroundColor: 'white'
    },
    typography: {
        fontFamily: 'Mulish-Regular',
        color: 'white'
    },
    primary: {
        fontFamily: 'Mulish-Bold'
    }
}

function iterateItems() {
    const list = ['dashboard', 'schools', 'people', 'settings', 'testing'];

    return list.map((item, index) => (
        <ListItemButton key={index} component={Link} to={`/${item}`}
            sx={{
                /*"&.Mui-selected": {
                    backgroundColor: 'green', // Change to desired highlight color
                },*/
                "& .MuiTouchRipple-root": {
                    color: 'white'
                },
            }}>
            <ListItemIcon>
                {index === 0 ? <DashboardIcon sx={styles.icon} /> :
                    index === 1 ? <SchoolIcon sx={styles.icon} /> :
                        index === 2 ? <PeopleIcon sx={styles.icon} /> :
                            index === 3 ? <SettingsIcon sx={styles.icon} /> :
                                <BarChartIcon sx={styles.icon} />}
            </ListItemIcon>
            <ListItemText
                //sx={{ backgroundColor: 'green' }}
                primary={item.charAt(0).toUpperCase() + item.slice(1)} // Capitalize first letter
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
        <ListItemButton>
            <ListItemIcon>
                <LogoutIcon sx={styles.icon} />
            </ListItemIcon>
            <ListItemText primary="Logout"
                primaryTypographyProps={styles.typography} />
        </ListItemButton>
    </React.Fragment>
);

export const profileTab = (
    <React.Fragment>
        <ListItemButton sx={{ marginLeft: '-8px' }}>
            <ListItemIcon>
                <AccountCircleIcon sx={{ fontSize: 40 }} />
            </ListItemIcon>
            <ListItemText primary="Jay Nayon" secondary='jay.nayonjr@cit'
                primaryTypographyProps={{ fontFamily: 'Mulish-Bold', color: 'white' }}
                secondaryTypographyProps={{ ...styles.typography, fontSize: 12 }} />
        </ListItemButton>
    </React.Fragment>
)

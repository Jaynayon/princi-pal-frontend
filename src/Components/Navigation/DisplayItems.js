import React, { memo, useState } from 'react';

// Material-UI imports
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// Material-UI icons imports
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';

// Custom component import
import DisplaySchools from './DisplaySchools';
import LogoutDialog from '../Modal/LogoutDialog';

const DisplayItems = memo(({ list, selected, setSelected }) => {
    const theme = useTheme();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false); // State to manage logout dialog

    console.log("display items rendered");

    const styles = {
        icon: {
            fontSize: '19px',
        },
        text: {
            fontSize: '15px'
        },
        divider: {
            my: 1,
            bgcolor: theme.navStyle.color,
            marginRight: '15px',
            marginLeft: '15px'
        },
    }

    const renderIcon = (index, selected, item) => {
        const iconMap = {
            0: <DashboardIcon />,
            2: <PeopleIcon />,
            3: <SettingsIcon />,
            4: <LogoutIcon />
        };

        const icon = iconMap[index];
        if (icon) {
            return (
                <ListItemIcon sx={{ width: 'auto', minWidth: '40px' }}>
                    {React.cloneElement(icon, {
                        sx: {
                            ...styles.icon,
                            color: selected === item ? theme.navStyle.bold : theme.navStyle.color
                        }
                    })}
                </ListItemIcon>
            );
        }
        return null;
    };

    return (
        <>
            {list.map((item, index) => (
                <React.Fragment key={index}>
                    {index > 3 && <Divider sx={styles.divider} /> /*Render divider after the Testing tab*/}

                    {index === 1 ? (
                        <DisplaySchools />
                    ) : (
                        <ListItemButton
                            key={index}
                            component={Link}
                            to={index < 4 && `/${item.toLowerCase()}`} // Logout modal will handle the logout route
                            selected={selected === item}
                            value={item}
                            onClick={() => {
                                if (index < 4) {
                                    setSelected(item); // Only update if it's not the same value
                                } else {
                                    setLogoutDialogOpen(true); // Open logout dialog on logout button click
                                }
                            }}
                            sx={theme.navStyle.button}
                        >
                            {renderIcon(index, selected, item)}
                            <ListItemText
                                primary={item}
                                primaryTypographyProps={{
                                    ...styles.text,
                                    ...(selected === item
                                        ? { color: theme.navStyle.bold, fontWeight: 'bold' }
                                        : { color: theme.navStyle.color }
                                    )
                                }}
                            />
                        </ListItemButton>
                    )}
                </React.Fragment>
            ))}
            {/* Logout confirmation dialog */}
            <LogoutDialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
            />
        </>
    );
});

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

export default DisplayItems;
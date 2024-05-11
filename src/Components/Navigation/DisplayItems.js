import React, { useState, useEffect } from 'react';

// Material-UI imports
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
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
import { useNavigationContext } from '../../Context/NavigationProvider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';

export function DisplayItems() {
    const theme = useTheme();
    const { list, selected, setSelected } = useNavigationContext();

    useEffect(() => {
        console.log(selected);
    }, [selected]);

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

    function logoutUser(cookieName) {
        // Check if the cookie exists
        if (document.cookie.split(';').some(cookie => cookie.trim().startsWith(`${cookieName}=`))) {
            // Overwrite the cookie with an empty value and a path that matches the original cookie's path
            document.cookie = `${cookieName}=; path=/;`;
            console.log(`${cookieName} cookie removed.`);
            window.location.href = "http://localhost:3000/";
        } else {
            console.log(`${cookieName} cookie not found.`);
        }
    }

    return (
        list.map((item, index) => (
            <React.Fragment key={index}>
                {index > 3 && <Divider sx={styles.divider} /> /*Render divider after the Testing tab*/}

                {index === 1 ? (
                    <DisplaySchools />
                ) : (
                    <ListItemButton
                        key={index}
                        component={Link}
                        to={index < 4 ? `/${item.toLowerCase()}` : '/'} //Logout route has not yet been implemented
                        selected={selected === item}
                        value={item}
                        onClick={() => {
                            setSelected(item)
                            !(index < 4) && logoutUser('jwt')
                        }}
                        sx={theme.navStyle.button}
                    >
                        <ListItemIcon sx={{ width: 'auto', minWidth: '40px' }}>
                            {renderIcon(index, selected, item)}
                        </ListItemIcon>
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
        ))
    )
}

export const ProfileTab = ({ user }) => {
    const theme = useTheme();
    const [selected, setSelected] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false); // State to manage dialog open/close
    const { currentUser } = useNavigationContext();

    if (!currentUser) {
        return null
    }

    const handleDialogOpen = () => {
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelected(false)
    };
    const adjustSecondaryTypography = () => {
        // Define a threshold length for email after which font size will be reduced
        const thresholdLength = 10;

        // Check if email length exceeds the threshold
        if (currentUser.email.length > thresholdLength) {
            return { color: theme.navStyle.color, fontSize: 10 }; // Adjust font size if email is too long
        }

        return { color: theme.navStyle.color, fontSize: 12 }; // Use default font size
    };

    return (
        <React.Fragment>
            <ListItemButton
                sx={{
                    ...theme.navStyle.button,
                    padding: '5px',
                }}
                selected={selected}
                onClick={() => {
                    setSelected(!selected);
                    handleDialogOpen();
                }}
            >

                <ListItemIcon
                    sx={{
                        minWidth: '40px',
                        width: '50px'
                    }}
                >

                    <AccountCircleIcon
                        sx={{
                            color: currentUser.avatar,
                            fontSize: '35px',
                            width: '100%',
                        }}
                    />

                </ListItemIcon>

                <ListItemText
                    primary={currentUser.fname + ' ' + currentUser.lname}
                    secondary={currentUser.email}
                    primaryTypographyProps={{ fontWeight: 'bold', color: theme.navStyle.color }}
                    secondaryTypographyProps={adjustSecondaryTypography()} // Call the adjustSecondaryTypography function
                />

            </ListItemButton>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>My Profile</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} margin={2} direction="row" alignItems="center">
                        <Avatar sx={{ bgcolor: currentUser.avatar, width: 90, height: 90, bottom: 160 }} alt="User Avatar"> </Avatar>
                        <Stack spacing={2}>
                            <TextField disabled id="outlined-disabled" label="Username" defaultValue={currentUser.username} margin="dense" />
                            <TextField disabled id="outlined-disabled" label="First Name" defaultValue={currentUser.fname + " " } margin="normal" />
                            <TextField disabled id="outlined-disabled" label="Middle Name" defaultValue={currentUser.mname + " " } margin="normal" />
                            <TextField disabled id="outlined-disabled" label="Last Name" defaultValue={currentUser.lname} margin="normal" />
                            <TextField disabled id="outlined-disabled" label="Email" defaultValue={currentUser.email} margin="normal" />
                            <TextField disabled id="outlined-disabled" label="Role" defaultValue={currentUser.position} margin="normal" />
                        </Stack>
                    </Stack>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleDialogClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#757575', fontSize: '1.5rem', cursor: 'pointer' }}>×</Button>
                </DialogActions>
            </Dialog>
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
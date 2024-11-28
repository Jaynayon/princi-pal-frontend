import React, { useState } from 'react';

// Material-UI imports
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// Material-UI icons imports
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import { Person as PersonIcon, Email as EmailIcon } from '@mui/icons-material';

// Custom component import
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import { useAppContext } from '../../Context/AppProvider';

export const ProfileTab = () => {
    const theme = useTheme();
    const [selected, setSelected] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false); // State to manage dialog open/close
    const { currentUser } = useAppContext();

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

                <Typography
                    component="div"
                    style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        width: '100%', // Ensure it takes up the full width of the container
                    }}
                >
                    <ListItemText
                        primary={`${currentUser.fname} ${currentUser.lname}`}
                        secondary={currentUser.email}
                        primaryTypographyProps={{
                            fontWeight: 'bold',
                            color: theme.navStyle.color,
                            style: {
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                            },
                        }}
                        secondaryTypographyProps={adjustSecondaryTypography()}
                    />
                </Typography>
            </ListItemButton>
            <Dialog
                aria-labelledby="profile-dialog-title"
                open={dialogOpen}
                onClose={handleDialogClose}
            >
                <DialogTitle id="profile-dialog-title">My Profile</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} margin={2} direction="row">
                        <AccountCircleIcon
                            sx={{
                                color: currentUser.avatar,
                                width: 90, height: 90
                            }}
                        />
                        <Stack spacing={2}>
                            <TextField
                                sx={{ width: '100%' }}
                                disabled
                                id="username-profile-field"
                                label="Username"
                                defaultValue={currentUser.username}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                sx={{ width: '100%' }}
                                disabled
                                id="first-name-profile-field"
                                label="First Name"
                                defaultValue={currentUser.fname + " "}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                sx={{ width: '100%' }}
                                disabled
                                id="middle-name-profile-field"
                                label="Middle Name"
                                defaultValue={currentUser.mname + " "}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                sx={{ width: '100%' }}
                                disabled
                                id="last-name-profile-field"
                                label="Last Name"
                                defaultValue={currentUser.lname}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                sx={{ width: '100%' }}
                                disabled
                                id="email-profile-field"
                                label="Email"
                                defaultValue={currentUser.email}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <EmailIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                disabled
                                id="role-profile-field"
                                label="Role"
                                defaultValue={currentUser.position}
                                margin="normal"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <PersonIcon />
                                        </InputAdornment>
                                    ),
                                }}
                            />
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

export default ProfileTab;
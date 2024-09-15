import axios from 'axios';
import React, { useState } from 'react';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import { blue, lightGreen, red, grey, blueGrey, deepPurple, brown, deepOrange, yellow, indigo, pink } from '@mui/material/colors';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import { VisibilityOff as VisibilityOffIcon, Visibility as VisibilityIcon, Lock as LockIcon, Person as PersonIcon, Email as EmailIcon } from '@mui/icons-material';
import { useNavigationContext } from '../Context/NavigationProvider';

const DemoPaper = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(2),
    ...theme.typography.body2,
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'relative',
}));

const AvatarContainer = styled('div')({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    letterSpacing: '2px',
});

const TextFieldWrapper = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
});

const FabWrapper = styled('div')({
    position: 'relative',
    marginTop: -40,
    marginLeft: 80
});

const ButtonWrapper = styled('div')({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    width: '100%',
    marginTop: '20px'
});

function SettingsPage() {
    const [anchorEl, setAnchorEl] = useState(null);
    const { currentUser, updateUserPassword, updateUserAvatar } = useNavigationContext();  // Assuming updateUserAvatar is in your context
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    if (!currentUser) {
        return null;
    }

    const userId = currentUser.id;

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleColorChange = async (color) => {
        try {
            const response = await axios.patch(`http://localhost:4000/users/${userId}/avatar`, {
                avatar: color
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
    
            if (response.status === 200) {
                const successMessage = response.data;
                console.log(successMessage); // Optionally handle success message
                currentUser.avatar = color;
                handleClose();
            } else {
                console.error("Failed to update avatar color:", response.data);
            }
        } catch (error) {
            console.error("Error updating avatar color:", error);
        }
    };
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validatePassword = (input) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(input);
    };

    const handlePasswordChange = (setter, value) => {
        const isValid = validatePassword(value);
        setErrorMessage(isValid ? '' : 'Password does not meet requirements');
        setter(value);
    };

    const handlePasswordUpdate = async () => {
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            const success = await updateUserPassword(userId, newPassword);
            if (success) {
                setMessage("Password updated successfully");
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setMessage("Failed to update password");
            }
        } catch (error) {
            console.error("Error updating password:", error);
            setMessage("An error occurred while updating password");
        }
    };

    const isSaveButtonDisabled = !(
        validatePassword(newPassword) &&
        newPassword === confirmPassword &&
        newPassword.length > 0 &&
        confirmPassword.length > 0
    );

    return (
        <Container maxWidth="lg" sx={{ mb: 4 }}>
            <DemoPaper square={false}>
                <Grid container>
                    <Grid item xs={12} md={6} lg={6} sx={{ padding: '10px' }}>
                        <AvatarContainer>
                            <Avatar sx={{ bgcolor: currentUser.avatar, width: 130, height: 130, marginBottom: '15px' }} />
                            <FabWrapper>
                                <Fab size="small" color="black" aria-label="add">
                                    <AddIcon aria-describedby={id} onClick={handleClick} />
                                </Fab>
                                <Popover
                                    id={id}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    }}
                                    PaperProps={{
                                        style: {
                                            width: '220px',
                                            maxHeight: '300px',
                                        },
                                    }}
                                >
                                    <Typography sx={{ p: 2 }}>Avatar colors</Typography>
                                    <Stack direction="row" spacing={1} sx={{ p: 2 }}>
                                        {[lightGreen[500], red[500], grey[900], blueGrey[500], deepPurple[500]].map((color, index) => (
                                            <Avatar
                                                key={index}
                                                sx={{ bgcolor: color, width: 30, height: 30, cursor: 'pointer' }}
                                                onClick={() => handleColorChange(color)}
                                            />
                                        ))}
                                    </Stack>
                                    <Stack direction="row" spacing={1} sx={{ p: 2 }}>
                                        {[brown[500], deepOrange[500], yellow[500], indigo[500], pink[500]].map((color, index) => (
                                            <Avatar
                                                key={index}
                                                sx={{ bgcolor: color, width: 30, height: 30, cursor: 'pointer' }}
                                                onClick={() => handleColorChange(color)}
                                            />
                                        ))}
                                    </Stack>
                                </Popover>
                            </FabWrapper>
                            <Typography variant="h6" fontWeight="bold">{currentUser.fname + " " + currentUser.lname}</Typography>
                            <Typography variant="h8" fontWeight="bold">{currentUser.position}</Typography>
                        </AvatarContainer>
                    </Grid>
                    <Grid item xs={12} md={6} lg={5.5} sx={{ padding: '2px' }}>
                        <TextFieldWrapper>
                            <TextField
                                sx={{ width: '100%' }}
                                disabled
                                id="email-field"
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
                                sx={{ width: '100%' }}
                                disabled
                                id="username-field"
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
                                id="first-name-field"
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
                                id="middle-name-field"
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
                                id="last-name-field"
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
                                required
                                type={showPassword ? "text" : "password"}
                                label="New Password"
                                margin="normal"
                                value={newPassword}
                                onChange={(e) => handlePasswordChange(setNewPassword, e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {showPassword ? <VisibilityIcon onClick={togglePasswordVisibility} /> : <VisibilityOffIcon onClick={togglePasswordVisibility} />}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            {errorMessage && <Typography variant="caption" color="error">{errorMessage}</Typography>}
                            <TextField
                                sx={{ width: '100%' }}
                                required
                                type={showPassword ? "text" : "password"}
                                label="Confirm Password"
                                margin="normal"
                                value={confirmPassword}
                                onChange={(e) => handlePasswordChange(setConfirmPassword, e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <LockIcon />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            {showPassword ? <VisibilityIcon onClick={togglePasswordVisibility} /> : <VisibilityOffIcon onClick={togglePasswordVisibility} />}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <ButtonWrapper>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handlePasswordUpdate}
                                    disabled={isSaveButtonDisabled}
                                >
                                    Save Changes
                                </Button>
                            </ButtonWrapper>
                            {message && <Typography variant="caption" color={message.includes("successfully") ? "success" : "error"}>{message}</Typography>}
                        </TextFieldWrapper>
                    </Grid>
                </Grid>
            </DemoPaper>
        </Container>
    );
}

export default SettingsPage;

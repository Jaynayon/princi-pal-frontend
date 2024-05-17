import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useState } from "react";
import {
    Container,
    TextField,
    IconButton,
    Button,
    InputAdornment
} from "@mui/material";
import {
    VisibilityOff as VisibilityOffIcon,
    Lock as LockIcon,
    Person as PersonIcon,
    Email as EmailIcon,
} from '@mui/icons-material';
import RestService from "../Services/RestService";
import { useNavigationContext } from '../Context/NavigationProvider';

function AdminPage(props) {
    const { currentUser } = useNavigationContext();
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [emailExistsError, setEmailExistsError] = useState(false); // Separate state for email existence check
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [registrationError, setRegistrationError] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        username: '',
        firstName: '',
        middleName: '',
        lastName: '',
        confirmPassword: ''
    });
    const [formValid, setFormValid] = useState(true); // Track form validity

    const handleShowPasswordClick = () => {
        setShowPassword(!showPassword);
    };

    const validateEmail = (input) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(input);
    };

    const validatePassword = (input) => {
        const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return regex.test(input);
    };

    const handleInputChange = (key, value) => {
        let modifiedValue = value;
        if (key === 'firstName' || key === 'middleName' || key === 'lastName') {
            // Replace non-letter characters with an empty string
            modifiedValue = modifiedValue
                .replace(/^\s+/, '') // Remove leading spaces
                .replace(/[^a-zA-Z ]+/g, '') // Remove non-letter characters
                .replace(/\s+/g, ' ') // Normalize spaces
                .replace(/\b\w/g, match => match.toUpperCase()); // Capitalize first letter of each word
        }
        if (key === 'username') {
            // Allow only alphanumeric characters for username (letters and numbers)
            modifiedValue = modifiedValue.replace(/[^a-zA-Z0-9]/g, '');
        }
        setFormData({
            ...formData,
            [key]: modifiedValue
        });

        switch (key) {
            case 'email':
                setEmailError(value !== '' && !validateEmail(value));
                if (!emailExistsError) {
                    setEmailExistsError(false);
                }
                break;
            case 'password':
                setPasswordError(value !== '' && !validatePassword(value));
                if (formData.confirmPassword && value !== formData.confirmPassword) {
                    setConfirmPasswordError(true);
                } else {
                    setConfirmPasswordError(false);
                }
                break;
            case 'confirmPassword':
                setConfirmPasswordError(value !== '' && value !== formData.password);
                break;
            default:
                break;
        }
    };

    const handleExistingEmail = async (event) => {
        const value = event.target.value;
        if (value && validateEmail(value)) {
            try {
                const exists = await RestService.validateUsernameEmail(value); // returns boolean
                setEmailExistsError(exists);
            } catch (error) {
                console.error(error);
            }
        } else {
            setEmailExistsError(false); // Clear email existence error if email is invalid or empty
        }
    };

    const handleExistingUsername = async (event) => {
        const value = event.target.value;
        if (value) {
            try {
                const exists = await RestService.validateUsernameEmail(value);
                setUsernameError(exists);
            } catch (error) {
                console.error(error);
            }
        } else {
            setUsernameError(false); // Clear username error if username is empty
        }
    };

    const handleSubmit = async () => {
        const { email, password, username, firstName, middleName, lastName } = formData;

        if (!email || !password || !username || !firstName || !middleName || !lastName) {
            console.log("All fields are required");
            setFormValid(false); // Set form validity to false immediately
            return; // Exit the function
        }

        // Further validation logic for email, password, and confirmPassword
        if (!emailError && !emailExistsError && !passwordError && !confirmPasswordError) {
            try {
                const response = await RestService.createUserPrincipal(currentUser.id, firstName, middleName, lastName, username, email, password);
                if (response) {
                    console.log("Registration successful");

                    // Clear form fields after successful registration
                    setFormData({
                        email: '',
                        password: '',
                        username: '',
                        firstName: '',
                        middleName: '',
                        lastName: '',
                        confirmPassword: ''
                    });
                    setRegistrationError('');
                    // Redirect to login page or display a success message
                    //window.location.href = "/login"; // Change this to the correct URL if needed
                } else {
                    setRegistrationError("Registration failed");
                }
            } catch (error) {
                console.error("Error:", error);
                setRegistrationError("Registration failed");
            }
        } else {
            console.log("Form contains errors");
        }
    };

    function getErrorCondition(item) {
        const { key } = item;
        if (key === 'email') {
            if (formData.email === '') {
                return false; // No error if email field is empty
            }
            let message;
            if (formData.email && !validateEmail(formData.email)) {
                message = "Invalid email address";
            } else if (emailExistsError) {
                message = "Email address already exists";
            }
            return emailError || emailExistsError ? message : false;
        }

        if (key === 'username') {
            return usernameError ? "Existing or invalid username" : false;
        }

        if (key === 'password') {
            return passwordError ? "Password must contain at least 8 characters and one special character" : false;
        }

        if (key === 'confirmPassword') {
            return confirmPasswordError ? "Passwords don't match" : false;
        }

        if (!formValid && !formData[key]) {
            return "This field is required";
        }

        return false;
    }

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

    const defaultTheme = createTheme({
        typography: {
            fontFamily: "Mulish",
        },
        //navStyle: styling[navStyle], //default or light
    });

    return (
        <ThemeProvider theme={defaultTheme}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "100vh",
                    backgroundImage: `url(/bg.png)`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                <Box
                    sx={{
                        pt: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: "1000px",
                        // backgroundColor: "green"
                    }}
                >
                    <Box sx={{
                        display: 'flex',
                        alignSelf: "flex-start",
                        flexDirection: "row",
                        flexGrow: 1,
                        pt: 3,
                        pb: 2
                    }}>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{
                                textAlign: "left",
                                color: "#252733",
                                fontWeight: "bold",
                                pr: 2
                            }}
                        >
                            Admin Page
                        </Typography>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={() => logoutUser('jwt')}
                        >
                            Logout
                        </Button>
                    </Box>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6} lg={6}>
                            <Container
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    position: "relative",
                                    zIndex: 1,
                                    scale: "0.8",
                                    height: "550px"
                                }}
                            >
                                <div style={{ marginBottom: "1rem" }}>
                                    <b style={{ fontSize: "20px", fontFamily: "Mulish", color: "#000" }}>
                                        Create a new principal account</b>
                                </div>
                                {[
                                    { label: "Email", icon: <EmailIcon />, key: 'email' },
                                    { label: "Username", icon: <PersonIcon />, key: 'username', maxLength: 20 },
                                    { label: "First Name", icon: <PersonIcon />, key: 'firstName', maxLength: 20 },
                                    { label: "Middle Name", icon: <PersonIcon />, key: 'middleName', maxLength: 20 },
                                    { label: "Last Name", icon: <PersonIcon />, key: 'lastName', maxLength: 20 },
                                    { label: "Password", icon: <LockIcon />, key: 'password', maxLength: 20 },
                                    { label: "Confirm Password", icon: <LockIcon />, key: 'confirmPassword' },
                                ].map((item, index) => (
                                    <TextField
                                        key={index}
                                        style={{ marginBottom: "1rem", width: "100%" }}
                                        color="primary"
                                        onBlur={(event) => {
                                            if (item.key === 'email') handleExistingEmail(event);
                                            if (item.key === 'username') handleExistingUsername(event);
                                        }}
                                        label={item.label}
                                        variant="outlined"
                                        type={index >= 5 ? (showPassword ? "text" : "password") : "text"}
                                        value={formData[item.key]}
                                        onChange={(e) => handleInputChange(item.key, e.target.value)}
                                        error={!!getErrorCondition(item)}
                                        helperText={getErrorCondition(item)}
                                        InputProps={{
                                            startAdornment: <InputAdornment position="start">{item.icon}</InputAdornment>,
                                            endAdornment: index >= 5 && (
                                                <InputAdornment position="end">
                                                    <IconButton onClick={handleShowPasswordClick} aria-label="toggle password visibility">
                                                        <VisibilityOffIcon />
                                                    </IconButton>
                                                </InputAdornment>
                                            ),
                                        }}
                                        inputProps={{ maxLength: item.maxLength }} // Set maxlength attribute
                                        sx={{ backgroundColor: "#DBF0FD", '& .MuiOutlinedInput-notchedOutline': { borderColor: "#DBF0FD" }, borderRadius: '8px' }} // Set background color and outline color
                                    />
                                ))}
                                {registrationError && (
                                    <div style={{ color: "red", marginBottom: "1rem" }}>{registrationError}</div>
                                )}
                                <Button
                                    sx={{
                                        backgroundColor: "#4a99d3", color: "#fff", textTransform: "none", width: "100%", marginBottom: "1rem", padding: "15px", borderRadius: "1.5px", cursor: "pointer", transition: "background-color 0.3s", "&:hover": { backgroundColor: "#474bca", },
                                    }}
                                    disabled={
                                        (usernameError || emailError || emailExistsError || passwordError || confirmPasswordError) ||
                                        (formData.email === '' || formData.username === '' || formData.password === '' || formData.confirmPassword === '')
                                    }
                                    disableElevation
                                    variant="contained"
                                    onClick={handleSubmit}
                                >
                                    Create Account
                                </Button>
                            </Container>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6}>
                            <Paper>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: "column",
                                    padding: 3
                                }}>
                                    <Typography
                                        component="h1"
                                        variant="h6"
                                        color="inherit"
                                        noWrap
                                        sx={{
                                            flexGrow: 1,
                                            textAlign: "left",
                                            color: "#252733",
                                            fontWeight: "bold",
                                            alignSelf: "flex-start",
                                            pl: 1
                                        }}
                                    >
                                        Create School
                                    </Typography>
                                    <Typography
                                        component="h1"
                                        variant="h6"
                                        color="inherit"
                                        noWrap
                                        sx={{
                                            flexGrow: 1,
                                            textAlign: "left",
                                            color: "#9FA2B4",
                                            fontWeight: "bold",
                                            alignSelf: "flex-start",
                                            fontSize: 12,
                                            pb: 1,
                                            pl: 1
                                        }}
                                    >
                                        Create a new school to manipulate documents
                                    </Typography>
                                    <TextField
                                        variant='outlined'
                                        label='School Name'
                                        sx={{ m: 1 }}
                                        InputLabelProps={{
                                            style: {
                                                fontSize: 14,
                                                color: 'black', // Adjust color if needed
                                                marginTop: -4, // Adjust vertical positioning
                                            }
                                        }}
                                        InputProps={{
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: 14,
                                                height: 40
                                            }
                                        }}
                                    />
                                    <TextField
                                        variant='outlined'
                                        label='School Full Name'
                                        sx={{ m: 1 }}
                                        InputLabelProps={{
                                            style: {
                                                fontSize: 14,
                                                color: 'black', // Adjust color if needed
                                                marginTop: -4, // Adjust vertical positioning
                                            }
                                        }}
                                        InputProps={{
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: 14,
                                                height: 40
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled
                                        onClick={() => logoutUser('jwt')}
                                    >
                                        Create School
                                    </Button>
                                </Box>
                            </Paper>
                            <Paper>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: "column",
                                    padding: 3,
                                    mt: 2
                                }}>
                                    <Typography
                                        component="h1"
                                        variant="h6"
                                        color="inherit"
                                        noWrap
                                        sx={{
                                            flexGrow: 1,
                                            textAlign: "left",
                                            color: "#252733",
                                            fontWeight: "bold",
                                            alignSelf: "flex-start",
                                            pl: 1
                                        }}
                                    >
                                        Integrate Principal
                                    </Typography>
                                    <Typography
                                        component="h1"
                                        variant="h6"
                                        color="inherit"
                                        noWrap
                                        sx={{
                                            flexGrow: 1,
                                            textAlign: "left",
                                            color: "#9FA2B4",
                                            fontWeight: "bold",
                                            alignSelf: "flex-start",
                                            fontSize: 12,
                                            pb: 1,
                                            pl: 1
                                        }}
                                    >
                                        Integrate principal to an existing school
                                    </Typography>
                                    <TextField
                                        variant='outlined'
                                        label='School Name or Full Name'
                                        sx={{ m: 1 }}
                                        InputLabelProps={{
                                            style: {
                                                fontSize: 14,
                                                color: 'black', // Adjust color if needed
                                                marginTop: -4, // Adjust vertical positioning
                                            }
                                        }}
                                        InputProps={{
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: 14,
                                                height: 40
                                            }
                                        }}
                                    />
                                    <TextField
                                        variant='outlined'
                                        label='Email or Username'
                                        sx={{ m: 1 }}
                                        InputLabelProps={{
                                            style: {
                                                fontSize: 14,
                                                color: 'black', // Adjust color if needed
                                                marginTop: -4, // Adjust vertical positioning
                                            }
                                        }}
                                        InputProps={{
                                            style: {
                                                display: 'flex',
                                                alignItems: 'center',
                                                fontSize: 14,
                                                height: 40
                                            }
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled
                                        onClick={() => logoutUser('jwt')}
                                    >
                                        Integrate User
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </ThemeProvider>

    );
}




export default AdminPage;
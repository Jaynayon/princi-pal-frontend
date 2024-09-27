import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Container, TextField, IconButton, Button, InputAdornment, Tabs, Tab } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import axios from 'axios';
import { useNavigationContext } from '../Context/NavigationProvider'; // Ensure this is the correct path

import PropTypes from 'prop-types';
// TabPanel component for displaying content based on the active tab
const TabPanel = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function AdminPage(props) {
    const { currentUser, validateUsernameEmail } = useNavigationContext();
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
    const [tabValue, setTabValue] = useState(0);
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const [formValid, setFormValid] = useState(true); // Track form validity
    const [isTyping, setIsTyping] = useState(false);

    const [schoolNameError, setSchoolNameError] = useState(false);
    const [schoolFullNameError, setSchoolFullNameError] = useState(false);
    const [schoolFormData, setSchoolFormData] = useState({
        name: '',
        fullName: ''
    })

    const [integrateSchoolError, setIntegrateSchoolError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [userErrorMessage, setUserErrorMessage] = useState("");
    const [emailUsernameError, setEmailUsernameError] = useState(false);
    const [integrateFormData, setIntegrateFormData] = useState({
        name: '',
        email: ''
    })
    const [school, setSchool] = useState('');
    const [user, setUser] = useState('');

    const [uacs, setUacs] = useState({
        name: '',
        code: ''
    });
    const [uacsError, setUacsError] = useState({
        name: false,
        code: false
    })

    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const createUserPrincipal = async (adminId, fname, mname, lname, username, email, password) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_USER}/create/principal`, {
                adminId,
                fname,
                mname,
                lname,
                username,
                email,
                password,
                position: "Principal"
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response) {
                console.log(response.data)
            }

            return response.status === 201;
        } catch (error) {
            console.error('Error creating user:', error);
            if (error.response && error.response.status === 409) {
                throw new Error("User with the same email or username already exists.");
            } else {
                throw new Error("Registration failed. Please try again later.");
            }
        }
    };

    const getSchoolName = async (name) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_SCHOOL}/name`, {
                name
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response?.data || null;
        } catch (error) {
            console.error('Error retrieving school:', error);
            return null;
        }
    };

    const createSchool = async (name, fullName) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_SCHOOL}/create`, {
                name,
                fullName
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response?.data || null;
        } catch (error) {
            console.error('Error creating school:', error);
            return null;
        }
    };

    const getPrincipal = async (schoolId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_SCHOOL}/users/principal`, {
                schoolId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response?.data || null;
        } catch (error) {
            console.error('Error creating school:', error);
            return null;
        }
    };

    const getUserByEmailUsername = async (email) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_USER}/schools`, {
                emailOrUsername: email
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response?.data || null;
        } catch (error) {
            console.error('Error creating school:', error);
            return null;
        }
    };

    const insertUserAssociation = async (userId, schoolId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_ASSOC}/insert`, {
                userId,
                schoolId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response?.data || null;
        } catch (error) {
            console.error('Error creating school:', error);
            return null;
        }
    };

    const handleIntegrateInputChange = (key, value) => {
        setIsTyping(true);
        setIntegrateFormData({
            ...integrateFormData,
            [key]: value
        });
        console.log(integrateFormData.email)
    };

    const integrateOnBlur = async (key, value) => {
        let nameExists
        // Check if school exists
        if (key === "name" && integrateFormData.name !== "") {
            nameExists = await getSchoolName(value);
            console.log(nameExists)

            if (!nameExists) {
                setIntegrateSchoolError(true)
                setErrorMessage("School doesn't exist");
            } else {
                // Check if school already has a principal integrated
                const principal = await getPrincipal(nameExists.id);
                console.log(principal)
                if (principal) {
                    setIntegrateSchoolError(true)
                    setErrorMessage("A principal already exists in this school");
                } else {
                    setSchool(nameExists) //set school
                    setIntegrateSchoolError(false);
                }
                console.log(principal);
            }

            //Check if user exists
        } else if (key === "email" && integrateFormData.email !== "") {
            const userExists = await getUserByEmailUsername(value);

            if (!userExists) {
                setEmailUsernameError(true)
                setUserErrorMessage("User doesn't exist");
            } else {
                if (userExists.position !== "Principal") {
                    setEmailUsernameError(true)
                    setUserErrorMessage("User is not a principal");
                } else {
                    if (userExists.schools.length > 0) {
                        setEmailUsernameError(true)
                        setUserErrorMessage("User already has an association");
                    } else {
                        setUser(userExists); //set current user
                        setEmailUsernameError(false)
                    }
                }
            }
            //nameExists ? setSchoolFullNameError(true) : setSchoolFullNameError(false);
        } else if (integrateFormData.name === "" || integrateFormData.email === "") {
            integrateFormData.name === "" && setIntegrateSchoolError(false);
            integrateFormData.email === "" && setEmailUsernameError(false);
        }
        setIsTyping(false);
    }

    //insertUserAssociation
    const handleIntegrateSubmit = async () => {
        // Further validation logic for email, password, and confirmPassword
        if (!integrateSchoolError && !emailUsernameError) {
            try {
                const response = await insertUserAssociation(user.id, school.id);
                if (response) {
                    console.log("Insert association creation successful");

                    // Clear form fields after successful registration
                    setIntegrateFormData({
                        name: '',
                        email: ''
                    });
                    setIntegrateSchoolError(false);
                    setEmailUsernameError(false);
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

    const handleSchoolInputChange = (key, value) => {
        setIsTyping(true);
        setSchoolFormData({
            ...schoolFormData,
            [key]: value
        });
        console.log(schoolFormData.fullName)
    }

    const schoolOnBlur = async (key, value) => {
        let nameExists

        if (key === "name" && value !== "") {
            nameExists = await getSchoolName(value);
            nameExists ? setSchoolNameError(true) : setSchoolNameError(false);
        } else if (key === "fullName" && value !== "") {
            nameExists = await getSchoolName(value);
            console.log(nameExists)
            nameExists ? setSchoolFullNameError(true) : setSchoolFullNameError(false);
        } else {
            if (key === "fullName") {
                setSchoolFullNameError(false);
            } else {
                setSchoolNameError(false);
            }
        }

        setIsTyping(false);
    }

    const handleSchoolSubmit = async () => {
        const { name, fullName } = schoolFormData;

        if (!name || !fullName) {
            // console.log("All fields are required");
            // setFormValid(false); // Set form validity to false immediately
            return; // Exit the function
        }

        // Further validation logic for email, password, and confirmPassword
        if (!emailError && !emailExistsError && !passwordError && !confirmPasswordError) {
            try {
                const response = await createSchool(name, fullName);
                if (response) {
                    console.log("School creation successful");

                    // Clear form fields after successful registration
                    setSchoolFormData({
                        name: '',
                        fullName: ''
                    });
                    setSchoolFullNameError(false);
                    setSchoolNameError(false);
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
                const exists = await validateUsernameEmail(value); // returns boolean
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
                const exists = await validateUsernameEmail(value);
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
                const response = await createUserPrincipal(currentUser.id, firstName, middleName, lastName, username, email, password);
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

    const handleLogout = () => {
        // logoutUser('jwt');
        if (JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))) {
            window.localStorage.removeItem("LOCAL_STORAGE_TOKEN")
            window.location.href = "https://localhost:3000/";
        } else {
            console.log("Local storage item not found");
        }
        setLogoutDialogOpen(false); // Close dialog after logout
    };

    // const logoutUser = (cookieName) => {
    //     if (document.cookie.split(';').some(cookie => cookie.trim().startsWith(`${cookieName}=`))) {
    //         document.cookie = `${cookieName}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    //         console.log(`${cookieName} cookie removed.`);
    //         window.location.href = "/"; // Redirect after logout
    //     } else {
    //         console.log(`${cookieName} cookie not found.`);
    //     }
    // };

    const getUacsByCodeOrName = async (value) => {
        try {
            const response = await axios.post(`http://localhost:4000/uacs/nameOrCode`, {
                nameOrCode: value
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            return response?.data || null;
        } catch (e) {
            console.error(e);
            return null;
        }

    }

    const createUacs = async () => {
        try {
            const response = await axios.post(`http://localhost:4000/uacs/create`, {
                name: uacs["name"],
                code: uacs["code"]
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setUacs({
                name: "",
                code: ""
            })

            return response.data || null;
        } catch (e) {
            console.error(e);
            return null;
        }

    }

    const handleUacsChange = (key, value) => {
        setIsTyping(true);
        setUacs({
            ...uacs,
            [key]: value
        });
    };

    const handleUacsBlur = async (key, value) => {
        const uacs = await getUacsByCodeOrName(value);
        if (uacs) {
            setUacsError({
                ...uacsError,
                [key]: true
            });
        } else {
            setUacsError({
                ...uacsError,
                [key]: false
            });
        }
        console.log(uacsError);
        setIsTyping(false);
    }

    return (
        <Container
            maxWidth={false}
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                overflow: "auto",
                backgroundImage: `url(/bg.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <Container
                maxWidth="md"
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 1,
                    paddingTop: "64px",
                    padding: "0 1rem",
                }}
            >
                <Typography
                    variant="h4"
                    style={{ marginBottom: "2rem", marginTop: "2rem", fontFamily: "Mulish", color: "#000", textAlign: "center" }}
                >
                    Admin Page
                </Typography>

                <Paper
                    style={{
                        width: '100%',
                        padding: '2rem',
                        borderRadius: '10px',
                        margin: 'auto',
                        position: 'relative',
                        bottom: '20px',
                        left: '0',
                        right: '0',
                        zIndex: 1,
                    }}
                >
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                        <Tabs value={tabValue} onChange={handleTabChange} centered>
                            <Tab label="Create Principal" />
                            <Tab label="Create School" />
                            <Tab label="Integrate Principal" />
                            <Tab label="Create UACS" />
                        </Tabs>
                        <Button onClick={() => setLogoutDialogOpen(true)}>Logout</Button>
                    </Box>

                    {/* Tab Content */}
                    <Box
                        sx={{
                            minHeight: "60vh",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            paddingTop: "3rem",
                            width: "100%",
                            maxWidth: "700px", // Adjust if needed
                            margin: "0 auto", // Center align horizontally
                        }}
                    >
                        {tabValue === 0 && (
                            <Box>
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
                                        style={{ marginBottom: "1rem", width: "100%", maxWidth: '400px' }}
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
                                        inputProps={{ maxLength: item.maxLength }}
                                        sx={{ backgroundColor: "#DBF0FD", '& .MuiOutlinedInput-notchedOutline': { borderColor: "#DBF0FD" }, borderRadius: '8px' }}
                                    />
                                ))}

                                {registrationError && (
                                    <div style={{ color: "red", marginBottom: "1rem" }}>{registrationError}</div>
                                )}

                                <Button
                                    sx={{
                                        backgroundColor: "#4a99d3",
                                        color: "#fff",
                                        textTransform: "none",
                                        width: "100%",
                                        maxWidth: '400px',
                                        marginBottom: "1rem",
                                        padding: "15px",
                                        borderRadius: "1.5px",
                                        cursor: "pointer",
                                        transition: "background-color 0.3s",
                                        "&:hover": { backgroundColor: "#474bca" },
                                        display: 'block',
                                        marginLeft: 'auto',
                                        marginRight: 'auto',
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
                            </Box>
                        )}

                        {tabValue === 1 && (
                            <Box sx={{ width: "100%", display: "flex", justifyContent: "center", maxWidth: "400px", marginBottom: "10%" }}>
                                {/* Create School Form */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography component="p">School Registration for Document Management</Typography>
                                        <TextField
                                            variant="outlined"
                                            label="School Name"
                                            sx={{
                                                m: 1,
                                                width: 'calc(100% - 2rem)',  // Adjust width to fit padding and margins
                                                backgroundColor: "#DBF0FD",
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: "#DBF0FD" },
                                                borderRadius: '8px'
                                            }}
                                            value={schoolFormData["name"]}
                                            error={schoolFormData.name === "" ? false : schoolNameError}
                                            helperText={schoolNameError && "School name already exists"}
                                            onBlur={(event) => schoolOnBlur("name", event.target.value)}
                                            onChange={(e) => handleSchoolInputChange("name", e.target.value)}
                                        />
                                        <TextField
                                            variant="outlined"
                                            label="School Full Name"
                                            sx={{
                                                m: 1,
                                                width: 'calc(100% - 2rem)',  // Adjust width to fit padding and margins
                                                backgroundColor: "#DBF0FD",
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: "#DBF0FD" },
                                                borderRadius: '8px'
                                            }}
                                            value={schoolFormData["fullName"]}
                                            error={schoolFormData.fullName === "" ? false : schoolFullNameError}
                                            helperText={schoolFullNameError && "School full name already exists"}
                                            onBlur={(event) => schoolOnBlur("fullName", event.target.value)}
                                            onChange={(e) => handleSchoolInputChange("fullName", e.target.value)}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                width: 'calc(100% - 2rem)',  // Match width with TextField
                                                mt: 1, // Margin top to space from TextField
                                                backgroundColor: "#4a99d3",
                                                '&:hover': { backgroundColor: "#474bca" }
                                            }}
                                            disabled={
                                                (schoolFullNameError || schoolNameError) ||
                                                (schoolFormData.name === "" || schoolFormData.fullName === "") ||
                                                isTyping
                                            }
                                            onClick={() => handleSchoolSubmit()}
                                        >
                                            Create
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}

                        {tabValue === 2 && (
                            <Box sx={{ width: "100%", display: "flex", justifyContent: "center", maxWidth: "400px", marginBottom: "10%" }}>
                                {/* Integrate Principal Form */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography component="p">Assign principal to an existing school</Typography>
                                        <TextField
                                            variant="outlined"
                                            label="School Name or Full Name"
                                            sx={{
                                                m: 1,
                                                width: 'calc(100% - 2rem)',  // Adjust width to fit padding and margins
                                                backgroundColor: "#DBF0FD",
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: "#DBF0FD" },
                                                borderRadius: '8px'
                                            }}
                                            value={integrateFormData["name"]}
                                            error={integrateFormData.name === "" ? false : integrateSchoolError}
                                            helperText={integrateSchoolError && errorMessage}
                                            onBlur={(event) => integrateOnBlur("name", event.target.value)}
                                            onChange={(event) => handleIntegrateInputChange("name", event.target.value)}
                                        />
                                        <TextField
                                            variant="outlined"
                                            label="Email or Username"
                                            sx={{
                                                m: 1,
                                                width: 'calc(100% - 2rem)',  // Adjust width to fit padding and margins
                                                backgroundColor: "#DBF0FD",
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: "#DBF0FD" },
                                                borderRadius: '8px'
                                            }}
                                            value={integrateFormData["email"]}
                                            error={integrateFormData.email === "" ? false : emailUsernameError}
                                            helperText={emailUsernameError && userErrorMessage}
                                            onBlur={(event) => integrateOnBlur("email", event.target.value)}
                                            onChange={(event) => handleIntegrateInputChange("email", event.target.value)}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                width: 'calc(100% - 2rem)',  // Match width with TextField
                                                mt: 1, // Margin top to space from TextField
                                                backgroundColor: "#4a99d3",
                                                '&:hover': { backgroundColor: "#474bca" }
                                            }}
                                            disabled={
                                                (integrateSchoolError || emailUsernameError) ||
                                                (integrateFormData.name === "" || integrateFormData.email === "") ||
                                                isTyping
                                            }
                                            onClick={() => handleIntegrateSubmit()}
                                        >
                                            Integrate
                                        </Button>
                                    </Grid>
                                </Grid>

                            </Box>
                        )}

                        {tabValue === 3 && (
                            <Box sx={{ width: "100%", display: "flex", justifyContent: "center", maxWidth: "400px", marginBottom: "10%" }}>
                                {/* Integrate Principal Form */}
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography component="p">Add new Unified Accounts Code Structure (UACS)</Typography>
                                        <TextField
                                            variant="outlined"
                                            label="Uacs Name"
                                            sx={{
                                                m: 1,
                                                width: 'calc(100% - 2rem)',  // Adjust width to fit padding and margins
                                                backgroundColor: "#DBF0FD",
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: "#DBF0FD" },
                                                borderRadius: '8px'
                                            }}
                                            value={uacs["name"]}
                                            error={uacsError["name"]}
                                            helperText={uacsError["name"] && "UACS name already exists"}
                                            onBlur={(event) => handleUacsBlur("name", event.target.value)}
                                            onChange={(event) => handleUacsChange("name", event.target.value)}
                                        />
                                        <TextField
                                            variant="outlined"
                                            label="Object Code"
                                            sx={{
                                                m: 1,
                                                width: 'calc(100% - 2rem)',  // Adjust width to fit padding and margins
                                                backgroundColor: "#DBF0FD",
                                                '& .MuiOutlinedInput-notchedOutline': { borderColor: "#DBF0FD" },
                                                borderRadius: '8px'
                                            }}
                                            value={uacs["code"]}
                                            error={uacsError["code"]}
                                            helperText={uacsError["code"] && "UACS code already exists"}
                                            onBlur={(event) => handleUacsBlur("code", event.target.value)}
                                            onChange={(event) => handleUacsChange("code", event.target.value)}
                                        />
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            sx={{
                                                width: 'calc(100% - 2rem)',  // Match width with TextField
                                                mt: 1, // Margin top to space from TextField
                                                backgroundColor: "#4a99d3",
                                                '&:hover': { backgroundColor: "#474bca" }
                                            }}
                                            disabled={
                                                (uacs["code"] === "" || uacs["name"] === "") ||
                                                (uacsError["code"] || uacsError["name"]) ||
                                                isTyping
                                            }
                                            onClick={() => createUacs()}
                                        >
                                            Create
                                        </Button>
                                    </Grid>
                                </Grid>

                            </Box>
                        )}
                    </Box>
                </Paper>
            </Container>

            {/* Logout confirmation dialog */}
            <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} aria-labelledby="logout-dialog-title" maxWidth="xs" fullWidth>
                <DialogTitle id="logout-dialog-title">Are you sure you want to Logout?</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", p: 0 }}>
                    <DialogActions>
                        <Box>
                            <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleLogout} color="primary">
                                Logout
                            </Button>
                        </Box>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </Container>
    );
}

export default AdminPage;
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
import { useNavigationContext } from '../Context/NavigationProvider';
import axios from 'axios';

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
            const response = await axios.post(`${process.env.REACT_APP_API_URL_SCHOOL}/principal`, {
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

            //!nameExists ? setIntegrateSchoolError(true) : setIntegrateSchoolError(false);
            if (!nameExists) {
                setIntegrateSchoolError(true)
                setErrorMessage("School doesn't exist");
            } else {
                // Check if school already has a principal integrated
                const principal = await getPrincipal(nameExists.id);
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
        if (key === "name" && schoolFormData.name !== "") {
            nameExists = await getSchoolName(value);
            nameExists ? setSchoolNameError(true) : setSchoolNameError(false);
        } else if (key === "fullName" && schoolFormData.fullName !== "") {
            nameExists = await getSchoolName(value);
            nameExists ? setSchoolFullNameError(true) : setSchoolFullNameError(false);
        } else if (schoolFormData.name === "" || schoolFormData.fullName === "") {
            schoolFormData.name === "" ? setSchoolNameError(false) : setSchoolFullNameError(false);
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
                            {/*Create School*/}
                            <Paper>
                                <Box sx={styles.container}>
                                    <Typography
                                        component="h1"
                                        variant="h6"
                                        color="inherit"
                                        noWrap
                                        sx={styles.title}
                                    >
                                        Create School
                                    </Typography>
                                    <Typography
                                        component="h1"
                                        variant="h6"
                                        color="inherit"
                                        noWrap
                                        sx={styles.description}
                                    >
                                        Create a new school to manipulate documents
                                    </Typography>
                                    <TextField
                                        variant='outlined'
                                        label='School Name'
                                        sx={{ m: 1 }}
                                        value={schoolFormData["name"]}
                                        error={schoolFormData.name === "" ? false : schoolNameError}
                                        helperText={schoolNameError && "School name already exists"}
                                        InputLabelProps={styles.InputLabelProps}
                                        InputProps={styles.InputProps}
                                        onBlur={(event) => schoolOnBlur("name", event.target.value)}
                                        onChange={(event) => handleSchoolInputChange("name", event.target.value)}
                                    />
                                    <TextField
                                        variant='outlined'
                                        label='School Full Name'
                                        sx={{ m: 1 }}
                                        value={schoolFormData["fullName"]}
                                        error={schoolFormData.fullName === "" ? false : schoolFullNameError}
                                        helperText={schoolFullNameError && "School full name already exists"}
                                        InputLabelProps={styles.InputLabelProps}
                                        InputProps={styles.InputProps}
                                        onBlur={(event) => schoolOnBlur("fullName", event.target.value)}
                                        onChange={(event) => handleSchoolInputChange("fullName", event.target.value)}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={
                                            (schoolFullNameError || schoolNameError) ||
                                            (schoolFormData.name === "" || schoolFormData.fullName === "") ||
                                            isTyping
                                        }
                                        onClick={() => handleSchoolSubmit()}
                                    >
                                        Create School
                                    </Button>
                                </Box>
                            </Paper>
                            {/*Integrate Principal*/}
                            <Paper>
                                <Box sx={[styles.container, { mt: 2 }]}>
                                    <Typography
                                        component="h1"
                                        variant="h6"
                                        color="inherit"
                                        noWrap
                                        sx={styles.title}
                                    >
                                        Integrate Principal
                                    </Typography>
                                    <Typography
                                        component="h1"
                                        variant="h6"
                                        color="inherit"
                                        noWrap
                                        sx={styles.description}
                                    >
                                        Integrate principal to an existing school
                                    </Typography>
                                    <TextField
                                        variant='outlined'
                                        label='School Name or Full Name'
                                        sx={{ m: 1 }}
                                        value={integrateFormData["name"]}
                                        error={integrateFormData.name === "" ? false : integrateSchoolError}
                                        helperText={integrateSchoolError && errorMessage}
                                        InputLabelProps={styles.InputLabelProps}
                                        InputProps={styles.InputProps}
                                        onBlur={(event) => integrateOnBlur("name", event.target.value)}
                                        onChange={(event) => handleIntegrateInputChange("name", event.target.value)}
                                    />
                                    <TextField
                                        variant='outlined'
                                        label='Email or Username'
                                        sx={{ m: 1 }}
                                        value={integrateFormData["email"]}
                                        error={integrateFormData.email === "" ? false : emailUsernameError}
                                        helperText={emailUsernameError && userErrorMessage}
                                        InputLabelProps={styles.InputLabelProps}
                                        InputProps={styles.InputProps}
                                        onBlur={(event) => integrateOnBlur("email", event.target.value)}
                                        onChange={(event) => handleIntegrateInputChange("email", event.target.value)}
                                    />
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        disabled={
                                            (integrateSchoolError || emailUsernameError) ||
                                            (integrateFormData.name === "" || integrateFormData.email === "") ||
                                            isTyping
                                        }
                                        onClick={() => handleIntegrateSubmit()}
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

const styles = {
    container: {
        display: 'flex',
        flexDirection: "column",
        padding: 3
    },
    title: {
        flexGrow: 1,
        textAlign: "left",
        color: "#252733",
        fontWeight: "bold",
        alignSelf: "flex-start",
        pl: 1
    },
    description: {
        flexGrow: 1,
        textAlign: "left",
        color: "#9FA2B4",
        fontWeight: "bold",
        alignSelf: "flex-start",
        fontSize: 12,
        pb: 1,
        pl: 1
    },
    InputLabelProps: {
        style: {
            fontSize: 14,
            color: 'black', // Adjust color if needed
            marginTop: -4, // Adjust vertical positioning
        }
    },
    InputProps: {
        style: {
            display: 'flex',
            alignItems: 'center',
            fontSize: 14,
            height: 40
        }
    }
}



export default AdminPage;
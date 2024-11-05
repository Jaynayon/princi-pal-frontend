import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { TextField, IconButton, Button, InputAdornment } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';
import { useNavigationContext } from '../../Context/NavigationProvider';

export default function CreatePrincipalTab({ fetchPrincipals }) {
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
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
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
            } finally {
                fetchPrincipals(); // Fetch updated list of principals
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

    return (
        <Box sx={{ pt: 2 }}>
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
                        style: {
                            display: 'flex',
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: "flex-start",
                            fontSize: 14,
                            height: 45,
                        },
                    }}
                    inputProps={{ maxLength: item.maxLength }}
                    InputLabelProps={{ sx: { fontSize: 14 } }}
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
                    height: "40px",
                    marginBottom: "1rem",
                    padding: "15px",
                    borderRadius: "1.5px",
                    cursor: "pointer",
                    transition: "background-color 0.3s",
                    "&:hover": { backgroundColor: "#474bca" },
                    display: 'flex',
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
    );
}
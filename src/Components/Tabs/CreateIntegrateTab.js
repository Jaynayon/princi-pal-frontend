import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

export default function CreateIntegrateTab() {
    const [integrateSchoolError, setIntegrateSchoolError] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [userErrorMessage, setUserErrorMessage] = useState("");
    const [emailUsernameError, setEmailUsernameError] = useState(false);
    const [integrateFormData, setIntegrateFormData] = useState({
        name: '',
        email: ''
    })
    const [school, setSchool] = useState('');
    const [user, setUser] = useState('');
    const handleIntegrateInputChange = (key, value) => {
        setIsTyping(true);
        setIntegrateFormData({
            ...integrateFormData,
            [key]: value
        });
    };

    const getSchoolName = async (name) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_SCHOOL}/name`, {
                name
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                }
            });

            return response?.data || null;
        } catch (error) {
            console.error('Error retrieving school:', error);
            return null;
        }
    };

    const getPrincipal = async (schoolId) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_SCHOOL}/users/principal`, {
                schoolId
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
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
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
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
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                }
            });

            return response?.data || null;
        } catch (error) {
            console.error('Error creating school:', error);
            return null;
        }
    };

    const integrateOnBlur = async (key, value) => {
        let nameExists
        // Check if school exists
        if (key === "name" && integrateFormData.name !== "") {
            nameExists = await getSchoolName(value);

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
                    // Clear form fields after successful registration
                    setIntegrateFormData({
                        name: '',
                        email: ''
                    });
                    setIntegrateSchoolError(false);
                    setEmailUsernameError(false);
                    // Redirect to login page or display a success message
                    //window.location.href = "/login"; // Change this to the correct URL if needed
                }
            } catch (error) {
                console.error("Error:", error);
            }
        }
    };
    return (
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
    );
}
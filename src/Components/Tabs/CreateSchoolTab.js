import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

export default function CreateSchoolTab() {
    const [schoolNameError, setSchoolNameError] = useState(false);
    const [schoolFullNameError, setSchoolFullNameError] = useState(false);
    const [schoolFormData, setSchoolFormData] = useState({
        name: '',
        fullName: ''
    });
    const [isTyping, setIsTyping] = useState(false);

    const handleSchoolInputChange = (key, value) => {
        setIsTyping(true);
        setSchoolFormData({
            ...schoolFormData,
            [key]: value
        });
        console.log(schoolFormData.fullName)
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

    const createSchool = async (name, fullName) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_SCHOOL}/create`, {
                name,
                fullName
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

    const handleSchoolSubmit = async () => {
        const { name, fullName } = schoolFormData;

        if (!name || !fullName) {
            // console.log("All fields are required");
            // setFormValid(false); // Set form validity to false immediately
            return; // Exit the function
        }

        // Further validation logic for email, password, and confirmPassword
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
            }
        } catch (error) {
            console.error("Error:", error);
        }

    };

    return (
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
    );
}
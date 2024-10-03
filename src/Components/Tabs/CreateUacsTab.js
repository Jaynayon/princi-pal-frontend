import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

export default function CreateUacsTab() {
    const [uacs, setUacs] = useState({
        name: '',
        code: ''
    });
    const [uacsError, setUacsError] = useState({
        name: false,
        code: false
    });
    const [isTyping, setIsTyping] = useState(false);

    const getUacsByCodeOrName = async (value) => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_UACS}/nameOrCode`, {
                nameOrCode: value
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
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
            const response = await axios.post(`${process.env.REACT_APP_API_URL_UACS}/create`, {
                name: uacs["name"],
                code: uacs["code"]
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
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
    );
}
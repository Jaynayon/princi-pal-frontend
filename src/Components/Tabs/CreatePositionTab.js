import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

export default function CreatePositionTab() {
    const [position, setPosition] = useState("");
    const [positionError, setPositionError] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const getPositionByName = async (value) => {
        try {
            const response = await axios.get(`http://localhost:4000/positions/name/${value}`);

            return response?.data || null;
        } catch (e) {
            console.error(e);
            return null;
        }

    }

    const createPosition = async () => {
        try {
            const response = await axios.post(`http://localhost:4000/positions/create`, {
                name: position,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            setPosition("");

            return response.data || null;
        } catch (e) {
            console.error(e);
            return null;
        }

    }

    const handlePositionChange = (value) => {
        setIsTyping(true);
        setPosition(value);
    };

    const handlePositionBlur = async (value) => {
        const pos = await getPositionByName(value);
        console.log(pos)
        if (pos) {
            setPositionError(true);
        } else {
            setPositionError(false);
        }
        console.log(positionError);
        setIsTyping(false);
    }
    return (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center", maxWidth: "400px", marginBottom: "10%" }}>
            {/* Integrate Principal Form */}
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography component="p">Add new user position</Typography>
                    <TextField
                        variant="outlined"
                        label="Position Name"
                        sx={{
                            m: 1,
                            width: 'calc(100% - 2rem)',  // Adjust width to fit padding and margins
                            backgroundColor: "#DBF0FD",
                            '& .MuiOutlinedInput-notchedOutline': { borderColor: "#DBF0FD" },
                            borderRadius: '8px'
                        }}
                        value={position}
                        error={positionError}
                        helperText={positionError && "Position already exists"}
                        onBlur={(event) => handlePositionBlur(event.target.value)}
                        onChange={(event) => handlePositionChange(event.target.value)}
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
                        disabled={position === "" || positionError || isTyping}
                        onClick={() => createPosition()}
                    >
                        Create
                    </Button>
                </Grid>
            </Grid>

        </Box>
    );
}
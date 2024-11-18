import React, { useCallback, useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import { useSchoolContext } from '../../Context/SchoolProvider';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import CancelIcon from '@mui/icons-material/Cancel';

export default function SchoolSearchFilter() {
    const { setLr, currentDocument, isEditingRef, isSearchingRef } = useSchoolContext();
    const [input, setInput] = useState('');
    const [lrCopy, setLrCopy] = useState([]);

    // Get the original copy of the LR
    const getCurrentLr = useCallback(async () => {
        try {
            if (currentDocument.id !== 0) {
                const response = await axios.get(`${process.env.REACT_APP_API_URL_LR}/documents/${currentDocument.id}/approved`, {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                    }
                });
                setLrCopy(response.data || []);
            }
        } catch (error) {
            console.error('Error fetching lr:', error);
        }
    }, [currentDocument]);

    const handleInputClick = () => {
        getCurrentLr(); // Update lr copy
    }

    const handleInputChange = (event) => {
        isEditingRef.current = true;
        isSearchingRef.current = true;
        setInput(event.target.value); // save input
    }

    const handleInputBlur = () => {
        //Something after searching
        if (!input) {
            isEditingRef.current = false;
            isSearchingRef.current = false;
        }
    }

    const handleClearInput = () => {
        setInput("");
        setLr(lrCopy);
        isEditingRef.current = false;
        isSearchingRef.current = false;
    }

    // Use effect on load: fetch lr copy and initialize input to empty
    useEffect(() => {
        setInput(""); // Initialize input to empty string
    }, [currentDocument]);

    // Use effect: lookup keyword in LR if input is not empty
    useEffect(() => {
        const lookup = (keyword) => {
            const obj = lrCopy.filter((item) => {
                // Convert the item to a string by joining its values, and then check if the keyword exists
                return Object.values(item).some(value =>
                    value.toString().toLowerCase().includes(keyword.toLowerCase())
                );
            });
            // Check if the filtered result is empty
            if (obj.length === 0) {
                // Return the original array if the keyword didn't match anything
                isEditingRef.current = false;
                isSearchingRef.current = false;
                return lrCopy;
            }
            return obj;
        };

        if (input) { // Set lookup if there's input
            setLr(lookup(input));
        }
    }, [input, setLr, isEditingRef, isSearchingRef, lrCopy]);

    return (
        <React.Fragment>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                }}
            >
                <SearchIcon sx={styles.icon} />
                <TextField
                    sx={styles.input}
                    variant='standard'
                    name={"lr-search-input"}
                    placeholder='Search'
                    value={input}
                    onClick={() => handleInputClick()}
                    onChange={(event) => handleInputChange(event)}
                    onBlur={() => handleInputBlur()}
                    InputProps={{
                        endAdornment: input && (
                            <InputAdornment position="end">
                                <IconButton onClick={() => handleClearInput()}>
                                    <CancelIcon sx={{ fontSize: '20px' }} />
                                </IconButton>
                            </InputAdornment>
                        ),
                        disableUnderline: true,
                    }}
                />
            </Box>
        </React.Fragment>
    );
}

const styles = {
    icon: {
        color: "#C5C7CD",
        backgroundColor: 'white'
    },
    input: {
        marginLeft: '5px',
        background: "transparent",
        width: '400px',
        "& fieldset": { border: 'none' },
        "& input::placeholder": {
            fontSize: '13px', // Customize the font size here
            fontFamily: 'Mulish-SemiBold', // Example to keep font-family consistent
            color: "#4B506D", // Customize the placeholder color if needed
        },
        "& input": {
            fontSize: '13px', // Customize font size for input value here
            fontFamily: 'Mulish-SemiBold', // Customize font family
            color: "#4B506D", // Customize the input text color if needed
        },
    }
}

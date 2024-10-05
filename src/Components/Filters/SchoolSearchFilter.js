import React, { useEffect, useState, useCallback } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import { useSchoolContext } from '../../Context/SchoolProvider';
import axios from 'axios';

export default function SchoolSearchFilter() {
    const { setLr, isLoading, currentDocument, isEditingRef, isSearchingRef } = useSchoolContext();
    const [input, setInput] = useState('');
    const [lrCopy, setLrCopy] = useState([]);

    const handleInputChange = (event) => {
        isEditingRef.current = true;
        isSearchingRef.current = true;
        setInput(event.target.value); // save input
        setLr(lookup(event.target.value));
    }

    const handleInputBlur = () => {
        //Something after searching
        if (!input) {
            isEditingRef.current = false;
            isSearchingRef.current = false;
        }
    }

    // Get the original copy of the LR
    const getCurrentLr = useCallback(async () => {
        try {
            if (!isLoading && currentDocument.id !== 0) {
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
    }, [currentDocument, setLrCopy, isLoading]);

    const lookup = (keyword) => {
        const obj = lrCopy.filter((item) => {
            // Convert the item to a string by joining its values, and then check if the keyword exists
            return Object.values(item).some(value =>
                value.toString().toLowerCase().includes(keyword.toLowerCase())
            );
        });
        console.log(obj);
        // Check if the filtered result is empty
        if (obj.length === 0) {
            // Return the original array if the keyword didn't match anything
            isEditingRef.current = false;
            isSearchingRef.current = false;
            return lrCopy;
        }
        return obj;
    };

    useEffect(() => {
        getCurrentLr();
    }, [getCurrentLr]);

    return (
        <React.Fragment>
            <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                }}
            >
                <SearchIcon sx={styles.icon} />
                <input
                    name={"lr-search-input"}
                    style={styles.input}
                    placeholder='Search'
                    onChange={(event) => handleInputChange(event)}
                    onBlur={() => handleInputBlur()}
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
        fontFamily: 'Mulish-SemiBold',
        fontSize: '13px',
        color: "#4B506D",
        marginLeft: '5px',
        textTransform: 'none',
        background: "transparent",
        outline: "none",
        border: 'none',
        width: '400px'
    }
}

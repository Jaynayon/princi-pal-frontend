import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export function FieldsFilter() {
    return (
        <React.Fragment>
            <Button variant="text" >
                <FilterAltIcon sx={styles.icon} />
                <Typography
                    noWrap
                    style={styles.description}
                >
                    Filter
                </Typography>
            </Button>
        </React.Fragment>
    )
}

export function DateFilter() {
    return (
        <React.Fragment>
            <Button variant="text">
                <SortIcon sx={styles.icon} />
                <Typography
                    noWrap
                    style={styles.description}
                >
                    Sort by Date
                </Typography>
            </Button>
        </React.Fragment>
    );
}

export function SearchFilter() {
    const [input, setInput] = useState('');

    const handleInputChange = (event) => {
        setInput(event.target.value)
    }

    const handleInputBlur = () => {
        //Something after searching
    }

    useEffect(() => {
        console.log(input)
    }, [input])

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
                    style={styles.input}
                    placeholder='Search'
                    onChange={(event) => handleInputChange(event)}
                    onBlur={handleInputBlur()}
                />
            </Box>
        </React.Fragment>
    );
}

const styles = {
    description: {
        marginLeft: '5px',
        textTransform: 'none',
        fontFamily: 'Mulish-SemiBold',
        fontSize: '13px',
        color: "#4B506D",
    },
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

import React, { useEffect, useState, useRef } from 'react'
import Button from '@mui/material/Button';
import SortIcon from '@mui/icons-material/Sort';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import IconButton from '@mui/material/IconButton';

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
    const theme = useTheme();
    const [button, setButton] = React.useState(false);
    const [date, setDate] = React.useState('January');
    const [year, setYear] = React.useState('2023');

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
            },
        },
    };

    const dates = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = [
        '2023', '2024'
    ];

    function getStyles(name, personName, theme) {
        return {
            fontWeight: "650",
            color:
                personName.indexOf(name) === -1
                    ? null
                    : "#176AF6"
        };
    }

    const handleChangeMonth = (event) => {
        const {
            target: { value },
        } = event;
        setDate(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleChangeYear = (event) => {
        const {
            target: { value },
        } = event;
        setYear(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleClickOutside = (event) => {
        const filterBox = document.getElementById('filterBox');

        if (filterBox && !filterBox.contains(event.target)) {
            setButton(false); // Hide the filter box if clicked outside
        }
    };

    useEffect(() => {
        // Add event listener when component mounts
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Clean up the event listener when component unmounts
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    return (
        <React.Fragment>
            <Box>
                <Button onClick={() => setButton(!button)}>
                    <SortIcon sx={styles.icon} />
                    <Typography noWrap style={styles.description}>
                        Sort by Date
                    </Typography>
                </Button>
                <Paper
                    sx={{
                        display: 'flex',
                        position: 'absolute',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        //width: '340px',
                        height: '80px',
                        paddingLeft: '10px',
                        paddingRight: '10px',
                        backgroundColor: '#f5f5f5',
                        transition: 'opacity 0.15s ease-in-out', // Define transition effect
                        opacity: button ? 1 : 0, // Set opacity based on button state
                        pointerEvents: button ? 'auto' : 'none', // Enable/disable pointer events based on button state
                    }}
                >
                    <IconButton
                        onClick={() => console.log('test')}
                        sx={{
                            //justifyContent: 'flex-end',
                            color: (theme) => theme.navStyle.color
                        }}
                    >
                        <ChevronLeftIcon color='inherit' />
                    </IconButton>
                    <Box sx=
                        {{
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            paddingLeft: '15px',
                            paddingRight: '15px'
                        }}
                    >
                        <FormControl sx={{ m: 1, minWidth: 80, margin: 0 }}>
                            <Select
                                displayEmpty
                                value={date}
                                onChange={handleChangeMonth}
                                MenuProps={MenuProps}
                                sx={{ height: '40px', fontWeight: '900' }}
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                {dates.map((name) => (
                                    <MenuItem
                                        onBlur={() => console.log("menu blurred")}
                                        key={name}
                                        value={name}
                                        style={getStyles(name, date, theme)}
                                    >
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 1, minWidth: 80, margin: 0 }}>
                            <Select
                                displayEmpty
                                value={year}
                                onChange={handleChangeYear}
                                MenuProps={MenuProps}
                                sx={{ height: '40px', fontWeight: '900' }}
                                inputProps={{ 'aria-label': 'Without label' }}
                            >
                                {years.map((name) => (
                                    <MenuItem
                                        onBlur={() => console.log("menu blurred")}
                                        key={name}
                                        value={name}
                                        style={getStyles(name, year, theme)}
                                    >
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                    <IconButton
                        onClick={() => console.log('test')}
                        sx={{
                            //justifyContent: 'flex-end',
                            color: (theme) => theme.navStyle.color
                        }}
                    >
                        <ChevronRightIcon color='inherit' />
                    </IconButton>
                </Paper>
            </Box>
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

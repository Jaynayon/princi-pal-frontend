import React, { useState, useEffect } from 'react';
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
import { useSchoolContext } from '../../Context/SchoolProvider';

export function FieldsFilter() {
    return (
        <Button variant="text">
            <FilterAltIcon sx={styles.icon} />
            <Typography noWrap style={styles.description}>
                Filter
            </Typography>
        </Button>
    );
}

export function DateFilter({ onApply }) {
    const theme = useTheme();
    const [button, setButton] = useState(false);
    const [date, setDate] = useState('');
    //const [year, setYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const { prevMonthRef, prevYearRef, month, setMonth, year, setYear, months, years } = useSchoolContext();

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            },
        },
    };

    const dates = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    /*const years = [
        '2023', '2024'
    ];*/

    
    /*const handleApply = () => {
        setSelectedMonth(date);
        setSelectedYear(year);
        onApply(`${date} ${year}`);
        setButton(false); // Hide the filter box after applying
    };*/

    const getStyles = (name, personName) => ({
        fontWeight: "650",
        color: personName === name ? "#176AF6" : null
    });

    const handleChangeMonth = (event) => {
        const { value } = event.target;
        setDate(value);
    };

    const handleChangeYear = (event) => {
        const { value } = event.target;
        setYear(value);
    };

    const handleClickOutside = (event) => {
        const filterBox = document.getElementById('filterBox');
        if (filterBox && !filterBox.contains(event.target)) {
            setButton(false); 
        }
    };

    const handleClickLeft = () => {
        const currentDate = new Date(`${date} 1, ${year}`);
        currentDate.setMonth(currentDate.getMonth() - 1);

        // Check if the date is January 2023
        if (currentDate.getFullYear() <= 2022) {
            return; // If it's 2022 or earlier, do nothing
        }
        
        
        setDate(dates[currentDate.getMonth()]);
        setYear(String(currentDate.getFullYear()));
    };

    const handleClickRight = () => {
        const currentDate = new Date(`${date} 1, ${year}`);
        currentDate.setMonth(currentDate.getMonth() + 1);
        if (currentDate.getFullYear() >= 2024 && currentDate.getMonth() === 0) {
            return; // If it's January 2024 or later, do nothing
        }
        setDate(dates[currentDate.getMonth()]);
        setYear(String(currentDate.getFullYear()));
    };

    useEffect(() => {
       
        

        // Get current month and year
        const currentDate = new Date();
        const currentMonth = dates[currentDate.getMonth()];
        const currentYear = String(currentDate.getFullYear());

        // Set initial state to current month and year
        setDate(currentMonth);
        setYear(currentYear);

        return () => {
            // Clean up the event listener when component unmounts
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <Box>
            <Button onClick={() => setButton(!button)}>
                <SortIcon sx={styles.icon} />
                <Typography noWrap style={styles.description}>
                    Sort by Date
                </Typography>
            </Button>
            <Paper
                id="filterBox"
                sx={{
                    display: 'flex',
                    position: 'absolute',
                    alignItems: 'center',
                    justifyContent: 'space-between',
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
                    onClick={handleClickLeft}
                    sx={{
                        color: theme.navStyle.color
                    }}
                >
                    <ChevronLeftIcon color='inherit' />
                </IconButton>
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingLeft: '15px',
                    paddingRight: '15px'
                }}>
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
                                    key={name}
                                    value={name}
                                    style={getStyles(name, date)}
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
                                    key={name}
                                    value={name}
                                    style={getStyles(name, year)}
                                >
                                    {name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                <IconButton
                    onClick={handleClickRight}
                    sx={{
                        color: theme.navStyle.color
                    }}
                >
                    <ChevronRightIcon color='inherit' />
                </IconButton>
                
            </Paper>
        </Box>
    );
}

export function SearchFilter() {
    const [input, setInput] = useState('');

    const handleInputChange = (event) => {
        setInput(event.target.value);
    };

    const handleInputBlur = () => {
        // Something after searching
    };

    useEffect(() => {
        console.log(input);
    }, [input]);

    return (
        <Box sx={{ alignItems: 'center', display: 'flex' }}>
            <SearchIcon sx={styles.icon} />
            <input
                style={styles.input}
                placeholder='Search'
                onChange={handleInputChange}
                onBlur={handleInputBlur}
            />
        </Box>
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
};

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
import Popover from '@mui/material/Popover';

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
    const prevMonthRef = useRef(0);
    const prevYearRef = useRef(0);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [month, setMonth] = React.useState('January');
    const [year, setYear] = React.useState('2021');

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
            },
        },
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = [
        '2021', '2022', '2023', '2024'
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

    const handleNextMonth = (event) => {
        prevMonthRef.current += 1;
        if (prevMonthRef.current > months.length - 1) {
            prevMonthRef.current = 0;
            if (prevYearRef.current < years.length - 1) {
                prevYearRef.current += 1;
                setYear(years[prevYearRef.current])
            }
        }
        setMonth(months[prevMonthRef.current]);
    }

    const handlePrevMonth = (event) => {
        prevMonthRef.current -= 1;
        if (prevMonthRef.current < 0) {
            prevMonthRef.current = months.length - 1;
            prevYearRef.current -= 1;
            if (prevYearRef.current < 0) {
                prevYearRef.current = 0;
            }
            setYear(years[prevYearRef.current])
        }
        setMonth(months[prevMonthRef.current]);
    }

    const handleChangeMonth = (event) => {
        const {
            target: { value },
        } = event;
        prevMonthRef.current = months.indexOf(value)
        setMonth(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleChangeYear = (event) => {
        const {
            target: { value },
        } = event;
        prevYearRef.current = years.indexOf(value)
        setYear(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    return (
        <React.Fragment>
            <Box>
                <Button onClick={handleClick}>
                    <SortIcon sx={styles.icon} />
                    <Typography noWrap style={styles.description}>
                        Sort by Date
                    </Typography>
                </Button>
                <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                >
                    <Paper
                        sx={{
                            display: 'flex',
                            //position: 'absolute',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            height: '80px',
                            width: '330px',
                            paddingLeft: '10px',
                            paddingRight: '10px',
                            backgroundColor: '#f5f5f5',
                            transition: 'opacity 0.15s ease-in-out', // Define transition effect
                        }}
                    >
                        <IconButton
                            onClick={handlePrevMonth}
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
                                    value={month}
                                    onChange={handleChangeMonth}
                                    MenuProps={MenuProps}
                                    sx={{
                                        "& .MuiSelect-select": {
                                            padding: '10px', // Adjust input padding
                                            backgroundColor: 'white', // Set input background color
                                            fontWeight: '900', // Set input font weight
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': { border: 0 }
                                    }}
                                    inputProps={{ 'aria-label': 'Without label' }}
                                >
                                    {months.map((name) => (
                                        <MenuItem
                                            onBlur={() => console.log("menu blurred")}
                                            key={name}
                                            value={name}
                                            style={getStyles(name, month, theme)}
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
                                    sx={{
                                        "& .MuiSelect-select": {
                                            padding: '10px', // Adjust input padding
                                            backgroundColor: 'white', // Set input background color
                                            fontWeight: '900', // Set input font weight
                                        },
                                        '& .MuiOutlinedInput-notchedOutline': { border: 0 }
                                    }}
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
                            onClick={handleNextMonth}
                            sx={{
                                //justifyContent: 'flex-end',
                                color: (theme) => theme.navStyle.color
                            }}
                        >
                            <ChevronRightIcon color='inherit' />
                        </IconButton>
                    </Paper>
                </Popover>
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

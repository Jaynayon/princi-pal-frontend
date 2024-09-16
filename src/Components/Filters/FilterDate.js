import React, { useEffect, useState, useCallback } from 'react'
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
import { useSchoolContext } from '../../Context/SchoolProvider';
import axios from 'axios';

export function SchoolFieldsFilter() {
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

export function FilterDate() {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { prevMonthRef, prevYearRef, month, setMonth, year, setYear, months, years } = useSchoolContext();

    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP
            },
        },
    };

    function getStyles(name, personName, theme) {
        return {
            fontWeight: "650",
            color:
                personName.indexOf(name) === -1
                    ? null
                    : "#176AF6"
        };
    }

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

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
        const { value } = event.target;
        prevMonthRef.current = months.indexOf(value);
        setMonth(value); // Set the value directly
    };

    const handleChangeYear = (event) => {
        const { value } = event.target;
        prevYearRef.current = years.indexOf(value);
        setYear(value); // Set the value directly
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

export function SchoolSearchFilter() {
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
                const response = await axios.get(`${process.env.REACT_APP_API_URL_LR}/documents/${currentDocument.id}`);
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

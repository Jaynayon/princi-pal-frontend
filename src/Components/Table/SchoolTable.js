import {
    Box,
    Paper,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Table,
    TablePagination,
    Button,
    Menu,
    MenuItem,
    TextField,
    InputAdornment
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import ResetBudgetModal from '../Modal/ResetBudgetModal';
import CreateSchoolModal from '../Modal/CreateSchoolModal';

const columns = [
    {
        id: 'name',
        label: 'Name',
        minWidth: 200,
        maxWidth: 140,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'fullName',
        label: 'Full  Name',
        minWidth: 150,
        maxWidth: 150,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    }
];

export default function SchoolTable(props) {
    const [open, setOpen] = useState(false);
    const [openReset, setOpenReset] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const [schools, setSchools] = useState([]);
    const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [input, setInput] = useState('');

    const handleModalOpen = () => {
        setOpen(true);
    }

    const handleModalClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleModalResetClose = useCallback(() => {
        setOpenReset(false);
    }, []);

    const handleMenuClose = useCallback(() => {
        setDeleteAnchorEl(null);
        setSelectedIndex(null);
    }, []);

    const handleDeleteOpen = (event, index) => {
        setDeleteAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleInputChange = (event) => {
        setInput(event.target.value);
    }

    const handleClearInput = () => {
        setInput("");
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const fetchSchools = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL_SCHOOL}/all`, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                }
            });
            setSchools(response.data);
        } catch (e) {
            console.error(e);
        }
    }, []);

    useEffect(() => {
        fetchSchools();
    }, [fetchSchools]);

    // Filtered rows based on search value
    const filteredRows = schools.filter(row =>
        (row && row.name && row.name.toLowerCase().includes(input.toLowerCase())) ||
        (row && row.fullName && row.fullName.toLowerCase().includes(input.toLowerCase()))
    );

    return (
        <React.Fragment>
            <Paper sx={{
                display: 'flex',
                justifyContent: "space-between",
                marginBottom: '10px',
                width: "100%",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" // Bottom shadow
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton sx={{ mr: 5 }} onClick={() => handleModalOpen()}>
                        <AddCircleIcon sx={{ fontSize: "40px", color: "#20A0F0" }} />
                    </IconButton>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "row" }}>
                    <Box
                        sx={{
                            alignItems: 'center',
                            display: 'flex',
                            backgroundColor: "#f2f2f2",
                            borderRadius: '20px',
                            m: 1,
                            pl: 1
                        }}
                    >
                        <SearchIcon sx={styles.icon} />
                        <TextField
                            sx={styles.input}
                            variant='standard'
                            name={"school-search-input"}
                            placeholder='Search'
                            value={input}
                            // onClick={() => handleInputClick()}
                            onChange={(event) => handleInputChange(event)}
                            // onBlur={() => handleInputBlur()}
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
                    <TablePagination
                        sx={{ display: "flex", alignItems: "center" }}
                        rowsPerPageOptions={[4, 10, 25, 100]}
                        component="div"
                        count={schools.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Box>

            </Paper>
            <Paper
                sx={{
                    width: "100%",
                    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" // Bottom shadow
                }}
            >
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredRows
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, rowIndex) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={`row_${row.code || rowIndex}`}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={`${column.id}_${row.id}`} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell>
                                                <Box sx={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    justifyContent: "center",
                                                    width: 40
                                                }}>
                                                    <Button
                                                        aria-controls={`principal-button-delete-${rowIndex}`}
                                                        aria-haspopup="true"
                                                        onClick={(event) => handleDeleteOpen(event, rowIndex)}
                                                    >
                                                        <MoreHorizIcon />
                                                    </Button>
                                                    <Menu
                                                        id={`principal-menu-delete-${rowIndex}`}
                                                        anchorEl={deleteAnchorEl}
                                                        open={Boolean(deleteAnchorEl && selectedIndex === rowIndex)}
                                                        onClose={handleMenuClose}
                                                    >
                                                        <MenuItem onClick={() => setOpenReset(true)}>Reset</MenuItem>
                                                    </Menu>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <CreateSchoolModal
                open={open}
                handleClose={handleModalClose}
                fetchSchools={fetchSchools}
            />
            <ResetBudgetModal
                open={openReset}
                currentSchool={filteredRows[selectedIndex]}
                handleClose={handleModalResetClose}
                handleMenuClose={handleMenuClose}
            />
        </React.Fragment >
    );
}

const styles = {
    icon: {
        color: "#C5C7CD",
        background: "transparent",
    },
    input: {
        marginLeft: '5px',
        background: "transparent",
        width: '200px',
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
import React from 'react';
import {
    Paper,
    Tabs,
    Tab,
    Box,
    Modal,
    Backdrop,
    Fade,
    TextField,
    Typography,
    Button,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
} from '@mui/material';

import { useSchoolContext } from '../../Context/SchoolProvider';
// import { useNavigationContext } from '../../Context/NavigationProvider';

import { CustomTabPanel, a11yProps } from '../../Pages/SchoolPage';
import ConfirmModal from './ConfirmModal';

export default function BudgetModal() {
    const { month, year, currentSchool, currentDocument, jev, setJev } = useSchoolContext();
    const [open, setOpen] = React.useState(false);
    const [amount, setAmount] = React.useState(0)
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [tab, setTab] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(4);
    const [page, setPage] = React.useState(0);
    const [inputValue, setInputValue] = React.useState('Initial Value');
    const [editingCell, setEditingCell] = React.useState({ colId: null, rowId: null });
    const [initialValue, setInitialValue] = React.useState(''); //only request update if there is changes in initial value

    const columns = [
        {
            id: 'uacsName',
            label: 'Accounts & Explanations',
            minWidth: 120,
            maxWidth: 120,
            align: 'left',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'uacsCode',
            label: 'Code',
            minWidth: 100,
            maxWidth: 100,
            align: 'left',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'budget',
            label: 'Budget',
            minWidth: 90,
            maxWidth: 90,
            fontWeight: "bold",
            align: 'left',
            format: (value) => value.toLocaleString('en-US'),
        }
    ];

    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const handleConfirmClose = () => setConfirmOpen(false)

    const handleChange = (event) => {
        const value = event.target.value;
        const regex = /^[0-9]*$/;

        if (regex.test(value)) {
            setAmount(value);
        }
    }

    const handleChangeTab = (event, newTab) => {
        setTab(newTab);
    };

    const handleCellClick = (colId, rowId, event) => {
        setEditingCell({ colId, rowId });
        setInitialValue(event.target.value); // Save the initial value of the clicked cell
        setInputValue(event.target.value); // Set input value to the current value
        console.log(editingCell)
        console.log('row Id: ' + rowId + " and col Id: " + colId)
    };

    const handleInputChange = (colId, rowId, event) => {
        let modifiedValue = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

        // Find the index of the object with matching id
        const rowIndex = jev.findIndex(row => row.id === rowId);

        if (rowIndex !== -1) {
            // Copy the array to avoid mutating state directly
            const updatedRows = [...jev];

            // Update the specific property of the object
            updatedRows[rowIndex][colId] = modifiedValue;

            // Update the state with the modified rows
            setJev(updatedRows);
            setInputValue(updatedRows[rowIndex][colId]); // Update inputValue if needed
        } else {
            console.error(`Row with id ${rowId} not found`);
        }
    };

    const handleInputBlur = (colId, rowId) => {
        setEditingCell(null);
        // Perform any action when input is blurred (e.g., save the value)
        if (inputValue !== initialValue) {
            console.log(`Wow there is changes in col: ${colId} and row: ${rowId}`);
            // updateJevById(colId, rowId, inputValue);
        }
        console.log('Value saved:', inputValue);
    };

    React.useEffect(() => {
        if (currentDocument) {
            setAmount(currentDocument.cashAdvance)
        }
        // Disable and set to first tab if document/jev not initialized
        if (Array.isArray(jev) && jev.length === 0 && tab === 1) {
            setTab(0);
            setPage(0);
        }
    }, [currentDocument, month, year, jev, tab, setTab, setPage]) // Add month and year as dependency to reload component

    const formatNumberDisplay = (number, colId, rowId) => {
        //if (typeof number !== 'number') return ''; // Handle non-numeric values gracefully
        if (editingCell?.colId === colId && editingCell?.rowId === rowId) {
            return number > 0 ? number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ""; // Return the number if it's greater than 0, otherwise return an empty string
        }
        return number > 0 ? number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage); // Update the page state with the new page value
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10)); // Update rowsPerPage state with the new value
        setPage(0); // Reset page to 0 whenever rows per page changes
    };

    return (
        <React.Fragment>
            <Button
                sx={[{ minWidth: "90px" }, open && { fontWeight: 'bold' }]}
                onClick={handleOpen}
            >
                Budget
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
            >
                <Fade in={open}>
                    <Paper sx={[styles.paper, { paddingTop: 3 }]}>
                        <Box>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    sx={{ minHeight: '10px' }}
                                    value={tab}
                                    onChange={handleChangeTab}
                                    aria-label="basic tabs example"
                                >
                                    <Tab sx={styles.tab} label="Budget" {...a11yProps(0)} />
                                    <Tab
                                        sx={styles.tab}
                                        label="UACS"
                                        {...a11yProps(1)}
                                        disabled={(Array.isArray(jev) && jev.length === 0)}
                                    />
                                    <Tab sx={styles.tab} label="Annual" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={tab} index={0}>
                                <Typography id="modal-modal-description" sx={{ mt: 1, mb: .5 }}>
                                    Set the budget required or delegated for the month of
                                    <span style={{ fontWeight: 'bold' }}> {month}</span> in
                                    <span style={{ fontWeight: 'bold' }}> {currentSchool?.name}</span>.
                                </Typography>
                                <TextField
                                    sx={{ alignSelf: "center", mt: 2, mb: .5, width: "100%" }}
                                    type="text"
                                    value={amount || 0}
                                    disabled={!!currentDocument?.cashAdvance} // Convert to boolean; Disabled if cash advance already set
                                    onChange={(event) => handleChange(event)}
                                    label="Input Amount"
                                />
                                <Button sx={styles.button}
                                    onClick={() => setConfirmOpen(true)}
                                    variant="contained"
                                    disabled={!!currentDocument?.cashAdvance} >
                                    Save
                                </Button>
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={1} sx={{ display: false }}>
                                <Typography id="modal-modal-description" sx={{ mt: 1, mb: .5 }}>
                                    Set a projected budget for various expense categories under UACS in
                                    <span style={{ fontWeight: 'bold' }}> {month}</span> at
                                    <span style={{ fontWeight: 'bold' }}> {currentSchool?.name}</span>.
                                </Typography>
                                <TableContainer sx={{ mt: 2, maxHeight: 280 }}>
                                    <Table stickyHeader aria-label="sticky table">
                                        <TableHead>
                                            <TableRow>
                                                {columns.map((column) => (
                                                    <TableCell
                                                        key={column.id}
                                                        align={column.align}
                                                        style={{
                                                            minWidth: column.minWidth,
                                                            maxWidth: column.maxWidth,
                                                            lineHeight: 1.2,
                                                            padding: "0px",
                                                            paddingBottom: "10px"
                                                        }}
                                                    >
                                                        {column.label}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody >
                                            {jev
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => {
                                                    const uniqueKey = `row_${row.id}_${index}`;
                                                    return (
                                                        <TableRow key={uniqueKey} hover role="checkbox" tabIndex={-1}>
                                                            {columns.map((column) => {
                                                                const value = row[column.id];

                                                                return (
                                                                    <TableCell
                                                                        key={column.id}
                                                                        align={column.align}
                                                                        sx={[
                                                                            styles.cell,
                                                                            {
                                                                                minWidth: column.minWidth,
                                                                                maxWidth: column.maxWidth,
                                                                                fontSize: column.fontSize,
                                                                                padding: "0px",
                                                                                paddingBottom: "5px",
                                                                                paddingTop: "5px"
                                                                            }
                                                                        ]}
                                                                    // onClick={(event) => handleCellClick(column.id, row.id, event)}
                                                                    >
                                                                        {/*Budget field*/}
                                                                        {column.id === "budget" ?
                                                                            <TextField
                                                                                variant="standard"
                                                                                value={formatNumberDisplay(value, column.id, row.id)}
                                                                                inputProps={{
                                                                                    inputMode: 'numeric', // For mobile devices to show numeric keyboard
                                                                                    pattern: '[0-9]*',    // HTML5 pattern to restrict input to numeric values
                                                                                }}
                                                                                InputProps={{
                                                                                    startAdornment: (
                                                                                        <InputAdornment position="start">
                                                                                            ₱{/* Replace this with your desired currency symbol */}
                                                                                        </InputAdornment>
                                                                                    ),
                                                                                    style: {
                                                                                        display: 'flex',
                                                                                        alignItems: 'center',
                                                                                        flexDirection: 'row',
                                                                                        justifyContent: "flex-start",
                                                                                        fontWeight: "bold",
                                                                                        borderRadius: 10,
                                                                                        fontSize: 13,
                                                                                        height: 35,
                                                                                    }
                                                                                }}
                                                                                onClick={(event) => handleCellClick(column.id, row.id, event)}
                                                                                onChange={(event) =>
                                                                                    handleInputChange(column.id, row.id, event)
                                                                                }
                                                                                onBlur={() => handleInputBlur(column.id, row.id)}
                                                                                onKeyDown={(e) => {
                                                                                    if (e.key === 'Enter') {
                                                                                        e.preventDefault();
                                                                                        e.target.blur(); // Invoke handleLogin on Enter key press
                                                                                    }
                                                                                }}
                                                                            />
                                                                            :
                                                                            /*Account Type field*/
                                                                            column.id === "uacsCode" ?
                                                                                /*Object Code*/
                                                                                <Box sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    padding: "0px",
                                                                                }}>
                                                                                    {value}
                                                                                </Box>
                                                                                :
                                                                                /*Accounts and Explanations*/
                                                                                <Box sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    padding: "0px",
                                                                                    paddingRight: "10px"
                                                                                }}>
                                                                                    {value}
                                                                                </Box>
                                                                        }
                                                                    </TableCell>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>

                                </TableContainer>
                                <TablePagination
                                    sx={{
                                        '& .MuiToolbar-root': {
                                            padding: 0,
                                            overflowX: "hidden"
                                        },
                                        '& .MuiInputBase-root': { marginLeft: 0 },
                                        '& .MuiTablePagination-actions': { marginLeft: 2 },
                                    }}
                                    rowsPerPageOptions={[4, 10, 25]}
                                    component="div"
                                    count={jev.length}
                                    rowsPerPage={rowsPerPage}
                                    page={Math.min(page, Math.floor(jev.length / rowsPerPage))}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={2}>
                                <Typography id="modal-modal-description" sx={{ mt: 1, mb: .5 }}>
                                    Set the budget required or delegated each month of the fiscal year at
                                    <span style={{ fontWeight: 'bold' }}> {currentSchool?.name}</span>.
                                </Typography>
                            </CustomTabPanel>
                        </Box>
                        <ConfirmModal
                            open={confirmOpen}
                            handleClose={handleConfirmClose}
                            handleCloseParent={handleClose}
                            value={amount || 0} />
                    </Paper>
                </Fade>
            </Modal>
        </React.Fragment >
    );
}

const styles = {
    header: {
        overflow: 'auto', //if overflow, hide it
        overflowWrap: "break-word",
        fontFamily: 'Mulish-Regular',
        buttons: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '650px', //adjust the container
            //position: 'relative'
        }
    },
    container: {
        overflow: 'hidden',
        padding: "10px",
        paddingTop: "10px"
    },
    tab: {
        minHeight: '10px',
        '&.Mui-selected': {
            color: 'black', // Color of selected tab
            fontWeight: 'bold', // Font weight of selected tab
        },
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: 24,
        p: 4.5,
        width: 400,
        borderRadius: '15px',
        //textAlign: 'center',
    },
    button: {
        mt: 2,
        borderRadius: '10px',
        width: '160px',
        padding: '10px 0',
        alignSelf: "center",
        backgroundColor: '#19B4E5', // Default background color for enabled button
        color: 'white', // Default text color for enabled button
        '&:hover': {
            backgroundColor: '#19a2e5', // Background color on hover
        },
        '&.Mui-disabled': {
            backgroundColor: '#e0e0e0', // Background color when disabled
            color: '#c4c4c4', // Text color when disabled
        }
    }
}

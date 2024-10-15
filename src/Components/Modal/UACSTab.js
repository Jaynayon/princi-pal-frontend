import React from 'react';
import {
    Box,
    TextField,
    Typography,
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
// import { useNavigationContext } from '../../Context/NavigationProvider';\

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

export default function UACSTab() {
    const { month, year, currentSchool, currentDocument, jev, setJev, updateJevById, isEditingRef } = useSchoolContext();
    const [rowsPerPage, setRowsPerPage] = React.useState(4);
    const [page, setPage] = React.useState(0);
    const [inputValue, setInputValue] = React.useState('Initial Value');
    const [editingCell, setEditingCell] = React.useState({ colId: null, rowId: null });
    const [initialValue, setInitialValue] = React.useState(''); //only request update if there is changes in initial value

    React.useEffect(() => {
        // Disable and set to first tab if document/jev not initialized
        if (Array.isArray(jev) && jev.length === 0) {
            setPage(0);
        }
    }, [currentDocument, month, year, jev, setPage])

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

        isEditingRef.current = true;

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

    const handleInputBlur = async (colId, rowId) => {
        setEditingCell(null);
        isEditingRef.current = false;
        // Perform any action when input is blurred (e.g., save the value)
        if (inputValue !== initialValue) {
            console.log(`Wow there is changes in col: ${colId} and row: ${rowId}`);
            await updateJevBudgetById(colId, rowId, inputValue);
        }
        console.log('Value saved:', inputValue);
    };

    const updateJevBudgetById = async (colId, rowId, value) => {
        try {
            const response = await updateJevById(colId, rowId, value);
            if (response) {
                console.log(`LR with id: ${rowId} is updated`);
            } else {
                console.log("LR not updated");
            }
            // fetchDocumentData();
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    const formatNumberDisplay = (number, colId, rowId) => {
        //if (typeof number !== 'number') return ''; // Handle non-numeric values gracefully
        if (editingCell?.colId === colId && editingCell?.rowId === rowId) {
            return number > 0 ? number : ""; // Return the number if it's greater than 0, otherwise return an empty string
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
                                                    sx={
                                                        {
                                                            minWidth: column.minWidth,
                                                            maxWidth: column.maxWidth,
                                                            fontSize: column.fontSize,
                                                            padding: "0px",
                                                            paddingBottom: "5px",
                                                            paddingTop: "5px"
                                                        }
                                                    }
                                                >
                                                    {/*Budget field*/}
                                                    {column.id === "budget" ?
                                                        <TextField
                                                            variant="standard"
                                                            // Disable editing cash advance operating expenses
                                                            disabled={row.uacsCode === "1990101000"}
                                                            value={
                                                                row.uacsCode === "1990101000" ?
                                                                    row.amount :
                                                                    formatNumberDisplay(value, column.id, row.id)
                                                            }
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
        </React.Fragment>
    );
}
import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from "@mui/material";
import { useSchoolContext } from '../../Context/SchoolProvider';
import Box from '@mui/material/Box';
// import { useNavigationContext } from '../../Context/NavigationProvider';
import Button from '@mui/material/Button';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuItem from '@mui/material/MenuItem';
import { Menu, TextField } from '@mui/material';
import RestService from '../../Services/RestService';
import IconButton from "@mui/material/IconButton";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UacsDateFilter from '../Filters/UacsDateFilter';

function RecordsRow(props) {
    const { page, rowsPerPage } = props;
    const [editingCell, setEditingCell] = useState({ colId: null, rowId: null });
    const [inputValue, setInputValue] = useState('Initial Value');
    const [initialValue, setInitialValue] = useState(''); //only request update if there is changes in initial value
    const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);

    const {
        displayFields,
        isAdding,
        currentDocument,
        lr,
        setLr,
        fetchDocumentData,
        setReload,
        reload,
        value,
        createNewDocument,
        jev
    } = useSchoolContext();

    useEffect(() => {
        console.log("RecordsRow useEffect")
        if (isAdding === true && value === 0) { // applies only to LR & RCD tab: value = 0
            displayFields(isAdding);
        }
    }, [isAdding, displayFields, value]);

    const handleCellClick = (colId, rowId, event) => {
        setEditingCell({ colId, rowId });
        setInitialValue(event.target.value); // Save the initial value of the clicked cell
        setInputValue(event.target.value); // Set input value to the current value
        console.log(editingCell)
        console.log('row Id: ' + rowId + " and col Id: " + colId)
    };

    const handleDeleteOpen = (event, index) => {
        setDeleteAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleMenuClose = () => {
        setDeleteAnchorEl(null);
        setSelectedIndex(null);
    };

    const handleDelete = async (rowId) => {
        // Implement delete functionality here
        console.log("Delete button clicked for row at index:", selectedIndex);
        console.log("Delete lr id: " + rowId)
        deleteLrByid(rowId);
        handleMenuClose();
    };

    const deleteLrByid = async (rowId) => {
        try {
            const response = await RestService.deleteLrById(rowId);
            if (response) {
                console.log(`LR with id: ${rowId} is deleted`);
            } else {
                console.log("LR not deleted");
            }
            fetchDocumentData();
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    };

    const updateLrById = async (colId, rowId, value) => {
        try {
            const response = await RestService.updateLrById(colId, rowId, value);
            if (response) {
                console.log(`LR with id: ${rowId} is updated`);
            } else {
                console.log("LR not updated");
            }
            fetchDocumentData();
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    const createLrByDocumentId = async (doc_id, obj) => {
        try {
            const response = await RestService.createLrByDocId(doc_id, obj);
            if (response) {
                console.log(`LR is created`);
            } else {
                console.log("LR not created");
            }
            fetchDocumentData();
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    //If lr length is greater than one; reload to fetch documents and lr createLrByDocId
    //else, set lr to empty
    const handleNewRecordCancel = async () => {
        console.log("cancel");
        if (lr.length > 1) {
            await fetchDocumentData();
        } else {
            setReload(!reload); //just to reload school.js to fetch lr data
        }
    }

    //Find the index of the lr row where id == 3 and push that value to db
    const handleNewRecordAccept = async (rowId) => {
        console.log("accept");
        const rowIndex = lr.findIndex(row => row.id === rowId);
        // jev length upon initialization will always be > 2
        if (jev.length < 2) { //if there's no current document or it's not yet existing
            createNewDocument(lr[rowIndex]);
        }
        await createLrByDocumentId(currentDocument.id, lr[rowIndex]);
    }

    const handleInputChange = (colId, rowId, event) => {
        let modifiedValue = event.target.value
        // Find the index of the object with matching id
        const rowIndex = lr.findIndex(row => row.id === rowId);

        if (colId === "amount") {
            // Replace any characters that are not digits or periods
            modifiedValue = modifiedValue.replace(/[^0-9.]/g, '');
        }

        if (rowIndex !== -1) {
            // Copy the array to avoid mutating state directly
            const updatedRows = [...lr];

            // Update the specific property of the object
            updatedRows[rowIndex][colId] = modifiedValue;

            // Update the state with the modified rows
            setLr(updatedRows);
            setInputValue(updatedRows[rowIndex][colId]); // Update inputValue if needed
        } else {
            console.error(`Row with id ${rowId} not found`);
        }
    };

    const handleInputBlur = async (colId, rowId) => {
        setEditingCell(null);
        // Perform any action when input is blurred (e.g., save the value)
        // Only applies if it's not the new row
        if (rowId !== 3) {
            if (inputValue !== initialValue) {
                console.log(`Wow there is changes in col: ${colId} and row: ${rowId}`);
                await updateLrById(colId, rowId, inputValue);
            }
            console.log('Value saved:', inputValue);
        }
    };

    // Function to format a number with commas and two decimal places
    const formatNumber = (number, colId, rowId) => {
        //if (typeof number !== 'number') return ''; // Handle non-numeric values gracefully
        if (editingCell?.colId === colId && editingCell?.rowId === rowId)
            return number;
        return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <React.Fragment>
            {lr
                .slice(page * rowsPerPage, page * props.rowsPerPage + props.rowsPerPage)
                .map((row, index) => {
                    const uniqueKey = `row_${row.id}_${index}`;
                    return (
                        <TableRow key={uniqueKey} hover role="checkbox" tabIndex={-1}>
                            {props.columns.map((column) => {
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
                                            }
                                        ]}
                                        onClick={(event) => handleCellClick(column.id, row.id, event)}
                                    >
                                        {/*UACS field*/}
                                        {column.id === "objectCode" ?
                                            <Box sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}>
                                                <UacsDateFilter
                                                    value={value} // objectCode value
                                                    rowId={row.id} // lr id
                                                    handleInputChange={handleInputChange} //handle input change on current row
                                                />
                                            </Box>
                                            :
                                            <Box
                                                style={
                                                    editingCell &&
                                                        editingCell.colId === column.id &&
                                                        editingCell.rowId === row.id &&
                                                        row.id !== 3
                                                        ? styles.divInput
                                                        : null
                                                }
                                            >
                                                <TextField
                                                    //variant='standard'
                                                    value={column.id === "amount" ? formatNumber(value, column.id, row.id) : value}

                                                    sx={{
                                                        "& fieldset": { border: row.id !== 3 && 'none' }
                                                    }}
                                                    InputProps={{
                                                        //disableUnderline: true,
                                                        style: {
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            flexDirection: 'row',
                                                            justifyContent: "flex-start",
                                                            fontSize: 14,
                                                            height: 40
                                                        }
                                                    }}
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
                                            </Box>
                                        }
                                    </TableCell>
                                );
                            })}
                            <TableCell>
                                {/* Conditional rendering based on row.id */}
                                {row.id === 3 ? (
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        width: 65
                                    }}>
                                        <IconButton onClick={() => handleNewRecordAccept(row.id)}>
                                            <CheckCircleIcon sx={{
                                                color: 'green'
                                            }} />
                                        </IconButton>
                                        <IconButton onClick={() => handleNewRecordCancel()}>
                                            <CancelIcon sx={{
                                                color: 'red'
                                            }} />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Box sx={{
                                        display: "flex",
                                        flexDirection: "row",
                                        justifyContent: "center",
                                        width: 40
                                    }}>
                                        {/* Delete button */}
                                        <Button
                                            aria-controls={`menu-delete-${index}`}
                                            aria-haspopup="true"
                                            onClick={(event) => handleDeleteOpen(event, index)}
                                        >
                                            <MoreHorizIcon />
                                        </Button>
                                        {/* Delete menu */}
                                        <Menu
                                            id={`menu-delete-${index}`}
                                            anchorEl={deleteAnchorEl}
                                            open={Boolean(deleteAnchorEl && selectedIndex === index)}
                                            onClose={handleMenuClose}
                                        >
                                            <MenuItem onClick={() => handleDelete(row.id)}>Delete</MenuItem>
                                        </Menu>
                                    </Box>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}

        </React.Fragment>
    );
}

const styles = {
    cell: {
        fontFamily: "Mulish",
        fontWeight: "bold",
        height: "35px",
    },
    inputStyling: {
        fontFamily: "Mulish-SemiBold",
        fontSize: "12px",
        background: "transparent",
        outline: "none",
        border: 'none',
    },
    divInput: {
        borderRadius: "8px",
        border: "1px solid #ccc",
        background: "transparent",
        outline: "none",
    }
}

export default RecordsRow;
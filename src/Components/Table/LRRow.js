import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from "@mui/material";
import { useSchoolContext } from '../../Context/SchoolProvider';
import Box from '@mui/material/Box';
// import { useNavigationContext } from '../../Context/NavigationProvider';
import Button from '@mui/material/Button';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuItem from '@mui/material/MenuItem';
import { Menu, TextField } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UacsSelect from '../Select/UacsSelect';
import HistoryModal from '../Modal/HistoryModal';
import LRDate from '../Picker/LRDate';
import "react-datepicker/dist/react-datepicker.css";
import NatureOfPaymentSelect from '../Select/NatureOfPaymentSelect';

function LRRow(props) {
    const { page, rowsPerPage } = props;
    const [editingCell, setEditingCell] = useState({ colId: null, rowId: null });
    const [inputValue, setInputValue] = useState('Initial Value');
    const [initialValue, setInitialValue] = useState(''); //only request update if there is changes in initial value
    const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [open, setOpen] = useState(false);
    const [error, setError] = useState(true);

    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const {
        addFields,
        formatDate,
        isAdding,
        isEditingRef,
        isEditable,
        currentDocument,
        lr,
        updateLrById,
        deleteLrByid,
        setLr,
        fetchDocumentData,
        createLrByDocId,
        value
    } = useSchoolContext();

    const createLrByDocumentId = async (doc_id, obj) => {
        try {
            const response = await createLrByDocId(doc_id, obj);
            if (response) {
                console.log(`LR is created`);
            } else {
                console.log("LR not created");
            }
            await fetchDocumentData();
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    const handleCellClick = (colId, rowId, event) => {
        isEditingRef.current = true; // user clicked a cell
        setEditingCell({ colId, rowId });
        setInitialValue(event.target.value); // Save the initial value of the clicked cell
        setInputValue(colId === "date" ? event : event.target.value); // Set input value to the current value
        console.log(editingCell)
        console.log('row Id: ' + rowId + " and col Id: " + colId)
    };

    const handleBlurCell = () => {
        isEditingRef.current = false;
    }

    const handleDeleteOpen = (event, index) => {
        setDeleteAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleMenuClose = () => {
        setDeleteAnchorEl(null);
        setSelectedIndex(null);
    };

    const handleDelete = async (rowId) => {
        await deleteLrByid(rowId);
        handleMenuClose();
    };

    // Fetch document data to get Document and LR; reload
    const handleNewRecordCancel = async () => {
        await fetchDocumentData();
    }

    //Find the index of the lr row where id == 3 and push that value to db
    const handleNewRecordAccept = async (rowId) => {
        if (!error) {
            const rowIndex = lr.findIndex(row => row.id === rowId);
            await createLrByDocumentId(currentDocument.id, lr[rowIndex]);
        }
    }

    const handleInputChange = async (colId, rowId, event) => {
        let modifiedValue = colId === "date" ? formatDate(event) : event.target.value

        // Find the index of the object with matching id
        const rowIndex = lr.findIndex(row => row.id === rowId);

        if (colId === "amount") {
            // Replace any characters that are not digits or periods
            modifiedValue = modifiedValue.replace(/[^0-9.]/g, '');
            console.log(modifiedValue)
            if (modifiedValue === 0 || modifiedValue === "" || !modifiedValue) {
                setError(true);
            } else {
                setError(false);
            }
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
        const formattedNumber = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
        if (editingCell?.colId === colId && editingCell?.rowId === rowId) {
            return number > 0 ? number : ""; // Return the number if it's greater than 0, otherwise return an empty string
        }
        return (`₱${formattedNumber}`);
    };

    const isError = (colId, rowId, value) => {
        if (colId === "amount" && rowId === 3) {
            if (value === "" || value === 0 || !value) {
                return true;
            }
        }
        return false;
    }

    useEffect(() => {
        console.log("RecordsRow useEffect")
        if (isAdding === true && value === 0) { // applies only to LR & RCD tab: value = 0
            setError(true); // set error to true by default per LR adding
            addFields(isAdding);
        }
    }, [isAdding, addFields, value]);

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
                                const selectedDate = value ? new Date(value) : new Date();

                                return (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        sx={[
                                            styles.cell,
                                            {
                                                minWidth: column.minWidth,
                                                maxWidth: column.maxWidth,
                                                pointerEvents: !isEditable && 'none' // disallow editing
                                            }
                                        ]}
                                        onClick={(event) => handleCellClick(column.id, row.id, event)}
                                        onBlur={() => handleBlurCell()}
                                    >
                                        {(() => {
                                            const isNatureOfPayment = column.id === "natureOfPayment";
                                            const isObjectCodeColumn = column.id === "objectCode";
                                            const isDateColumn = column.id === "date";
                                            const isEditing = editingCell?.colId === column.id && editingCell?.rowId === row.id && row.id !== 3;

                                            if (isDateColumn) {
                                                return (
                                                    <LRDate
                                                        selected={selectedDate}
                                                        colId={column.id}
                                                        rowId={row.id}
                                                        onChange={handleInputChange}
                                                    />
                                                );
                                            }

                                            if (isObjectCodeColumn) {
                                                return (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <UacsSelect
                                                            name={`lr-uacs-select-${lr?.id}`}
                                                            value={value} // objectCode value
                                                            rowId={row.id} // lr id
                                                            handleInputChange={handleInputChange} //handle input change on current row
                                                        />
                                                    </Box>
                                                );
                                            }

                                            if (isNatureOfPayment) {
                                                return (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <NatureOfPaymentSelect
                                                            name={`lr-nature-payment-select-${lr?.id}`}
                                                            value={value} // natureOfPayment value
                                                            rowId={row.id} // lr id
                                                            handleInputChange={handleInputChange} //handle input change on current row
                                                        />
                                                    </Box>
                                                );
                                            }

                                            return (
                                                <Box style={isEditing ? styles.divInput : null}>
                                                    <TextField
                                                        id={lr?.id}
                                                        value={column.id === "amount" ? formatNumber(value, column.id, row.id) : value}
                                                        error={isError(column.id, row.id, value)}
                                                        helperText={isError(column.id, row.id, value) && "Empty field"}
                                                        sx={{ "& fieldset": { border: row.id !== 3 && 'none' } }}
                                                        FormHelperTextProps={{
                                                            style: { position: "absolute", bottom: "-20px" },
                                                        }}
                                                        InputProps={{
                                                            style: {
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                flexDirection: 'row',
                                                                justifyContent: "flex-start",
                                                                fontSize: 14,
                                                                height: 40,
                                                            },
                                                        }}
                                                        onChange={(event) =>
                                                            handleInputChange(column.id, row.id, event)
                                                        }
                                                        onBlur={() => handleInputBlur(column.id, row.id)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                e.target.blur(); // Blur input on Enter key press
                                                            }
                                                        }}
                                                    />
                                                </Box>
                                            );
                                        })()}
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
                                            <MenuItem onClick={() => handleOpen()}>History</MenuItem>
                                            <MenuItem
                                                disabled={!isEditable}
                                                sx={{ color: "red" }}
                                                onClick={() => handleDelete(row.id)}
                                            >
                                                Delete
                                            </MenuItem>
                                        </Menu>
                                    </Box>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
            <HistoryModal open={open} handleClose={handleClose} handleCloseParent={handleMenuClose} index={selectedIndex} />
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
        boxShadow: "0 0 0 2px #1976d2",
        background: "transparent",
        outline: "none",
    }
}

export default LRRow;
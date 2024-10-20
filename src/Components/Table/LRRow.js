import React, { memo, useEffect, useState } from 'react';
import { TableCell, TableRow } from "@mui/material";
import Box from '@mui/material/Box';
// import { useNavigationContext } from '../../Context/NavigationProvider';
import Button from '@mui/material/Button';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuItem from '@mui/material/MenuItem';
import { Menu } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UacsSelect from '../Select/UacsSelect';
import HistoryModal from '../Modal/HistoryModal';
import LRDate from '../Picker/LRDate';
import "react-datepicker/dist/react-datepicker.css";
import NatureOfPaymentSelect from '../Select/NatureOfPaymentSelect';
import LRTextField from '../Input/LRTextField';
import ExceedWarningModal from '../Modal/ExceedWarningModal';

const LRRow = memo((props) => {
    const {
        page,
        rowsPerPage,
        columns,
        addFields,
        formatDate,
        isAdding,
        setIsAdding,
        isEditingRef,
        isEditable,
        lr,
        deleteLrByid,
        setLr,
        updateLr,
        createLrByDocId,
        currentDocument,
        fetchDocumentData,
        value
    } = props;

    console.log("RecordsRow.js")

    const [editingCell, setEditingCell] = useState({ colId: null, rowId: null });
    const [amountExceeded, setAmountExceeded] = useState({ docId: null, colId: null, rowId: null, exceeded: null, newValue: null });

    const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [open, setOpen] = useState(false);
    const [warningOpen, setWarningOpen] = useState(false);
    const [error, setError] = useState(true);

    const handleWarningOpen = () => setWarningOpen(true);

    const handleWarningClose = () => setWarningOpen(false);

    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

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

    const handleCellClick = (colId, rowId) => {
        isEditingRef.current = true; // user clicked a cell
        setEditingCell({ colId, rowId });
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
        await updateLr();
        handleMenuClose();
    };

    // Fetch document data to get Document and LR; reload
    const handleNewRecordCancel = async () => {
        setIsAdding(false); //reset state to allow addFields again
        await updateLr();
        await fetchDocumentData();
    }

    //Find the index of the lr row where id == 3 and push that value to db
    const handleNewRecordAccept = async (rowId) => {
        const rowIndex = lr.findIndex(row => row.id === rowId);
        const newTotalExpenses = Number(lr[rowIndex].amount) + Number(currentDocument.budget);
        console.log(newTotalExpenses)
        if (!error) {
            if (newTotalExpenses > currentDocument.cashAdvance) {
                setAmountExceeded({
                    rowId: 3, // Adding row
                    docId: currentDocument.id,
                    exceeded: newTotalExpenses - currentDocument.cashAdvance,
                    newValue: lr[rowIndex]
                });
                handleWarningOpen();
            } else {
                await createLrByDocumentId(currentDocument.id, lr[rowIndex]);
            }
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
        } else {
            console.error(`Row with id ${rowId} not found`);
        }
    };

    useEffect(() => {
        console.log("RecordsRow useEffect")
        if (isAdding && value === 0) { // applies only to LR & RCD tab: value = 0
            setError(true); // set error to true by default per LR adding
            addFields(isAdding);
        }
    }, [isAdding, addFields, value]);

    return (
        <React.Fragment>
            {currentDocument.id !== 0 && lr // ensure that current document is not empty
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                    const uniqueKey = `row_${row.id}_${index}`;
                    return (
                        <TableRow key={uniqueKey} hover role="checkbox" tabIndex={-1}>
                            {columns.map((column) => {
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
                                        onClick={() => handleCellClick(column.id, row.id)}
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
                                                    <LRTextField
                                                        row={row}
                                                        column={column}
                                                        editingCell={editingCell}
                                                        setEditingCell={setEditingCell}
                                                        handleWarningOpen={handleWarningOpen}
                                                        value={value}
                                                        setError={setError}
                                                        setAmountExceeded={setAmountExceeded}
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
            <ExceedWarningModal
                open={warningOpen}
                onClose={handleWarningClose}
                amountExceeded={amountExceeded}
            />
            <HistoryModal
                open={open}
                index={selectedIndex}
                handleClose={handleClose}
                handleCloseParent={handleMenuClose}
            />
        </React.Fragment>
    );
});

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
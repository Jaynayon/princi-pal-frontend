import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from "@mui/material";
import { useSchoolContext } from '../../Context/SchoolProvider';
import Box from '@mui/material/Box';
import { useNavigationContext } from '../../Context/NavigationProvider';
import Button from '@mui/material/Button';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import MenuItem from '@mui/material/MenuItem';
import { Menu } from '@mui/material';
import RestService from '../../Services/RestService';

let newLr = {
    id: 3,
    date: '',
    orsBursNo: '',
    particulars: '',
    amount: 0
}


function RecordsRow(props) {
    const { rows, setRows, page, rowsPerPage } = props;
    const [editingCell, setEditingCell] = useState({ colId: null, rowId: null });
    const [inputValue, setInputValue] = useState('Initial Value');
    const [initialValue, setInitialValue] = useState(''); //only request update if there is changes in initial value
    const { displayFields, isAdding, fetchDocumentData, setReload, reload } = useSchoolContext();

    const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [dropdownAnchorEl, setDropdownAnchorEl] = useState(null);

    useEffect(() => {
        console.log("123123123123123123123123123123123123123")
        displayFields(isAdding);
    }, [isAdding]);

    const handleCellClick = (colId, rowId, event) => {
        setEditingCell({ colId, rowId });
        setInitialValue(event.target.value); // Save the initial value of the clicked cell
        setInputValue(event.target.value); // Set input value to the current value
        console.log('row Id: ' + rowId + " and col Id: " + colId)
    };

    const handleDeleteOpen = (event, index) => {
        setDeleteAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleMenuClose = () => {
        setDropdownAnchorEl(null);
        setDeleteAnchorEl(null);
        setSelectedIndex(null);
    };

    const handleDelete = async (rowId) => {
        // Implement delete functionality here
        console.log("Delete button clicked for row at index:", selectedIndex);
        console.log("Delete lr id: " + rowId)
        deleteLrByid(rowId);
        setReload(!reload);
        // Close the menu after delete
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
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    };

    const handleInputChange = (colId, rowId, event) => {
        // Find the index of the object with matching id
        const rowIndex = rows.findIndex(row => row.id === rowId);

        if (rowIndex !== -1) {
            // Copy the array to avoid mutating state directly
            const updatedRows = [...rows];

            // Update the specific property of the object
            updatedRows[rowIndex][colId] = event.target.value;

            // Update the state with the modified rows
            //console.log(updatedRows[rowIndex])
            setRows(updatedRows);
            setInputValue(updatedRows[rowIndex][colId]); // Update inputValue if needed
        } else {
            console.error(`Row with id ${rowId} not found`);
        }
    };

    const handleInputBlur = () => {
        setEditingCell(null);
        // Perform any action when input is blurred (e.g., save the value)
        if (inputValue !== initialValue) {
            console.log("Wow there is changes");
            //fetchLrByDocumentId(); dapat update
        }
        console.log('Value saved:', inputValue);
    };

    return (
        <React.Fragment>
            {rows
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
                                                maxWidth: column.maxWidth
                                            }
                                        ]}
                                        onClick={(event) => handleCellClick(column.id, row.id, event)}
                                    >

                                        <Box
                                            style={
                                                editingCell &&
                                                    editingCell.colId === column.id &&
                                                    editingCell.rowId === row.id
                                                    ? styles.divInput
                                                    : null
                                            }
                                        >
                                            <input
                                                style={styles.inputStyling}
                                                value={value}
                                                onChange={(event) =>
                                                    handleInputChange(column.id, row.id, event)
                                                }
                                                onBlur={handleInputBlur}
                                            />
                                        </Box>
                                    </TableCell>
                                );
                            })}
                            <TableCell>
                                {/* Conditional rendering based on row.id */}
                                {row.id === 3 ? (
                                    <div>testing</div>
                                ) : (
                                    <React.Fragment>
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
                                    </React.Fragment>
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
        fontSize: "14px",
        background: "transparent",
        outline: "none",
        border: 'none',
    },
    divInput: {
        borderRadius: "8px",
        border: "1px solid #ccc",
        background: "transparent",
        outline: "none",
        padding: "5px",
        marginLeft: "-8px"
    }
}

export default RecordsRow;
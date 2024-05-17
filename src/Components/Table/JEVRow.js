import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from "@mui/material";
import { useSchoolContext } from '../../Context/SchoolProvider';
import Box from '@mui/material/Box';
// import { useNavigationContext } from '../../Context/NavigationProvider';
import { TextField } from '@mui/material';
import RestService from '../../Services/RestService';

function JEVRow(props) {
    const { page, rowsPerPage } = props;
    const [editingCell, setEditingCell] = useState({ colId: null, rowId: null });
    const [inputValue, setInputValue] = useState('Initial Value');
    const [initialValue, setInitialValue] = useState(''); //only request update if there is changes in initial value
    const { fetchDocumentData, jev, setJev, value } = useSchoolContext();

    useEffect(() => {
        console.log("RecordsRow useEffect")
        // if (isAdding === true && value === 0) { // applies only to LR & RCD tab: value = 0
        //     displayFields(isAdding);
        // }
    }, [value]);

    const handleCellClick = (colId, rowId, event) => {
        setEditingCell({ colId, rowId });
        setInitialValue(event.target.value); // Save the initial value of the clicked cell
        setInputValue(event.target.value); // Set input value to the current value
        console.log(editingCell)
        console.log('row Id: ' + rowId + " and col Id: " + colId)
    };

    const updateJevById = async (colId, rowId, value) => {
        try {
            const response = await RestService.updateJevById(colId, rowId, value);
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

    const handleInputChange = (colId, rowId, event) => {
        // Find the index of the object with matching id
        const rowIndex = jev.findIndex(row => row.id === rowId);

        if (rowIndex !== -1) {
            // Copy the array to avoid mutating state directly
            const updatedRows = [...jev];

            // Update the specific property of the object
            updatedRows[rowIndex][colId] = event.target.value;

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
            updateJevById(colId, rowId, inputValue);
        }
        console.log('Value saved:', inputValue);
    };

    return (
        <React.Fragment>
            {jev
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
                                        {/*Amount field*/}
                                        {column.id === "amount" ?
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
                                                    value={value}
                                                    sx={{
                                                        "& fieldset": { border: row.id !== 3 && 'none' }
                                                    }}
                                                    InputProps={{
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
                                            :
                                            /*Account Type field*/
                                            column.id === "amountType" ?
                                                <Box>
                                                    {value}
                                                </Box>
                                                :
                                                /*UACS field: Accounts and Explanations & Object Code*/
                                                <Box sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                }}>
                                                    <Box>
                                                        {value}
                                                    </Box>
                                                </Box>
                                        }
                                    </TableCell>
                                );
                            })}
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

export default JEVRow;
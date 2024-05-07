import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from "@mui/material";
import { useSchoolContext } from '../../Context/SchoolProvider';
import Box from '@mui/material/Box';
import { useNavigationContext } from '../../Context/NavigationProvider';

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
    const { displayFields, isAdding } = useSchoolContext();

    useEffect(() => {
        console.log("123123123123123123123123123123123123123")
        displayFields(isAdding);
    }, [isAdding])

    const handleCellClick = (colId, rowId, event) => {
        setEditingCell({ colId, rowId });
        setInitialValue(event.target.value); // Save the initial value of the clicked cell
        setInputValue(event.target.value); // Set input value to the current value
        console.log('row Id: ' + rowId + " and col Id: " + colId)
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
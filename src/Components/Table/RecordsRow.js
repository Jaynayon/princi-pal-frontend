import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from "@mui/material";
import { useRecordsContext } from '../../Context/RecordsProvider';
import Box from '@mui/material/Box';

function RecordsRow(props) {
    const { rows, setRows, page, rowsPerPage, columns } = props;
    const [editingCell, setEditingCell] = useState({ colId: null, rowId: null });
    const [inputValue, setInputValue] = useState('Initial Value');


    // const appendRow = (newRow) => {
    //     setRows(prevRows => [...prevRows, newRow]);
    // };

    // let newRecord = {
    //     id: 3,
    //     date: 'test',
    //     ors_burs_no: 'testing',
    //     particulars: 'testing',
    //     lastUpdated: 'testing2',
    //     hours: 'testing2',
    //     amount: 100
    // }

    useEffect(() => {
        //appendRow(newRecord)
        //console.log(rows)
    }, [])

    const handleCellClick = (colId, rowId) => {
        setEditingCell({ colId, rowId });
        console.log('row Id: ' + rowId + " and col Id: " + colId)
    };

    const handleInputChange = (colId, rowId, event) => {
        const updatedRows = [...rows];
        updatedRows[rowId - 1][colId] = event.target.value;
        setRows(updatedRows);
        setInputValue(rows[rowId - 1][colId]);
    };

    const handleInputBlur = () => {
        setEditingCell(null);
        // Perform any action when input is blurred (e.g., save the value)
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
                                        onClick={() => handleCellClick(column.id, row.id)}
                                    >
                                        {column.id === 'id' ? (
                                            <Box style={styles.inputStyling}>{value}</Box>
                                        ) : (
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
                                        )}
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
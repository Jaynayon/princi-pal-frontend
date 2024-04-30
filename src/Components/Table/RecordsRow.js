import React, { useEffect, useState } from 'react';
import { TableCell, TableRow } from "@mui/material";
import { useRecordsContext } from '../../Context/RecordsProvider';

function RecordsRow(props) {
    const [editingCell, setEditingCell] = useState({ colId: null, rowId: null });
    const [inputValue, setInputValue] = useState('Initial Value');
    const [rows, setRows] = useState([
        {
            id: 1,
            date: 'tests',
            ors_burs_no: 'testing',
            particulars: 'testing',
            lastUpdated: 'testing',
            hours: 'testing',
            amount: 100
        },
        {
            id: 2,
            date: 'test',
            ors_burs_no: 'testing',
            particulars: 'testing',
            lastUpdated: 'testing',
            hours: 'testing',
            amount: 150
        }
    ]);

    const appendRow = (newRow) => {
        setRows(prevRows => [...prevRows, newRow]);
    };

    let newRecord = {
        id: 3,
        date: 'test',
        ors_burs_no: 'testing',
        particulars: 'testing',
        lastUpdated: 'testing2',
        hours: 'testing2',
        amount: 100
    }

    useEffect(() => {
        appendRow(newRecord)
        console.log(rows)
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

    const conditionRow = (props) => {
        if (props.lastUpdated == null) {
            return (
                <>
                    <img alt="" src={"http://localhost:8080/download/uid/" + props.id} style={{ height: "45px", width: "45px" }} />
                    <div style={{
                        display: "inline-block",
                        paddingLeft: "10px",
                        verticalAlign: "top",
                        marginTop: "15px"
                    }}>
                        {props.value}
                    </div>
                </>
            );
        }
        return (
            <>
                <div style={{}}>
                    <img alt="" src={"http://localhost:8080/download/uid/" + props.id} style={{ height: "45px", width: "45px" }} />
                    <div style={{
                        display: "inline-block",
                        paddingLeft: "10px",
                        verticalAlign: "top",
                        marginTop: "10px"
                    }}>
                        {props.value}
                        <span style={{
                            display: "block",
                            fontSize: "12px",
                            color: "#808080",
                        }}>{"Last Updated: " + props.lastUpdated}</span>
                    </div>
                </div>
            </>
        );
    }
    //tedt
    return (
        <>
            {rows
                .slice(props.page * props.rowsPerPage, props.page * props.rowsPerPage + props.rowsPerPage)
                .map((row, index) => {
                    const uniqueKey = `row_${row.id}_${index}`;
                    return (
                        <TableRow hover role="checkbox" tabIndex={-1} key={uniqueKey}>
                            {props.columns.map((column) => {
                                let value = row[column.id];
                                return (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        sx={[styles.cell, {
                                            minWidth: column.minWidth,
                                            maxWidth: column.maxWidth
                                        }]}
                                        value={value}
                                        onClick={() => handleCellClick(column.id, row.id)}
                                    >
                                        {
                                            column.id === 'id' ?
                                                <div style={styles.inputStyling} >
                                                    {value}
                                                </div>
                                                :
                                                <div style=
                                                    {
                                                        editingCell &&
                                                            editingCell.colId === column.id &&
                                                            editingCell.rowId === row.id ?
                                                            styles.divInput : null
                                                    }
                                                >
                                                    <input style={styles.inputStyling}
                                                        value={value}
                                                        onChange={(event) => handleInputChange(column.id, row.id, event)}
                                                        onBlur={handleInputBlur}
                                                        autoFocus
                                                    />
                                                </div>
                                        }
                                    </TableCell>
                                );
                            })}
                        </TableRow >
                    );
                })}

        </>
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
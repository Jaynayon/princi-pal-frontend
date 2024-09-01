import React, { useState } from 'react';
import { TableCell, TableRow } from "@mui/material";
import { useSchoolContext } from '../../Context/SchoolProvider';
import Box from '@mui/material/Box';
// import { useNavigationContext } from '../../Context/NavigationProvider';

function JEVRow(props) {
    const { page, rowsPerPage, columns } = props;
    const [editingCell, setEditingCell] = useState({ colId: null, rowId: null });
    const { jev } = useSchoolContext();

    const handleCellClick = (colId, rowId, event) => {
        setEditingCell({ colId, rowId });
        console.log(editingCell)
        console.log('row Id: ' + rowId + " and col Id: " + colId)
    };

    const formatNumberDisplay = (number, colId, rowId) => {
        //if (typeof number !== 'number') return ''; // Handle non-numeric values gracefully
        return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    return (
        <React.Fragment>
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
                                            }
                                        ]}
                                        onClick={(event) => handleCellClick(column.id, row.id, event)}
                                    >
                                        {/*Amount field*/}
                                        {column.id === "amount" ?
                                            <Box
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    justifyContent: "flex-start",
                                                    fontSize: 14,
                                                    height: 40
                                                }}
                                            >
                                                {formatNumberDisplay(value, column.id, row.id)}
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
        //fontWeight: "bold",
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
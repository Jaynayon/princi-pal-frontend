import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSchoolContext } from '../../Context/SchoolProvider';
import { debounce } from '../../Utility/debounce';

export default function LRTextField(props) {
    const { column, row, editingCell, value, setEditingCell, handleWarningOpen, setError, setAmountExceeded } = props
    const { lr, currentDocument, setLr, updateLrById } = useSchoolContext();
    const [input, setInput] = useState(value || ""); // Pass the data by value

    const debouncedUpdateLrById = debounce((colId, rowId, input) => {
        updateLrById(colId, rowId, input);
    }, 1000);

    const updateRowState = (rowIndex, colId, modifiedValue) => {
        if (rowIndex !== -1) {
            // Copy the array to avoid mutating state directly
            const updatedRows = [...lr];

            // Update the specific property of the object
            updatedRows[rowIndex] = {
                ...updatedRows[rowIndex],
                [colId]: modifiedValue
            };

            // Update the state with the modified rows
            setLr(updatedRows);
        }
    };

    const handleInputChange = async (event) => {
        let modifiedValue = event.target.value
            .replace(/^\s+/, '')      // Remove leading spaces
            .replace(/\s{2,}/g, ' '); // Replace consecutive spaces with a single space

        // Find the index of the object with matching id
        const rowIndex = lr.findIndex(r => r.id === row.id);

        if (column.id === "amount") {
            // Replace any characters that are not digits or periods
            modifiedValue = modifiedValue.replace(/[^0-9.]/g, '');
            setError(Number(modifiedValue) === 0 || modifiedValue === "" || !modifiedValue || Number(modifiedValue) <= 0);
        } else {
            setError(false);
        }

        // Only update the state if the row is not the total row
        if (row.id === 3) {
            updateRowState(rowIndex, column.id, modifiedValue);
        }

        setInput(modifiedValue);
    };


    const handleBlur = (colId, rowId) => {
        setEditingCell(null); // Remove blue outline

        // Find the index of the object with matching id
        const rowIndex = lr.findIndex(row => row.id === rowId);

        if (rowIndex !== -1) {
            // .trim removes spaces from both start and the end of the string.
            const modifiedInput = colId === "amount" ? Number(input) : input.trim()
            const modifiedValue = colId === "amount" ? Number(value) : value.trim()

            const totalExpenses = Number(currentDocument?.budget);
            const monthlyBudget = Number(currentDocument?.cashAdvance);

            try {
                if (rowId !== 3 && modifiedInput !== modifiedValue) {
                    if (colId === "amount") {
                        const difference = Math.abs(modifiedInput - modifiedValue);
                        const newTotalExpenses = modifiedInput > modifiedValue
                            ? totalExpenses + difference
                            : totalExpenses - difference;

                        // Pass necessary properties to LRRow
                        setAmountExceeded({
                            colId,
                            rowId,
                            exceeded: newTotalExpenses - monthlyBudget,
                            newValue: input
                        });

                        if (newTotalExpenses > monthlyBudget) {
                            handleWarningOpen();
                        } else {
                            debouncedUpdateLrById(colId, rowId, input);
                        }
                    } else {
                        debouncedUpdateLrById(colId, rowId, input);
                    }
                } else {
                    setInput(modifiedValue);
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            console.error(`Row with id ${rowId} not found`);
        }
    }

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

    const isError = (colId, value) => {
        if (colId === "amount") {
            if (value === "" || value === 0 || !value) {
                return true;
            }
        }
        return false;
    }

    // Fetch new value when LR is updated
    useEffect(() => {
        setInput(value);
    }, [lr, value]);

    return (
        <TextField
            id={lr?.id}
            value={column.id === "amount" ? formatNumber(input, column.id, row.id) : input}
            error={isError(column.id, input)}
            helperText={isError(column.id, input) && "Empty field"}
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
            onChange={(e) => handleInputChange(e)}
            onBlur={() => handleBlur(column.id, row.id)}
            onKeyDown={(e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    e.target.blur(); // Blur input on Enter key press
                }
            }}
        />
    );
}
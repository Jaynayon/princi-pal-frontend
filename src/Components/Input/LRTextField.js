import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSchoolContext } from '../../Context/SchoolProvider';

export default function LRTextField(props) {
    const { column, row, editingCell, value, setEditingCell, setError } = props
    const { lr, updateLrById } = useSchoolContext();
    const [input, setInput] = useState(value || ""); // Pass the data by value

    const handleChange = async (event) => {
        let modifiedValue = event.target.value

        if (column.id === "amount") {
            // Replace any characters that are not digits or periods
            modifiedValue = modifiedValue.replace(/[^0-9.]/g, '');
            if (modifiedValue === 0 || modifiedValue === "" || !modifiedValue) {
                setError(true);
            } else {
                setError(false);
            }
        }

        setInput(modifiedValue);
    };

    const handleBlur = async (colId, rowId) => {
        setEditingCell(null); // Remove blue outline

        // Find the index of the object with matching id
        const rowIndex = lr.findIndex(row => row.id === rowId);

        if (rowIndex !== -1) {
            // .trim removes spaces from both start and the end of the string.
            const modifiedInput = colId === "amount" ? Number(input) : input.trim()
            const modifiedValue = colId === "amount" ? Number(value) : value

            try {
                if (rowId !== 3) {
                    if (modifiedInput !== modifiedValue) {
                        console.log(`Wow there is changes in col: ${colId} and row: ${rowId}`);
                        await updateLrById(colId, rowId, input);
                        console.log('Value saved:', value);
                    } else {
                        setInput(value);
                    }
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
            onChange={(e) => handleChange(e)}
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
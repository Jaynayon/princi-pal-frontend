import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useSchoolContext } from "../../Context/SchoolProvider";

// Custom input component using forwardRef
const CustomInput = forwardRef(({ value, onClick, onChange }, ref) => (
    <input
        ref={ref} // Pass the ref to the input element
        type="text"
        style={{
            backgroundColor: "transparent",
            padding: "10px", // Padding
            borderRadius: "10px", // Rounded corners
            borderWidth: 0,
            fontSize: 14,
            height: 40,
            width: "110px"
        }}
        readOnly
        value={value}
        onClick={onClick}
        onChange={onChange}
        // Handle focus styles directly
        onFocus={(e) => {
            e.target.style.outline = "none";
            e.target.style.boxShadow = "0 0 0 2px #1976d2"; // Custom focus effect
        }}
        onBlur={(e) => {
            e.target.style.boxShadow = "none"; // Remove focus effect when blurred
        }}
    />
));

export default function LRDate({ rowId, colId, selected, onChange }) {
    const [startDate, setStartDate] = useState(new Date(selected) || new Date());
    const { formatDate, updateLrById, years, months } = useSchoolContext();

    const dateOnBlur = async (date) => {
        try {
            const formattedDate = formatDate(date);
            // Update cells to any date fields that already have data/LR
            if (rowId !== 3) {
                await updateLrById(colId, rowId, formattedDate);
            } else {
                // Call the on change function that updates the LR state rowId === 3
                onChange(colId, rowId, formattedDate)
            }
        } catch (error) {
            console.error("Error updating LR by ID:", error);
        }
    };

    return (
        <DatePicker
            renderCustomHeader={({
                date,
                changeYear,
                changeMonth,
                decreaseMonth,
                increaseMonth,
                prevMonthButtonDisabled,
                nextMonthButtonDisabled,
            }) => (
                <div
                    style={{
                        margin: 10,
                        display: "flex",
                        justifyContent: "center",
                    }}
                >
                    <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                        {"<"}
                    </button>

                    <select
                        value={date.getFullYear()} // Use getFullYear() method
                        onChange={({ target: { value } }) => changeYear(value)}
                    >
                        {years.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <select
                        value={months[date.getMonth()]} // Use getMonth() method
                        onChange={({ target: { value } }) =>
                            changeMonth(months.indexOf(value))
                        }
                    >
                        {months.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <button onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                        {">"}
                    </button>
                </div>
            )}
            selected={startDate}
            onChange={(date) => {
                setStartDate(date);
                dateOnBlur(date)
            }}
            customInput={<CustomInput />}
        />
    );
}

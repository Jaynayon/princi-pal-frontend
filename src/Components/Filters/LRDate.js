import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import { useSchoolContext } from "../../Context/SchoolProvider";

// Custom input component using forwardRef
const CustomInput = forwardRef(({ value, onClick, onChange }, ref) => (
    <input
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
        value={value}
        onClick={onClick}
        onChange={onChange}
        ref={ref} // Pass the ref to the input element
        readOnly
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

export default function LRDate({ rowId, colId, selected, onBlur }) {
    const [startDate, setStartDate] = useState(new Date(selected));
    const { updateLrById, years, months } = useSchoolContext();

    const formatDate = (dateString) => {
        const date = new Date(dateString); // Convert to Date object
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so +1
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${day}/${year}`; // Return formatted date as MM/DD/YYYY
    };

    const dateOnBlur = async (date) => {
        try {
            console.log(formatDate(date))
            // const formattedDate = date.toISOString(); // Convert date to string format
            await updateLrById(colId, rowId, formatDate(date)); // Pass serialized date (string)
            console.log(formatDate(date));
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
                console.log("gawas")
                setStartDate(date);
                dateOnBlur(date)
                // if (onChange) onChange(date); // Trigger the parent's onChange if provided
            }}
            customInput={<CustomInput />}
        />
    );
}

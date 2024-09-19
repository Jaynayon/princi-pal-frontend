import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// Custom input component using forwardRef
const CustomInput = forwardRef(({ value, onClick }, ref) => (
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

export default function LRDate() {
    const [startDate, setStartDate] = useState(new Date());
    return (
        <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            customInput={<CustomInput />}
        />
    );
}

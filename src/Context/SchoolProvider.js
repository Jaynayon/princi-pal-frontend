import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import RestService from "../Services/RestService"

const SchoolContext = createContext();

export const useSchoolContext = () => useContext(SchoolContext);

export const SchoolProvider = ({ children }) => {
    // Initialize current date to get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' }); // Get full month name
    const currentYear = currentDate.getFullYear().toString(); // Get full year as string

    // Set initial state for month and year using current date
    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const years = [
        '2021', '2022', '2023', '2024'
    ];

    const monthIndex = months.indexOf(currentMonth);
    const yearIndex = years.indexOf(currentYear);

    const prevMonthRef = useRef(monthIndex === 0 ? 11 : monthIndex);
    const prevYearRef = useRef(monthIndex === 0 ? (yearIndex === 0 ? years.length - 1 : yearIndex - 1) : yearIndex);

    useEffect(() => {
        //console.log("Month: " + month + " Year: " + year)
    }, [month, year]); // Run effect only on mount and unmount*/

    return (
        <SchoolContext.Provider value={{
            prevMonthRef, prevYearRef, month, setMonth, year, setYear, months, years
        }}>
            {children}
        </SchoolContext.Provider>
    );
};

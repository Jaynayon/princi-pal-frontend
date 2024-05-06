import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import RestService from "../Services/RestService"

const SchoolContext = createContext();

export const useSchoolContext = () => useContext(SchoolContext);

export const SchoolProvider = ({ children, value }) => {
    // Initialize current date to get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' }); // Get full month name
    const currentYear = currentDate.getFullYear().toString(); // Get full year as string

    // Set initial state for month and year using current date
    const { currentDocument, setCurrentDocument, month, setMonth, year, setYear } = value;
    const [lr, setLr] = useState([]);

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

    const fetchLrByDocumentId = async (id) => {
        try {
            // Call RestService to fetch lr by document id
            const data = await RestService.getLrByDocumentId(id);

            if (data) { //data.decodedToken
                setLr(data)
            } else {
                setLr(null); //meaning it's empty 
            }
            console.log(data);
            // Handle response as needed
        } catch (error) {
            console.error('Error fetching lr:', error);
        }
    };

    // const fetchDocumentBySchoolIdYearMonth = async (id, year, month) => {
    //     try {
    //         const getDocument = await RestService.getDocumentBySchoolIdYearMonth(id, year, month);

    //         if (getDocument) { //data.decodedToken
    //             setCurrentDocument(getDocument);
    //         } else {
    //             setCurrentDocument(getDocument);
    //         }
    //         console.log(getDocument);
    //         // Handle response as needed

    //     } catch (error) {
    //         console.error('Error validating token:', error);
    //     }
    // };

    useEffect(() => {
        console.log("update document");

        fetchLrByDocumentId(currentDocument.id);
    }, [month, year, currentDocument]); // Run effect only on mount and unmount*/

    return (
        <SchoolContext.Provider value={{
            prevMonthRef, prevYearRef, month, setMonth, year, setYear, months, years,
            lr, setLr, fetchLrByDocumentId, setCurrentDocument,
            currentDocument
        }}>
            {children}
        </SchoolContext.Provider>
    );
};

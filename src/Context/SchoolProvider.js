import React, { createContext, useState, useEffect, useRef, useContext } from 'react';
import RestService from "../Services/RestService"

const SchoolContext = createContext();

export const useSchoolContext = () => useContext(SchoolContext);

export const SchoolProvider = ({ children, value }) => {
    // Set initial state for month and year using current date
    const {
        currentMonth, currentYear,
        currentDocument, setCurrentDocument,
        month, setMonth,
        year, setYear,
        months, years,
        isAdding, setIsAdding,
        addOneRow, setAddOneRow
    } = value;
    const [lr, setLr] = useState([]);

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
                setLr([]); //meaning it's empty 
            }
            console.log(data);
            // Handle response as needed
        } catch (error) {
            console.error('Error fetching lr:', error);
        }
    };

    console.log(addOneRow);

    const displayFields = (isAdding) => {
        let newLr = {
            id: 3,
            date: '',
            orsBursNo: '',
            particulars: '',
            amount: 0
        }

        isAdding && (setLr(prevRows => [...prevRows, newLr]))

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
            lr, setLr, fetchLrByDocumentId, setCurrentDocument, currentDocument,
            displayFields, isAdding, setIsAdding, addOneRow, setAddOneRow
        }}>
            {children}
        </SchoolContext.Provider>
    );
};

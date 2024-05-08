import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import RestService from "../Services/RestService"

export const SchoolContext = createContext();

export const useSchoolContext = () => useContext(SchoolContext);

export const SchoolProvider = ({ children, value }) => {
    // Set initial state for month and year using current date
    const {
        currentMonth, currentYear,
        currentSchool, setCurrentSchool,
        currentDocument, setCurrentDocument,
        month, setMonth,
        year, setYear,
        months, years,
        isAdding, setIsAdding,
        addOneRow, setAddOneRow,
        reload, setReload,
        fetchDocumentData, val
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

    const updateLr = useCallback(async () => {
        try {
            if (currentDocument) {
                // Call RestService to fetch lr by document id
                const data = await RestService.getLrByDocumentId(currentDocument.id);
                console.log("lr")
                if (data) { //data.decodedToken
                    setLr(data)
                } else {
                    setLr([]); //meaning it's empty 
                }
                console.log(data);
                // Handle response as needed
            }
        } catch (error) {
            console.error('Error fetching lr:', error);
        }
    }, [currentDocument, setLr]);

    const displayFields = useCallback((isAdding) => {
        let newLr = {
            id: 3,
            date: '',
            orsBursNo: '',
            particulars: '',
            amount: 0
        }

        isAdding && (setLr(prevRows => [newLr, ...prevRows]))

    }, [])

    useEffect(() => {
        console.log("SchoolProvider useEffect: update lr");
        if (val === 0) { // if LR tab is selected
            updateLr();
        }

    }, [month, year, currentDocument, val, updateLr]); // Run effect only on mount and unmount*/

    return (
        <SchoolContext.Provider value={{
            prevMonthRef, prevYearRef, month, setMonth, year, setYear, months, years,
            lr, setLr, fetchLrByDocumentId, setCurrentDocument, currentDocument,
            displayFields, isAdding, setIsAdding, addOneRow, setAddOneRow, updateLr, fetchDocumentData,
            currentSchool, setCurrentSchool, reload, setReload
        }}>
            {children}
        </SchoolContext.Provider>
    );
};

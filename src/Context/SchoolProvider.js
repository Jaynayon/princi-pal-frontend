import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import RestService from "../Services/RestService"
import { useNavigationContext } from './NavigationProvider';

export const SchoolContext = createContext();

export const useSchoolContext = () => useContext(SchoolContext);

const emptyDocument = {
    budget: 0,
    cashAdvance: 0
}

// Initialize current date to get current month and year
const currentDate = new Date();
const currentMonth = currentDate.toLocaleString('default', { month: 'long' }); // Get full month name
const currentYear = currentDate.getFullYear().toString(); // Get full year as string

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const years = [
    '2021', '2022', '2023', '2024'
];

export const SchoolProvider = ({ children }) => {
    // Set initial state for month and year using current date
    const { currentSchool } = useNavigationContext();

    // Set initial state for month and year using current date
    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);

    const [isAdding, setIsAdding] = useState(false);
    const [addOneRow, setAddOneRow] = useState(false);

    const [reload, setReload] = useState(false);

    const [currentDocument, setCurrentDocument] = useState(null);
    const [lr, setLr] = useState([]);

    const monthIndex = months.indexOf(currentMonth);
    const yearIndex = years.indexOf(currentYear);

    const prevMonthRef = useRef(monthIndex === 0 ? 11 : monthIndex);
    const prevYearRef = useRef(monthIndex === 0 ? (yearIndex === 0 ? years.length - 1 : yearIndex - 1) : yearIndex);

    const fetchDocumentData = useCallback(async () => {
        try {
            if (currentSchool) {
                const getDocument = await RestService.getDocumentBySchoolIdYearMonth(
                    currentSchool?.id,
                    year,
                    month
                );

                if (getDocument) {
                    setCurrentDocument(getDocument);
                } else {
                    setCurrentDocument(emptyDocument);
                }
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }, [currentSchool, setCurrentDocument, year, month]);

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
            amount: 0,
            objectCode: '',
            payee: '',
            natureOfPayment: 'Cash'
        }

        isAdding && (setLr(prevRows => [newLr, ...prevRows]))

    }, [])

    useEffect(() => {
        console.log("SchoolProvider useEffect: update lr");
        //if (val === 0) { // if LR tab is selected
        //updateLr();
        //}
        fetchDocumentData();

    }, [month, year, currentSchool, fetchDocumentData]); // Run effect only on mount and unmount*/

    return (
        <SchoolContext.Provider value={{
            prevMonthRef, prevYearRef, month, setMonth, year, setYear, months, years,
            lr, setLr, fetchLrByDocumentId, setCurrentDocument, currentDocument,
            displayFields, isAdding, setIsAdding, addOneRow, setAddOneRow, updateLr, fetchDocumentData,
            currentSchool, reload, setReload
        }}>
            {children}
        </SchoolContext.Provider>
    );
};

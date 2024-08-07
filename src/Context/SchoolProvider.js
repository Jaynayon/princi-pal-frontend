import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import RestService from "../Services/RestService"
import { useNavigationContext } from './NavigationProvider';

export const SchoolContext = createContext();

export const useSchoolContext = () => useContext(SchoolContext);

const emptyDocument = {
    id: 0,
    budget: 0,
    cashAdvance: 0,
    claimant: "",
    sds: "",
    headAccounting: ""
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

    // Document Tabs: LR & RCD, JEV
    const [value, setValue] = React.useState(0);

    // Set initial state for month and year using current date
    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);

    const [isAdding, setIsAdding] = useState(false);
    const [addOneRow, setAddOneRow] = useState(false);

    const [reload, setReload] = useState(false);

    const [currentDocument, setCurrentDocument] = useState(null);
    const [lr, setLr] = useState([]);
    const [jev, setJev] = useState([]);

    const monthIndex = months.indexOf(currentMonth);
    const yearIndex = years.indexOf(currentYear);

    const prevMonthRef = useRef(monthIndex === 0 ? 11 : monthIndex);
    const prevYearRef = useRef(monthIndex === 0 ? (yearIndex === 0 ? years.length - 1 : yearIndex - 1) : yearIndex);

    const exportDocument = async () => {
        try {
            if (currentSchool) {
                const blobData = await RestService.getExcelFromLr(
                    currentDocument.id,
                    currentSchool.id,
                    year,
                    month
                );

                if (blobData) {
                    console.log("Successfully exported document")
                }
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    };

    const fetchLRByKeyword = useCallback(async (keyword) => {
        try {
            if (currentSchool) {
                const getLr = await RestService.getLrByKeyword(
                    keyword
                );

                if (getLr) {
                    setLr(getLr);
                }
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }, [currentSchool]);

    const fetchDocumentData = useCallback(async () => {
        try {
            if (currentSchool) {
                const getDocument = await RestService.getDocumentBySchoolIdYearMonth(
                    currentSchool?.id,
                    year,
                    month
                );

                console.log(getDocument)

                if (getDocument) {
                    setCurrentDocument(getDocument);
                } else {
                    console.log("this was invoked")
                    setCurrentDocument(emptyDocument);
                }
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }, [currentSchool, setCurrentDocument, year, month]);

    const fetchDocumentDataBySchooId = useCallback(async (id) => {
        try {
            if (currentSchool) {
                const getDocument = await RestService.getDocumentBySchoolIdYearMonth(
                    id,
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

    const createNewDocument = useCallback(async (obj, cashAdvanceValue) => {
        try {
            if (currentSchool) {
                const getDocument = await RestService.createDocBySchoolId(
                    currentSchool.id,
                    month,
                    year,
                    obj,
                    cashAdvanceValue
                );

                if (getDocument) {
                    setCurrentDocument(getDocument);
                } else {
                    setCurrentDocument(emptyDocument);
                }
                fetchDocumentData();
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }, [currentSchool, fetchDocumentData, setCurrentDocument, year, month]);

    const updateJev = useCallback(async () => {
        try {
            if (currentDocument) {
                // Call RestService to fetch lr by document id
                const data = await RestService.getJevByDocumentId(currentDocument.id);
                console.log("lr")
                if (data) { //data.decodedToken
                    setJev(data)
                } else {
                    setJev([]); //meaning it's empty 
                }
                console.log(data);
                // Handle response as needed
            }
        } catch (error) {
            console.error('Error fetching lr:', error);
        }
    }, [currentDocument, setJev]);

    const updateLr = useCallback(async () => {
        try {
            if (currentDocument) {
                // Call RestService to fetch lr by document id
                const data = await RestService.getLrByDocumentId(currentDocument?.id);
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

    const addFields = useCallback((isAdding) => {
        let newLr = {
            id: 3,
            date: '',
            orsBursNo: '',
            particulars: '',
            amount: 0,
            objectCode: '5020502001', //predefined option
            payee: '',
            natureOfPayment: 'Cash'
        }

        isAdding && (setLr(prevRows => [newLr, ...prevRows]))

    }, [])

    useEffect(() => {
        console.log("SchoolProvider useEffect: update document");
        // console.log(currentSchool.name+ "with id: "+currentSchool);
        fetchDocumentData();
        console.log(month)
        console.log(year)

    }, [month, year, currentSchool, fetchDocumentData]); // Run effect only on mount and unmount*/

    return (
        <SchoolContext.Provider value={{
            prevMonthRef, prevYearRef, month, setMonth, year, setYear, months, years,
            lr, setLr, setCurrentDocument, currentDocument,
            addFields, isAdding, setIsAdding, addOneRow, setAddOneRow, updateLr, fetchDocumentData,
            currentSchool, reload, setReload, value, setValue, updateJev, jev, setJev, createNewDocument,
            fetchLRByKeyword, exportDocument, fetchDocumentDataBySchooId
        }}>
            {children}
        </SchoolContext.Provider>
    );
};

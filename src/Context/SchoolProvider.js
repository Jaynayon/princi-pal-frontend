import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useNavigationContext } from './NavigationProvider';
import axios from 'axios';

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
const currentYear = currentDate.getFullYear(); // Get full year as string

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

// Dynamic year starting from year 2021
const startYear = 2021;
const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => (startYear + i).toString());

export const SchoolProvider = ({ children }) => {
    // Set initial state for month and year using current date
    const { currentSchool } = useNavigationContext();

    // Document Tabs: LR & RCD, JEV
    const [value, setValue] = React.useState(0);

    // Set initial state for month and year using current date
    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear.toString());

    // Context states for sort by date
    const monthIndex = months.indexOf(currentMonth);
    const yearIndex = years.indexOf(currentYear.toString());

    const prevMonthRef = useRef(monthIndex === 0 ? 11 : monthIndex);
    const prevYearRef = useRef(monthIndex === 0 ? (yearIndex === 0 ? years.length - 1 : yearIndex - 1) : yearIndex);

    // States needed for adding LR
    const [isAdding, setIsAdding] = useState(false);
    const [addOneRow, setAddOneRow] = useState(false);

    // Document, LR, and JEV entities
    const [currentDocument, setCurrentDocument] = useState(emptyDocument);
    const [lr, setLr] = useState([]);
    const [jev, setJev] = useState([]);

    const fetchDocumentData = useCallback(async () => {
        try {
            if (currentSchool) {
                const response = await axios.get(`${process.env.REACT_APP_API_URL_DOC}/school/${currentSchool.id}/${year}/${month}`)

                console.log(response.data)
                setCurrentDocument(response.data);
            }
        } catch (error) {
            setCurrentDocument(emptyDocument)
            console.error('Error fetching document:', error);
        }
    }, [currentSchool, setCurrentDocument, year, month]);

    const createLrByDocId = useCallback(async (documentsId, obj) => {
        try {
            if (currentDocument) {
                const response = await axios.post(`${process.env.REACT_APP_API_URL_LR}/create`, {
                    documentsId,
                    date: obj.date,
                    orsBursNo: obj.orsBursNo,
                    particulars: obj.particulars,
                    amount: obj.amount,
                    objectCode: obj.objectCode,
                    payee: obj.payee,
                    natureOfPayment: obj.natureOfPayment
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                return response.status === 201;
            }
        } catch (error) {
            console.error('Error fetching document:', error);
            return null;
        }
    }, [currentDocument]);

    const updateDocumentById = useCallback(async (docId, description, value) => {
        // Construct the payload object based on the provided colId
        const payload = {
            "Claimant": { claimant: value },
            "SDS": { sds: value },
            "Head. Accounting Div. Unit": { headAccounting: value },
            "Budget Limit": { budgetLimit: value },
            "Cash Advance": { cashAdvance: value }
        }[description] || {};

        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL_DOC}/${docId}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            return response.status === 200;
        } catch (error) {
            console.error('Error fetching lrs by document id:', error);
            //throw new Error("Get lr failed. Please try again later.");
            return null;
        }
    }, []);

    const createNewDocument = useCallback(async (obj, month, cashAdvanceValue) => {
        try {
            if (currentSchool) {
                // Troubleshooting: year and month passed is an array
                // Extracting the year value from the array
                const yearValue = Array.isArray(year) ? year[0] : year;

                // Extracting the month value from the array
                const monthValue = Array.isArray(month) ? month[0] : month;

                const response = await axios.post(`${process.env.REACT_APP_API_URL_DOC}/create`, {
                    schoolId: currentSchool.id,
                    month: monthValue,
                    year: yearValue
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // Check if document creation was successful
                if (response) {
                    const newDocumentId = response.data.id;

                    // If a payload (obj) is passed, create document and lr, else only document.
                    if (obj) {
                        if (obj.cashAdvance) {
                            const setDocumentBudget = await updateDocumentById(newDocumentId, "Cash Advance", obj.cashAdvance);

                            if (setDocumentBudget) {
                                console.log("Budget set successfully");
                            } else {
                                console.error('Failed to set budget')
                            }
                        } else {
                            // Insert new LR using the newly created document's ID
                            const lrCreationResponse = await createLrByDocId(newDocumentId, obj);

                            if (lrCreationResponse) {
                                console.log('LR created successfully');
                            } else {
                                console.error('Failed to create LR');
                            }
                        }
                    }

                    // return response.data; // Return the created document data
                    setCurrentDocument(response.data || emptyDocument);
                    fetchDocumentData();
                }
            }
        } catch (error) {
            console.error('Error fetching document:', error);
            return null;
        }
    }, [currentSchool, setCurrentDocument, year, createLrByDocId, updateDocumentById, fetchDocumentData]);

    const updateJev = useCallback(async () => {
        try {
            if (currentDocument.id !== 0) {
                const response = await axios.get(`${process.env.REACT_APP_API_URL_JEV}/documents/${currentDocument.id}`);
                setJev(response.data || [])
                // Handle response as needed
                console.log(response.data);

            } else {
                setJev([]); //meaning it's empty 
            }
        } catch (error) {
            setJev([]);
            console.error('Error fetching lr:', error);
        }
    }, [currentDocument, setJev]);

    const updateJevById = async (colId, rowId, value) => {
        let obj = {}

        // Construct the payload object based on the provided colId
        if (colId === "budget") {
            obj = { budget: value };
        }

        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL_JEV}/${rowId}`, obj, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            if (response) {
                console.log(response.data);
            }
            return response.status === 200;
        } catch (error) {
            console.error('Error fetching lrs by document id:', error);
            //throw new Error("Get lr failed. Please try again later.");
            return null;
        }
    };

    const updateLr = useCallback(async () => {
        try {
            if (currentDocument.id !== 0) {
                const response = await axios.get(`${process.env.REACT_APP_API_URL_LR}/documents/${currentDocument.id}`);
                setLr(response.data || [])
                // Handle response as needed
                console.log(response.data);
            } else {
                setLr([]); //meaning it's empty 
            }
        } catch (error) {
            setLr([]);
            console.error('Error fetching lr:', error);
        }
    }, [currentDocument, setLr]);

    const updateLrById = async (colId, rowId, value) => {
        let obj = {}

        // Construct the payload object based on the provided colId
        if (colId === "amount") {
            obj = { amount: value };
        } else if (colId === "particulars") {
            obj = { particulars: value };
        } else if (colId === "orsBursNo") {
            obj = { orsBursNo: value };
        } else if (colId === "date") {
            obj = { date: value };
        } else if (colId === "objectCode") {
            obj = { objectCode: value };
        } else if (colId === "payee") {
            obj = { payee: value };
        } else if (colId === "natureOfPayment") {
            obj = { natureOfPayment: value };
        }

        try {
            const response = await axios.patch(`${process.env.REACT_APP_API_URL_LR}/${rowId}`, obj, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                console.log(response.data);
                console.log(`LR with id: ${rowId} is updated`);
            } else {
                console.log("LR not updated");
            }
            fetchDocumentData();
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    const deleteLrByid = async (rowId) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL_LR}/${rowId}`)
            if (response) {
                console.log(response.data)
            }

            if (response.status === 200) {
                console.log(`LR with id: ${rowId} is deleted`);
            } else {
                console.log("LR not deleted");
            }
            fetchDocumentData();
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    };

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
        fetchDocumentData();
    }, [fetchDocumentData]); // Run effect only on mount and unmount

    return (
        <SchoolContext.Provider value={{
            prevMonthRef, prevYearRef, month, setMonth, year, setYear, months, years,
            lr, setLr, setCurrentDocument, currentDocument,
            addFields, isAdding, setIsAdding, addOneRow, setAddOneRow, updateLr, fetchDocumentData,
            currentSchool, value, setValue, updateJev, updateJevById, jev, setJev, createNewDocument,
            createLrByDocId, updateDocumentById, deleteLrByid,
            updateLrById
        }}>
            {children}
        </SchoolContext.Provider>
    );
};

import React, { createContext, useState, useEffect, useRef, useContext, useCallback } from 'react';
import { useNavigationContext } from './NavigationProvider';
import axios from 'axios';

export const SchoolContext = createContext();

export const useSchoolContext = () => useContext(SchoolContext);

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

const emptyDocument = {
    id: 0,
    year: currentYear,
    month: currentMonth,
    budget: 0,
    cashAdvance: 0,
    claimant: "",
    sds: "",
    headAccounting: ""
}

export const SchoolProvider = ({ children }) => {
    // Set initial state for month and year using current date
    const { currentSchool, setCurrentSchool, currentUser, selected } = useNavigationContext();

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

    // States needed for adding, searching, or editing entities
    const [isAdding, setIsAdding] = useState(false);
    const isEditingRef = useRef(false);
    const isSearchingRef = useRef(false);
    const [addOneRow, setAddOneRow] = useState(false);
    const [objectCodes, setObjectCodes] = useState([]);
    const [isEditable, setIsEditable] = useState(false);

    // Document, LR, and JEV entities
    const [currentDocument, setCurrentDocument] = useState(emptyDocument);
    const [lr, setLr] = useState([]);
    const [lrNotApproved, setLrNotApproved] = useState([]);
    const [jev, setJev] = useState([]);

    const fetchDocumentData = useCallback(async () => {
        try {
            if (currentSchool) {
                const response = await axios.get(`${process.env.REACT_APP_API_URL_DOC}/school/${currentSchool.id}/${year}/${month}`);
                setCurrentDocument(response.data || emptyDocument);
            }
        } catch (error) {
            setCurrentDocument(emptyDocument)
            console.error('Error fetching document:', error);
        }
    }, [currentSchool, setCurrentDocument, year, month]);

    const fetchDocumentBySchoolId = useCallback(async (schoolId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL_DOC}/school/${schoolId}/${year}/${month}`);
            setCurrentDocument(response.data);
        } catch (error) {
            setCurrentDocument(emptyDocument)
            console.error('Error fetching document:', error);
        }
    }, [setCurrentDocument, year, month]);

    const fetchUacs = useCallback(async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL_UACS}/all`);
            setObjectCodes(response.data || []);
        } catch (error) {
            console.error('Error validating token:', error);
        }
    }, [setObjectCodes]);

    const createLrByDocId = useCallback(async (documentsId, obj) => {
        try {
            if (currentDocument && currentUser) {
                const response = await axios.post(`${process.env.REACT_APP_API_URL_LR}/create`, {
                    documentsId,
                    userId: currentUser.id,
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
    }, [currentDocument, currentUser]);

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

    const initializeDocuments = useCallback(async (annualBudget) => {
        try {
            if (currentSchool) {
                const response = await axios.post(`${process.env.REACT_APP_API_URL_DOC}/initialize`, {
                    schoolId: currentSchool.id,
                    month,
                    year,
                    annualBudget
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
    }, [currentSchool, month, year]);

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

    const getDocumentBySchoolIdYear = async (school_id, year) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL_DOC}/school/${school_id}/${year}`)
            return response.data
        } catch (error) {
            console.log(error.response.data)
            //console.error('Error fetching lrs by document id:', error.message);
            //throw new Error("Get lr failed. Please try again later.");
            return null;
        }
    };

    const updateJev = useCallback(async () => {
        try {
            if (currentDocument.id !== 0) {
                // const response = await axios.get(`${process.env.REACT_APP_API_URL_JEV}/documents/${currentDocument.id}`);
                const response = await axios.get(`${process.env.REACT_APP_API_URL_LR}/jev/documents/${currentDocument.id}`);
                setJev(response.data || []);
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
                const response = await axios.get(`${process.env.REACT_APP_API_URL_LR}/documents/${currentDocument.id}/approved`);
                const notApproved = await axios.get(`${process.env.REACT_APP_API_URL_LR}/documents/${currentDocument.id}/unapproved`);
                setLr(response.data || []);
                setLrNotApproved(notApproved.data || []);
                console.log(notApproved.data)
            } else {
                setLr([]); //meaning it's empty 
                setLrNotApproved([]);
            }
        } catch (error) {
            setLr([]);
            setLrNotApproved([]);
            console.error('Error fetching lr:', error);
        }
    }, [currentDocument, setLr]);

    const updateLrById = async (colId, rowId, value) => {
        let obj = { userId: currentUser.id }

        // Construct the payload object based on the provided colId
        switch (colId) {
            case "amount":
                obj.amount = value;
                break;
            case "particulars":
                obj.particulars = value;
                break;
            case "orsBursNo":
                obj.orsBursNo = value;
                break;
            case "date":
                obj.date = value;
                break;
            case "objectCode":
                obj.objectCode = value;
                break;
            case "payee":
                obj.payee = value;
                break;
            case "natureOfPayment":
                obj.natureOfPayment = value;
                break;
            case "approved":
                obj.approved = value;
                break;
            default:
                console.warn("Invalid colId:", colId); // Handle unexpected colId
                break;
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
    };

    const deleteLrByid = async (rowId) => {
        try {
            if (currentUser) {
                const response = await axios.delete(`${process.env.REACT_APP_API_URL_LR}/${rowId}/user/${currentUser.id}`)
                if (response) {
                    console.log(response.data)
                }

                if (response.status === 200) {
                    console.log(`LR with id: ${rowId} is deleted`);
                } else {
                    console.log("LR not deleted");
                }
            }
            fetchDocumentData();
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString); // Convert to Date object
        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based, so +1
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${day}/${year}`; // Return formatted date as MM/DD/YYYY
    };

    const addFields = useCallback((isAdding) => {
        let newLr = {
            id: 3,
            date: formatDate(new Date()), //default date: today
            orsBursNo: '',
            particulars: '',
            amount: 0,
            objectCode: objectCodes[0].code, //predefined option '5020502001'
            payee: '',
            natureOfPayment: 'Cash'
        }

        isAdding && (setLr(prevRows => [newLr, ...prevRows]))
    }, [objectCodes]);

    // Function to check if the document is editable
    const isDocumentEditable = (docYear, docMonth) => {
        const monthOrder = months.findIndex(month => month === docMonth);
        const currentMonthOrder = months.findIndex(month => month === currentMonth);
        const documentDate = new Date(docYear, monthOrder);
        const twoMonthsAgo = new Date(currentYear, currentMonthOrder - 2, 1); // Date two months behind the current month

        return documentDate >= twoMonthsAgo;
    };

    // useEffect(() => {
    //     console.log("SchoolProvider useEffect: update document");
    //     fetchDocumentData();
    // }, [fetchDocumentData, year, month]);

    useEffect(() => {
        // Assuming document.year and document.month are provided in numeric format
        const editable = isDocumentEditable(currentDocument.year, currentDocument.month);
        setIsEditable(editable);
    }, [currentDocument]);

    useEffect(() => {
        if (objectCodes.length === 0) {
            fetchUacs();
        }
    }, [fetchUacs, objectCodes]); // Run effect only on mount and unmount

    useEffect(() => {
        let timeoutId;

        const updateDocumentData = () => {
            // Fetch data if user is not adding, editing, or searching
            if (!isAdding && !isEditingRef.current && !isSearchingRef.current) {
                fetchDocumentData().finally(() => {
                    // Set the next timeout after the fetch is complete
                    timeoutId = setTimeout(updateDocumentData, 10000); // 10 seconds
                });
            } else {
                timeoutId = setTimeout(updateDocumentData, 10000); // 10 seconds
            }
        };

        // Check if user is in school tab or dashboard
        if (currentUser.schools.find(school => school.name === selected) || selected === "Dashboard") {
            updateDocumentData();
        }

        // Cleanup function to clear the timeout
        return () => clearTimeout(timeoutId);

    }, [fetchDocumentData, isAdding, currentUser.schools, selected]);

    return (
        <SchoolContext.Provider value={{
            prevMonthRef, prevYearRef,
            value, setValue,
            month, setMonth,
            year, setYear,
            months, years,
            lr, setLr, updateLr,
            lrNotApproved,
            jev, setJev, updateJev,
            currentDocument, setCurrentDocument,
            emptyDocument,
            addFields, formatDate,
            isAdding, setIsAdding,
            isEditingRef,
            isSearchingRef,
            isEditable,
            addOneRow, setAddOneRow,
            currentSchool, setCurrentSchool,
            fetchDocumentData,
            fetchDocumentBySchoolId,
            createNewDocument, updateDocumentById, getDocumentBySchoolIdYear,
            initializeDocuments,
            createLrByDocId, deleteLrByid, updateLrById,
            updateJevById,
            objectCodes
        }}>
            {children}
        </SchoolContext.Provider>
    );
};

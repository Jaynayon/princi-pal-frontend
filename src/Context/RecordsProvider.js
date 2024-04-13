import React, { createContext, useState, useContext } from 'react';

// Create a new context
const RecordsContext = createContext();

// Custom hook to use the records context
export const useRecordsContext = () => useContext(RecordsContext);

// Provider component to wrap your application and provide the context
export const RecordsProvider = ({ children }) => {
    const [records, setRecords] = useState([
        {
            id: 1,
            date: 'oten',
            details_code: 'testing',
            details: 'testing',
            lastUpdated: 'testing',
            hours: 'testing',
            amount: 100
        },
        {
            id: 2,
            date: 'oten',
            details_code: 'boto',
            details: 'testing',
            lastUpdated: 'testing',
            hours: 'testing',
            amount: 150
        }
    ]);

    const appendRecord = (newRecord) => {
        setRecords(prevRecords => [...prevRecords, newRecord]);
    };

    const getRecords = () => {
        return records;
    }

    return (
        <RecordsContext.Provider value={{ records, appendRecord, getRecords }}>
            {children}
        </RecordsContext.Provider>
    );
};

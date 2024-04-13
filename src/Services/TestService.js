import { useState } from 'react';

function TestService() {
    const [rows, setRows] = useState([
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

    const getRecords = () => {
        return rows;
    }

    const appendRow = (newItem) => {
        setRows(prevRows => [...prevRows, newItem]);
    };

    // Return the functions and state that you want to export
    return { rows, getRecords, appendRow };
}

export default TestService;

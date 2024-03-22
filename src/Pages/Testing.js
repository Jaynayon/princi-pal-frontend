import '../App.css'
import React from 'react';
import Paper from '@mui/material/Paper';
import RecordsTable from '../Components/Table/RecordsTable';

function Testing() {
    return (
        <div className="App">
            <header className="App-header">
                <Paper style={styles.paper} elevation={3}>
                    This is a Paper
                </Paper>
                <RecordsTable />
            </header>
        </div>
    );
}

const styles = {
    paper: {
        width: "20%",
        padding: "5%",
        overflowWrap: "break-word",
        fontFamily: 'Mulish-Regular',
        margin: '20px'
    },
}

export default Testing;

import '../App.css';
import React from 'react';
import Paper from '@mui/material/Paper';

function Testing() {
    return (
        <div className="App">
            <header className="App-header">
                <Paper style={styles.paper} elevation={3}>
                    This is a Paper component with some content.asdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasd
                </Paper>
            </header>
        </div>
    );
}

const styles = {
    paper: {
        width: "20%",
        padding: "5%",
        overflowWrap: "break-word"
    },
}

export default Testing;

import React from 'react';
import Paper from '@mui/material/Paper';

function Settings() {
    return (
        <div className="App">
            <header className="App-header">
                <Paper style={styles.paper} elevation={8}>
                    This is a Paper component with some content.asdasdasdasdasasdasdasdasdasdasdasdasdasdasdasasdasdasdasdasdasd
                </Paper>
            </header>
        </div>
    );
}

const styles = {
    paper: {
        width: "70%",
        padding: "20%",
        overflowWrap: "break-word"
    },
}

export default Settings;

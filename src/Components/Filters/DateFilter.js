import React from 'react';
//import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SortIcon from '@mui/icons-material/Sort';

function DateFilter(props) {
    return (
        <React.Fragment>
            <Button variant="text" sx={styles.button}>
                <SortIcon sx={styles.icon} />
                <span style={styles.description}>Sort by Date</span>
            </Button>
        </React.Fragment>
    );
}

const styles = {
    button: {
        fontFamily: 'Mulish-SemiBold',
        fontSize: '14px',
        color: "#4B506D"
    },
    description: {
        marginLeft: '5px',
        textTransform: 'none'
    },
    icon: {
        color: "#C5C7CD",
    }
}

export default DateFilter;
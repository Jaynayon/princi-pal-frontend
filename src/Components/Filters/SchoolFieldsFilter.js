import React from 'react'
import Button from '@mui/material/Button';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import Typography from '@mui/material/Typography';

export default function SchoolFieldsFilter() {
    return (
        <React.Fragment>
            <Button variant="text" >
                <FilterAltIcon sx={styles.icon} />
                <Typography
                    noWrap
                    style={styles.description}
                >
                    Filter
                </Typography>
            </Button>
        </React.Fragment>
    )
}

const styles = {
    description: {
        marginLeft: '5px',
        textTransform: 'none',
        fontFamily: 'Mulish-SemiBold',
        fontSize: '13px',
        color: "#4B506D",
    },
    icon: {
        color: "#C5C7CD",
        backgroundColor: 'white'
    }
}

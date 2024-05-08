import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function BudgetSummary(props) {
    const { title, amount, total = false } = props

    return (
        <Paper sx={{ minWidth: 150, height: 65, m: 1, backgroundColor: total ? '#0077B6' : undefined }} variant='outlined'>
            <Box
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    height: '100%',
                }}
            >
                <Typography variant="body2" align="center" sx={{ fontWeight: 'bold', color: total ? '#ffff' : '#9FA2B4' }}>
                    {title}
                </Typography>
                <Typography variant="body2" align="center" sx={{ fontWeight: 'bold', color: total && '#ffff' }}>
                    Php {amount}
                </Typography>
            </Box>
        </Paper>
    );
}

export default BudgetSummary;
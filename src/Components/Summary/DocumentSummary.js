import React from 'react';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useSchoolContext } from '../../Context/SchoolProvider';
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from '@mui/icons-material/AddBox';

function DocumentSummary({ setOpen }) {
    const { currentDocument, setIsAdding, value, isEditable } = useSchoolContext();

    const handleAddButtonClick = () => {
        if (value === 0) { //can only add row if on LR & RCD tab
            if (currentDocument.id !== 0) {
                setIsAdding(true); // Set isAdding to true when button is clicked
            } else {
                setOpen();
            }
        }
    };

    // Function to format a number with commas and two decimal places
    const formatNumber = (number) => {
        if (typeof number !== 'number') return ''; // Handle non-numeric values gracefully
        return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <React.Fragment>
            <IconButton
                disabled={!isEditable}
                sx={{ alignSelf: "center" }}
                onClick={handleAddButtonClick}
            >
                <AddBoxIcon sx={{ fontSize: 25, color: !isEditable ? '#e0e0e0' : '#20A0F0' }} />
            </IconButton>
            <Grid container pb={1} >
                <Grid item xs={12} md={4} lg={4}>
                    <BudgetSummary total title="Total" amount={formatNumber(currentDocument?.budget || 0)} />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <BudgetSummary title="Budget this month" amount={formatNumber(currentDocument?.cashAdvance || 0)} />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <BudgetSummary
                        title="Balance"
                        amount={formatNumber((currentDocument?.cashAdvance || 0) - (currentDocument?.budget || 0))}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

function BudgetSummary(props) {
    const { title, amount, total = false } = props
    let amountNumber = parseInt(amount);

    return (
        <Paper sx={{
            minWidth: 150, height: 65, m: 1, backgroundColor: total ? '#0077B6' : undefined,

            border: title === "Balance" && amountNumber < 0 && "1px solid red",
            //borderColor: title === "Balance" && amount < 0 ? "red" : undefined,
        }} variant='outlined'>
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
                <Typography variant="body2" align="center"
                    sx={{
                        fontWeight: 'bold',
                        color: title === "Balance" && amountNumber < 0 ? "red" :
                            total ? '#ffff' : '#9FA2B4'
                    }}
                >
                    {title}
                </Typography>
                <Typography variant="body2" align="center"
                    sx={{
                        fontWeight: 'bold',
                        color: title === "Balance" && amountNumber < 0 ? "red" : total && '#ffff'
                    }}
                >
                    Php {amount}
                </Typography>
            </Box>
        </Paper>
    );
}

export default DocumentSummary;
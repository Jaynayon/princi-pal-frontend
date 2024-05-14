import React from 'react';
import BudgetSummary from './BudgetSummary';
import Grid from '@mui/material/Grid';
import { useSchoolContext } from '../../Context/SchoolProvider';
// import { useNavigationContext } from '../../Context/NavigationProvider';
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from '@mui/icons-material/AddBox';

function DocumentSummary(props) {
    const { currentDocument, setIsAdding, value } = useSchoolContext();
    // const { selected, currentSchool } = useNavigationContext();

    const handleAddButtonClick = () => {
        if (value === 0) { //can only add row if on LR & RCD tab
            setIsAdding(true); // Set isAdding to true when button is clicked
        }
    };

    //console.log(currentDocument);

    if (!currentDocument) {
        return null;
    }

    // Function to format a number with commas and two decimal places
    const formatNumber = (number) => {
        if (typeof number !== 'number') return ''; // Handle non-numeric values gracefully
        return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    return (
        <React.Fragment>
            <IconButton
                sx={{ alignSelf: "center" }}
                onClick={handleAddButtonClick}
            >
                <AddBoxIcon sx={{ fontSize: 25, color: '#20A0F0' }} />
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

export default DocumentSummary;
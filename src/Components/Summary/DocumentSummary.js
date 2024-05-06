import React from 'react';
import BudgetSummary from './BudgetSummary';
import Grid from '@mui/material/Grid';
import { useSchoolContext } from '../../Context/SchoolProvider';
import { useNavigationContext } from '../../Context/NavigationProvider';

function DocumentSummary(props) {
    const { currentDocument, fetchDocumentBySchoolIdYearMonth, year, month } = useSchoolContext();
    const { selected } = useNavigationContext();

    console.log(currentDocument);

    React.useEffect(() => {
        fetchDocumentBySchoolIdYearMonth("6634e7fc43d8096920d765ff", year, month);
    }, [selected, month, year])

    if (!currentDocument) {
        return null;
    }



    return (
        <Grid container pb={1} >
            <Grid item xs={12} md={4} lg={4}>
                <BudgetSummary total title="Total" amount={currentDocument.budget} />
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
                <BudgetSummary title="Budget this month" amount={currentDocument.cashAdvance} />
            </Grid>
            <Grid item xs={12} md={4} lg={4}>
                <BudgetSummary title="Balance" amount={currentDocument.cashAdvance - currentDocument.budget} />
            </Grid>
        </Grid>
    );
}

export default DocumentSummary;
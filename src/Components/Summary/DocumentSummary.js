import React from 'react';
import Grid from '@mui/material/Grid';
import { useSchoolContext } from '../../Context/SchoolProvider';
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from '@mui/icons-material/AddBox';
import CustomizedTooltips from '../Tooltip/CustomizedTooltips';
import BudgetSummary from './BudgetSummary';
import { Tooltip } from '@mui/material';

function DocumentSummary({ setOpen }) {
    const { currentDocument, setIsAdding, value, isEditable, isAdding } = useSchoolContext();

    const handleAddButtonClick = () => {
        if (value === 0) { //can only add row if on LR & RCD tab
            if (currentDocument.id !== 0) {
                setIsAdding(!isAdding); // Set isAdding to true when button is clicked
            } else {
                setOpen();
            }
        }
    };

    const tooltipContent = () => {
        return (
            <React.Fragment>
                <span>Adding <i>disabled</i> possibly due to:</span>
                <li>Insufficient balance</li>
                <li>Lack of privileges</li>
                <li>Outdated document <i>(over 3 months from the current month)</i></li>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            {!isEditable || !(currentDocument.cashAdvance > currentDocument.budget) ? (
                <CustomizedTooltips content={tooltipContent()}>
                    <span>
                        <IconButton
                            disabled
                            sx={{ alignSelf: "center" }}
                            onClick={handleAddButtonClick}
                        >
                            <AddBoxIcon
                                sx={{
                                    fontSize: 25,
                                    color: '#e0e0e0'
                                }} />
                        </IconButton>
                    </span>
                </CustomizedTooltips>
            ) : (
                <IconButton
                    sx={{ alignSelf: "center" }}
                    onClick={handleAddButtonClick}
                >
                    <Tooltip title="Add row">
                        <AddBoxIcon
                            sx={{
                                fontSize: 25,
                                color: '#00ee60'
                            }} />
                    </Tooltip>
                </IconButton>
            )}
            <Grid container pb={1} >
                <Grid item xs={12} md={4} lg={4}>
                    <BudgetSummary
                        title="Budget this month"
                        amount={currentDocument?.cashAdvance || 0}
                    />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <BudgetSummary
                        total
                        title="Total Expenses"
                        amount={currentDocument?.budget || 0}
                    />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <BudgetSummary
                        title="Balance"
                        amount={(currentDocument?.cashAdvance || 0) - (currentDocument?.budget || 0)}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default DocumentSummary;
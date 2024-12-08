import { Typography } from "@mui/material";
import React, { memo } from "react";

const DashboardSummaryDetails = ({ currentDocument, month, year, type = "Monthly" }) => {
    let totalBalance;
    let summaryMonth;
    const totalBalanceColor = totalBalance < 0 ? 'red' : 'black';

    if (type === "Annual") {
        totalBalance = Number(currentDocument.annualBudget - currentDocument.annualExpense);
        summaryMonth = `January to December ${year}`;
    } else {
        totalBalance = (currentDocument?.cashAdvance || 0) - (currentDocument?.budget || 0);
        summaryMonth = `${month} ${year}`;
    }

    const formatAmount = (value) => new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);

    const SummaryDetails = ({ description, amount, type }) => {
        return (
            <Typography
                align="left"
                sx={{
                    marginTop: '0',
                    px: '20px',
                    py: '5px',
                    borderBottom: '1px solid #ccc',
                    color: type === 'balance' && totalBalanceColor
                }}>
                {description}: <strong>Php {formatAmount(amount)}</strong>
            </Typography>
        );
    }

    return (
        <React.Fragment>
            <Typography align="left" sx={{ px: '20px', my: '5px', fontWeight: 'bold', fontSize: '20px' }}>Summary</Typography>
            <Typography align="left" sx={{ px: '20px', pb: '10px', marginTop: '0', fontSize: '12px' }}>{summaryMonth}</Typography>
            <SummaryDetails
                description={type === "Annual" ? "Annual Budget" : "Total Monthly Budget"}
                amount={currentDocument?.budget ? currentDocument.budget : '0.00'}
            />
            <SummaryDetails
                description={type === "Annual" ? "Total Annual Expenses" : "Total Budget Limit"}
                amount={currentDocument?.budgetLimit ? currentDocument.budgetLimit : '0.00'}
            />
            <SummaryDetails
                type="balance"
                description={type === "Annual" ? "Total Annual Balance" : "Total Balance"}
                amount={totalBalance.toFixed(2)}
            />
        </React.Fragment>
    );
};

export default memo(DashboardSummaryDetails);
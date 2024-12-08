import { Box, Button, Modal, Paper, TextField, Tooltip } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import React, { memo, useState } from "react";

const AnalyticsCardSummary = ({ title, currentDocument, month, currentUser, setCurrentDocument }) => {
    const [clickedButton, setClickedButton] = useState('');
    const [editableAmounts, setEditableAmounts] = useState({});
    const [open, setOpen] = useState(false);

    const updateDocumentById = async (docId, value) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_DOC}/${docId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                },
                body: JSON.stringify({ budgetLimit: value })
            });

            const data = await response.json();

            if (response.ok) {
                return true;
            } else {
                console.error('Failed to update budget limit:', data);
                return false;
            }
        } catch (error) {
            console.error('Error updating budget limit:', error);
            return false;
        }
    };

    const formatAmount = (value) => new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);

    const handleOpen = (text) => {
        setOpen(true);
        setClickedButton(text);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        const newValue = event.target.value;
        const regex = /^\d+(\.\d{0,2})?$/;
        if (
            newValue === '' ||
            (regex.test(newValue) && parseFloat(newValue) >= 0 && parseFloat(newValue) <= 999999999)
        ) {
            setEditableAmounts({
                ...editableAmounts,
                [clickedButton]: { ...editableAmounts[clickedButton], amount: newValue }
            });
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedAmount = editableAmounts[clickedButton];

        // Get the monthly budget from the current document
        const monthlyBudget = currentDocument?.cashAdvance ? parseFloat(currentDocument.cashAdvance) : 0;

        // Validate if the input amount exceeds the monthly budget
        let finalBudgetLimit = parseFloat(updatedAmount.amount);
        if (finalBudgetLimit > monthlyBudget) {
            finalBudgetLimit = monthlyBudget;
        }

        try {
            if (finalBudgetLimit !== currentDocument?.budgetLimit) {
                const isUpdated = await updateDocumentById(currentDocument.id, finalBudgetLimit);

                if (isUpdated) {
                    setCurrentDocument({
                        ...currentDocument,
                        budgetLimit: finalBudgetLimit // Save the adjusted value
                    });
                    setEditableAmounts({
                        ...editableAmounts,
                        [clickedButton]: { ...editableAmounts[clickedButton], amount: '' }
                    });
                    setOpen(false);
                } else {
                    console.error('Failed to save budget limit');
                }
            } else {
                setOpen(false); // Close the modal if the value is the same
            }
        } catch (error) {
            console.error('Error saving budget limit:', error);
        }
    };

    const amountData = editableAmounts[title] || { currency: '', amount: '' };
    let displayTitle = title;
    if (title === 'totalExpenses') displayTitle = 'Total Expenses';
    else if (title === 'budgetLimit') displayTitle = 'Budget Limit';
    else if (title === 'totalBalance') displayTitle = 'Total Balance';
    else if (title === 'annualBalance') displayTitle = 'Annual Balance';

    const annualBalance = Number(currentDocument.annualBudget - currentDocument.annualExpense) || 0;
    const totalBalance = (currentDocument.cashAdvance || 0) - (currentDocument.budget || 0);
    const totalBalanceColor = totalBalance < 0 ? 'red' : 'black';

    const DisplayAnalytics = ({ amount, type }) => {
        return (
            <p style={{ fontSize: 'clamp(1.5rem, 2vw, 1.9rem)', fontWeight: 'bold', color: type === "balance" && totalBalanceColor }}>
                Php {formatAmount(amount)}
            </p>
        );
    }

    const getTitleColor = (title, totalBalance) => {
        switch (title) {
            case 'Total Expenses':
                return "orange";
            case 'Budget Limit':
                return "#20A0F0";
            case 'Annual Balance':
                return totalBalance.toFixed(2) >= 0 ? "#803df5" : "red";
            default:
                return totalBalance.toFixed(2) >= 0 ? "#32b14a" : "red";
        }
    }

    const getTooltipContent = (title) => {
        switch (title) {
            case 'Total Expenses':
                return `Total LR & RCD expenses for the month of ${month}`;
            case 'Budget Limit':
                return `Threshold to notify users when Total Expenses for ${month} exceed this limit`;
            case 'Annual Balance':
                return "Remaining balance for the entire year after expenses";
            default:
                return "Remaining balance from your monthly cash advance after expenses";
        }
    }

    if (!currentDocument) {
        return null;
    }

    return (
        <Paper
            sx={{
                position: 'relative',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 160,
                textAlign: 'left',
                borderLeft: 5,
                borderLeftColor: getTitleColor(displayTitle, totalBalance),
                paddingLeft: '30px',
            }}
        >
            <Tooltip title={getTooltipContent(displayTitle)} placement='top'>
                <span style={{ fontSize: 17 }}>{displayTitle}</span>
            </Tooltip>
            {displayTitle === 'Total Expenses' && (
                <DisplayAnalytics amount={currentDocument.budget ? currentDocument.budget : '0.00'} />
            )}
            {displayTitle === 'Budget Limit' && (
                <React.Fragment>
                    <DisplayAnalytics amount={currentDocument.budgetLimit ? currentDocument.budgetLimit : '0.00'} />
                    <Tooltip title={"Set Budget Limit"}>
                        <Button
                            sx={{ display: currentUser.position !== "Principal" && "none" }}
                            onClick={() => handleOpen(title)}
                            className={clickedButton === title ? 'clicked' : ''}
                            style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                background: 'none',
                                border: 'none',
                                padding: 0
                            }}
                        >
                            <EditIcon sx={{ color: "#20A0F0", width: '30px', height: '30px' }} />
                        </Button>
                    </Tooltip>
                </React.Fragment>
            )}
            {displayTitle === 'Total Balance' && (
                <DisplayAnalytics amount={totalBalance.toFixed(2)} type="balance" />
            )}
            {displayTitle === 'Annual Balance' && (
                <DisplayAnalytics amount={annualBalance.toFixed(2)} type="balance" />
            )}
            <Modal
                open={open && clickedButton === title}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    width: 400,
                    borderRadius: '15px',
                    textAlign: 'center',
                }}>
                    <Button onClick={handleClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#757575', fontSize: '1.5rem', cursor: 'pointer' }}>×</Button>
                    <h2 id="modal-modal-title" style={{ fontSize: '30px', marginBottom: '20px' }}>Set {displayTitle}</h2>
                    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                        <TextField
                            type="text"
                            value={amountData.amount}
                            onChange={handleChange}
                            label="Input New Amount"
                        />
                    </form>
                    <div style={{ marginBottom: '20px' }}>
                        <Button onClick={handleSubmit} style={{ backgroundColor: '#20A0F0', borderRadius: '10px', color: '#fff', width: '160px', padding: '10px 0' }}>Save</Button>
                    </div>
                </Box>
            </Modal>
        </Paper>
    );
};

export default memo(AnalyticsCardSummary);
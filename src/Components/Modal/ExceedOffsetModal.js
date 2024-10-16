import React, { useEffect, memo } from 'react';

// Custom component import
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DialogContentText, Typography } from '@mui/material';
import { useSchoolContext } from '../../Context/SchoolProvider';
import axios from 'axios';

const ExceedOffsetModal = memo(({ open, onClose, amountExceeded }) => {
    const { currentDocument, isEditingRef, updateLrById, createLrByDocId, fetchDocumentData } = useSchoolContext();
    const [data, setData] = React.useState(null);

    let newValue = Number(data?.amount) - Number(amountExceeded.exceeded);

    const updateOffset = async () => {
        if (data) {
            await updateLrById("amount", data.id, newValue);
        }
    };

    const handleNext = async () => {
        if (amountExceeded.rowId === 3) {
            if (data?.amount > amountExceeded.exceeded) {
                await updateOffset();
            }
            // If the row is the add row
            await createLrByDocId(amountExceeded.docId, amountExceeded.newValue);
            await fetchDocumentData();
        } else {
            if (data?.amount > amountExceeded.exceeded) {
                await updateOffset();
            }
            // Update the amount in the database
            await updateLrById(amountExceeded.colId, amountExceeded.rowId, amountExceeded.newValue);
        }
        onClose();
    };

    const formatAmount = (value) => new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);

    useEffect(() => {
        // Blurring the cell in LRRow will set isEditing to false
        // This will prevent to fetch the data from the server before confirmation
        isEditingRef.current = open;

        const fetchHighestOffsetLr = async () => {
            try {
                if (currentDocument) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL_LR}/documents/${currentDocument.id}/highest`, {
                        headers: {
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                        }
                    });
                    console.log(response.data);
                    setData(response.data || null);
                }
            } catch (error) {
                console.error('Error processing data:', error);
                setData(null); // Fallback in-case no data is received
            }
        }

        if (open) {
            fetchHighestOffsetLr();
        }
    }, [currentDocument, open, isEditingRef]);

    const StyledSpan = ({ children, bgColor = '#e2e4e5', textColor = '#000' }) => (
        <span style={{
            fontWeight: 'bold',
            backgroundColor: bgColor,
            color: textColor,
            padding: '1px 6px',
            borderRadius: '5px',
            display: 'inline-block'
        }}>
            {children}
        </span>
    );

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="exceed-warning-dialog-title"
                maxWidth="xs"
            >
                <DialogTitle id="exceed-warning-dialog-title">
                    Are you sure you want to proceed?
                </DialogTitle>
                <DialogContent sx={{
                    display: "flex",
                    flexDirection: "column",
                    pb: 1
                }}>
                    <DialogContentText sx={{ color: 'black', mb: 1 }}>
                        <span style={{
                            fontWeight: 'bold',
                            color: "white",
                            backgroundColor: data?.amount > amountExceeded.exceeded ? "#32b14a" : '#f44133',  // Soft green background
                            padding: '1px 6px',
                            borderRadius: '5px',
                            display: 'inline-block',
                            fontSize: 11
                        }}>
                            {data ?
                                data.amount > amountExceeded.exceeded ? "Transport UACS found" :
                                    "Offset Exceeds LR" :
                                "No Transport UACS found"}
                        </span>
                    </DialogContentText>
                    <DialogContentText sx={{ color: 'black', mb: 1 }}>
                        {data?.amount > amountExceeded.exceeded ? (
                            <>
                                <Typography variant="body2">
                                    Date: <StyledSpan>{data?.date}</StyledSpan>
                                </Typography>
                                <Typography variant="body2">
                                    ORS/BURS No.: <StyledSpan>{data?.orsBursNo}</StyledSpan>
                                </Typography>
                                <Typography variant="body2">
                                    Payee: <StyledSpan>{data?.payee}</StyledSpan>
                                </Typography>
                                <Typography variant="body2">
                                    Particulars: <StyledSpan>{data?.particulars}</StyledSpan>
                                </Typography>
                                <Typography variant="body2">
                                    Object Code: <StyledSpan>{data?.objectCode}</StyledSpan>
                                </Typography>
                                <Typography variant="body2">
                                    Nature of Payment: <StyledSpan>{data?.natureOfPayment}</StyledSpan>
                                </Typography>
                                <Typography variant="body2">
                                    Payee: <StyledSpan>{data?.payee}</StyledSpan>
                                </Typography>
                                <Typography variant="body2">
                                    New Amount:
                                    <StyledSpan>₱{formatAmount(data?.amount)}</StyledSpan>
                                    {" "}-{" "}
                                    <span style={{
                                        fontWeight: 'bold',
                                        backgroundColor: '#f44133',  // Dark green text for contrast
                                        color: '#fff',
                                        padding: '1px 6px',
                                        borderRadius: '5px',
                                        display: 'inline-block'
                                    }}>
                                        ₱{formatAmount(amountExceeded.exceeded)}
                                    </span>
                                    {" "}={" "}
                                    <span style={{
                                        fontWeight: 'bold',
                                        backgroundColor: '#32b14a',  // Dark green text for contrast
                                        color: '#fff',
                                        padding: '1px 6px',
                                        borderRadius: '5px',
                                        display: 'inline-block'
                                    }}>
                                        ₱{formatAmount(newValue)}
                                    </span>
                                </Typography>
                                By proceeding, the balance of this LR will be used to offset the excess amount,
                                ensuring that the total expenses do not exceed the monthly budget.
                            </>
                        ) : (
                            <>
                                Submitting this amount will <strong>exceed</strong> the budget by
                                <span style={{
                                    fontWeight: 'bold',
                                    color: "white",
                                    backgroundColor: '#f44133',  // Soft green background
                                    padding: '1px 6px',
                                    borderRadius: '5px',
                                    display: 'inline-block'
                                }}>
                                    ₱{formatAmount(amountExceeded.exceeded)}
                                </span>
                                .
                                Are you sure you want to continue?
                            </>
                        )}
                    </DialogContentText>
                    <DialogActions>
                        <Button onClick={onClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleNext} color="primary">
                            Next
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
});

export default ExceedOffsetModal;


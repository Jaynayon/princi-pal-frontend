import React, { useEffect } from 'react';

// Custom component import
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DialogContentText } from '@mui/material';
import { useSchoolContext } from '../../Context/SchoolProvider';

export default function ExceedWarningModal({ open, onClose, amountExceeded }) {
    const { isEditingRef, updateLrById, createLrByDocId, fetchDocumentData } = useSchoolContext();

    const handleNext = async () => {
        if (amountExceeded.rowId === 3) {
            // If the row is the add row
            await createLrByDocId(amountExceeded.docId, amountExceeded.newValue);
            await fetchDocumentData();
        } else {
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
    }, [open, isEditingRef]);

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
                    <DialogContentText sx={{ color: 'black' }}>
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
                        By proceeding, this LR will be flagged and moved for <strong>approval</strong>.
                        Are you sure you want to continue?
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
}


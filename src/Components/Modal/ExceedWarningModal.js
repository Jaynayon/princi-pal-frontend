import React from 'react';

// Custom component import
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { DialogContentText } from '@mui/material';

export default function ExceedWarningModal({ open, onClose }) {
    const handleLogout = (e) => {
        console.log("test")
    };

    return (
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
                    Submitting this amount will <strong>exceed</strong> the budget by 1000.
                    By proceeding, this LR will be flagged and moved for <strong>approval</strong>.
                    Are you sure you want to continue?
                </DialogContentText>
                <DialogActions>

                    <Button onClick={onClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleLogout} color="primary">
                        Logout
                    </Button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}
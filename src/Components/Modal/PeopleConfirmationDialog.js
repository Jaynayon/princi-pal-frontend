import React, { memo } from 'react';

// Custom component import
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const PeopleConfirmationDialog = ({ open, onClose, onConfirm, onCancel, message, onConfirmText, onCancelText }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="confirmation-dialog-title"
            maxWidth="xs"
            fullWidth
        >
            <Box sx={{ p: 3, pb: 2.5 }}>
                <DialogTitle
                    id="confirmation-dialog-title"
                    sx={styles.title}
                >
                    {message}
                </DialogTitle>
                <DialogContent sx={styles.content}>
                    <DialogActions sx={{ p: 0 }}>
                        <Box>
                            <Button
                                sx={[styles.button, { backgroundColor: "#f2f2f2", color: "black", mr: 1 }]}
                                onClick={onCancel}
                            >
                                {onCancelText}
                            </Button>
                            <Button
                                sx={[styles.button, { backgroundColor: "#1565c0", color: "white" }]}
                                onClick={onConfirm}
                            >
                                {onConfirmText}
                            </Button>
                        </Box>
                    </DialogActions>
                </DialogContent>
            </Box>
        </Dialog>
    );
}

export default memo(PeopleConfirmationDialog);

const styles = {
    title: {
        fontFamily: "Mulish",
        fontWeight: "bold",
        fontSize: 15,
        p: 0,
        pb: 3
    },
    content: {
        display: "flex",
        flexDirection: "row",
        justifyContent: " flex-end",
        p: 0
    },
    button: {
        textTransform: 'none',
        fontFamily: "Mulish",
        fontSize: 15,
        px: 3
    }
}
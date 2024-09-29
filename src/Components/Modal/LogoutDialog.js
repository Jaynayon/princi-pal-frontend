import React from 'react';

// Custom component import
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

export default function LogoutDialog({ open, onClose }) {
    const handleLogout = (e) => {
        // Remove local storage to reset initial selected state
        window.localStorage.removeItem("LOCAL_STORAGE_SELECTED");
        e.preventDefault();

        // Remove token
        if (JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))) {
            window.localStorage.removeItem("LOCAL_STORAGE_TOKEN")
            window.location.href = "https://localhost:3000/";
        } else {
            console.log("Local storage item not found");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="logout-dialog-title"
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle id="logout-dialog-title">Are you sure you want to Logout?</DialogTitle>
            <DialogContent sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: " flex-end",
                p: 0
            }}>
                <DialogActions>
                    <Box>
                        <Button onClick={onClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleLogout} color="primary">
                            Logout
                        </Button>
                    </Box>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}
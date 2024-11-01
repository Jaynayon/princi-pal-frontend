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
            window.location.href = `${process.env.REACT_APP_FRONTEND_URL}`;
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
            <Box sx={{ p: 3, pb: 2.5 }}>
                <DialogTitle
                    id="logout-dialog-title"
                    sx={styles.title}
                >
                    Are you sure you want to log out?
                </DialogTitle>
                <DialogContent sx={styles.content}>
                    <DialogActions sx={{ p: 0 }}>
                        <Box>
                            <Button
                                sx={[styles.button, { backgroundColor: "#f2f2f2", color: "black", mr: 1 }]}
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                sx={[styles.button, { backgroundColor: "#1565c0", color: "white" }]}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                        </Box>
                    </DialogActions>
                </DialogContent>
            </Box>

        </Dialog>
    );
}

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
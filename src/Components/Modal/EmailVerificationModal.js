import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import React, { memo } from 'react';

const EmailVerificationModal = memo(({ openModal, handleCloseModal, currentUser }) => {
    return (
        <Dialog open={openModal} onClose={handleCloseModal}>
            <Box sx={{ p: 3 }} >
                <DialogTitle sx={{ p: 0, mb: 1 }} >Email Verification Status</DialogTitle>
                <DialogContent sx={{ p: 0, mb: 1 }}>
                    <Typography>
                        A verification email has been sent to <strong>{currentUser.email}</strong>.
                        Please check your inbox.
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 0 }}>
                    <Button
                        sx={{
                            backgroundColor: "#1565c0",
                            color: "white",
                            textTransform: 'none',
                            fontFamily: "Mulish",
                            fontSize: 15,
                            px: 3
                        }}
                        onClick={handleCloseModal} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
});

export default EmailVerificationModal;

import { Backdrop, Box, Fade, Modal, Paper, Typography } from '@mui/material';
import React, { memo } from 'react';
import CreateSchoolTab from '../Tabs/CreateSchoolTab';

const CreateSchoolModal = memo(({ open, handleClose }) => {
    return (
        <Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
            >
                <Fade in={open}>
                    <Paper sx={[styles.paper, { paddingTop: 3 }]}>
                        <Box>
                            <Typography
                                sx={{ color: "#252733" }}
                                variant='h6'
                                component="h1"
                                color="inherit"
                                noWrap>
                                Create School
                            </Typography>
                            <Box sx={{ maxHeight: 500, overflowY: "auto" }}>
                                <CreateSchoolTab />
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            </Modal>
        </Box>
    );
});

const styles = {
    paper: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: 24,
        p: 4.5,
        width: 400,
        borderRadius: '15px',
    }
}

export default CreateSchoolModal;
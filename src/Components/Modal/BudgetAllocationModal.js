import React from 'react';
import {
    Paper,
    Box,
    Modal,
    Backdrop,
    Fade,
    Typography
} from '@mui/material';
import BudgetAllocationContent from './BudgetAllocationContent';

export default function BudgetAllocationModal({ open, handleClose }) {

    return (
        <Box >
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
                                Budget Allocation
                            </Typography>
                            <BudgetAllocationContent />
                        </Box>
                    </Paper>
                </Fade>
            </Modal>
        </Box>
    );
}

const styles = {
    tab: {
        minHeight: '10px',
        '&.Mui-selected': {
            color: 'black', // Color of selected tab
            fontWeight: 'bold', // Font weight of selected tab
        },
    },
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

import React from 'react';
import {
    Paper,
    Box,
    Modal,
    Backdrop,
    Fade,
    Typography,
    Button
} from '@mui/material';

import { useSchoolContext } from '../../Context/SchoolProvider';
import { transformSchoolText } from '../Navigation/Navigation';
// import { useNavigationContext } from '../Context/NavigationProvider';

// Current document is passed by value to allow reusability for AnnualTab
export default function BudgetConfirmModal({ open, handleClose, handleCloseParent, value }) {
    const { currentSchool, year, fetchDocumentData, initializeDocuments } = useSchoolContext();

    const budgetPerMonth = Number((value / 12).toFixed(2));

    const formattedPerMonth = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(budgetPerMonth);

    const handleOnClick = async () => {
        try {
            await initializeDocuments(value);
            // fetch updated document data
            await fetchDocumentData();
        } catch (error) {
            console.error('Error in handleOnClick:', error);
        } finally {
            handleClose();
            handleCloseParent();
        }
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
        >
            <Fade in={open}>
                <Paper sx={[styles.paper, { p: 3, pb: 2 }]}> {/*Overload padding component*/}
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                        Are you sure you want to set the desired amount?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                        You can only set the budget{' '}
                        <span style={{
                            fontWeight: 'bold',
                            backgroundColor: '#e2e4e5',  // Soft green background
                            padding: '1px 6px',
                            borderRadius: '4px',
                            display: 'inline-block'
                        }}>
                            once
                        </span>
                        {' '}per fiscal year. This action cannot be undone.
                    </Typography>
                    <Typography id="modal-modal-amount" sx={{ mt: 1 }}>
                        The monthly budget for{' '}
                        <span style={{
                            fontWeight: 'bold',
                            backgroundColor: '#e2e4e5',  // Soft green background
                            padding: '1px 6px',
                            borderRadius: '5px',
                            display: 'inline-block'
                        }}>

                            {transformSchoolText(currentSchool?.name)}
                        </span>
                        {' '}from January to December{' '}
                        <span style={{
                            fontWeight: 'bold',
                            backgroundColor: '#e2e4e5',  // Soft green background
                            padding: '1px 6px',
                            borderRadius: '5px',
                            display: 'inline-block'
                        }}>
                            {year}
                        </span>
                        {' '}will be{' '}
                        <span style={{
                            fontWeight: 'bold',
                            backgroundColor: '#32b14a',  // Soft green background
                            color: '#ffff',  // Dark green text for contrast
                            padding: '1px 6px',
                            borderRadius: '5px',
                            display: 'inline-block'
                        }}>
                            ₱{formattedPerMonth}
                        </span>
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: " flex-end",
                        pt: 1
                    }}>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => handleOnClick()} color="primary">
                            Save
                        </Button>
                    </Box>
                </Paper>
            </Fade>
        </Modal>
    )
}

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
        //textAlign: 'center',
    }
}
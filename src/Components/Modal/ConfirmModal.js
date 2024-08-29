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
import RestService from '../../Services/RestService';
// import { useNavigationContext } from '../Context/NavigationProvider';

// Current document is passed by value to allow reusability for AnnualTab
export default function ConfirmModal({ currentDocument, month, open, handleClose, handleCloseParent = null, value }) {
    const { fetchDocumentData, createNewDocument, jev } = useSchoolContext();

    const updateDocumentById = async (newValue) => {
        try {
            const response = await RestService.updateDocumentById(currentDocument?.id, "Cash Advance", newValue);
            if (response) {
                console.log(`Document with id: ${currentDocument?.id} is updated`);
            } else {
                console.log("Document not updated");
            }
            fetchDocumentData(); //fetch data changes
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    const handleOnClick = async () => {
        let obj = {}
        obj = { cashAdvance: value }
        console.log(jev)
        // jev length upon initialization will always be > 2
        if (currentDocument?.id === 0 || jev === null || jev === undefined || (Array.isArray(jev) && jev.length === 0)) { //if there's no current document or it's not yet existing
            await createNewDocument(obj, month, value);
        } else {
            await updateDocumentById(value); //update field in db
        }

        handleClose();
        if (typeof handleCloseParent === 'function') { // If a parent setter is passed
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
                        You can only set your budget
                        <span style={{ fontWeight: 'bold' }}> once </span>
                        per month for each school. This action cannot be undone.
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
import React from 'react';
import {
    Paper,
    Box,
    Modal,
    Backdrop,
    Fade,
    Typography,
    AccordionActions,
    Button
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useSchoolContext } from '../../Context/SchoolProvider';
import { useAppContext } from '../../Context/AppProvider';
import axios from 'axios';

export default function ApprovalModal({ open, handleClose }) {
    const { currentUser } = useAppContext();
    const { lrNotApproved, deleteLrByid, updateLrById } = useSchoolContext();

    const handleReject = async (id) => {
        try {
            const lastHistory = await getLastLrHistory(id);
            console.log(lastHistory)
            if (lastHistory.lrCopy) {
                await deleteLrByid(id);
            } else {
                await updateLrById("amount", id, lastHistory.oldValue);
            }
        } catch (e) {
            console.error(e);
        }
        handleClose();
    };

    const handleAccept = async (id) => {
        await updateLrById("approved", id, true);
        handleClose();
    };

    const getLastLrHistory = async (id) => {
        try {
            if (id) {
                const response = await axios.get(`${process.env.REACT_APP_API_URL_HISTORY}/lr/${id}/last`);
                return response.data;
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    const formatAmount = (value) => new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);

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
                                Approval
                            </Typography>
                            <Box sx={{ maxHeight: 500, overflowY: "auto" }}>
                                {lrNotApproved.map((item) => {
                                    return (
                                        <Accordion key={item.id}>
                                            <AccordionSummary
                                                expandIcon={<ExpandMoreIcon />}
                                                aria-controls={`panel${item.id}-content`}
                                                id={`panel${item.id}-header`}
                                            >
                                                <Box>
                                                    <Typography sx={{ color: '#faca2b', fontSize: 14 }}>
                                                        Pending
                                                    </Typography>
                                                    <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary' }}>
                                                        {item.date}
                                                    </Typography>
                                                </Box>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography variant="body2" gutterBottom>
                                                    An LR has been created and moved for approval as the allotted amount may
                                                    <span style={{ fontWeight: "bold" }}> exceed </span> the monthly budget.
                                                </Typography>
                                                {item && [
                                                    { label: "Date", value: item.date },
                                                    { label: "ORS/BURS No.", value: item.orsBursNo },
                                                    { label: "Payee", value: item.payee },
                                                    { label: "Particulars", value: item.particulars },
                                                    { label: "Object Code", value: item.objectCode },
                                                    { label: "Nature Of Payment", value: item.natureOfPayment },
                                                    { label: "New Amount", value: item.amount },
                                                ].map((lr, idx) => (
                                                    <Typography variant="body2" key={`${item.id}-${idx}`}>
                                                        {lr.label}: <span style={{
                                                            fontWeight: 'bold',
                                                            backgroundColor: lr.label === "New Amount" ? '#32b14a' : '#e2e4e5',  // Dark green text for contrast
                                                            color: lr.label === "New Amount" && '#fff',
                                                            padding: '1px 6px',
                                                            borderRadius: '5px',
                                                            display: 'inline-block'
                                                        }}>
                                                            {lr.label === "New Amount" ? `₱${formatAmount(lr.value)}` : lr.value}
                                                        </span>
                                                    </Typography>
                                                ))}
                                            </AccordionDetails>
                                            <AccordionActions>
                                                {currentUser.position === "Principal" ? (
                                                    <>
                                                        <Button onClick={() => handleReject(item.id)}>Reject</Button>
                                                        <Button onClick={() => handleAccept(item.id)}>Approve</Button>
                                                    </>
                                                ) : (
                                                    <Button onClick={() => handleReject(item.id)}>Cancel</Button>
                                                )}

                                            </AccordionActions>
                                        </Accordion>
                                    );
                                })
                                }
                            </Box>
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

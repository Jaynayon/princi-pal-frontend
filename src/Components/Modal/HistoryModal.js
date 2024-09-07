import React from 'react';
import {
    Paper,
    Box,
    Modal,
    Backdrop,
    Fade,
    Typography
} from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from 'axios';

import { useSchoolContext } from '../../Context/SchoolProvider';
// import { useNavigationContext } from '../../Context/NavigationProvider';

const labelMap = {
    date: "Date",
    orsBursNo: "ORS/BURS No.",
    payee: "Payee",
    particulars: "Particulars",
    objectCode: "Object Code",
    natureOfPayment: "Nature Of Payment",
    amount: "Amount"
};

export default function HistoryModal({ open, handleClose, handleCloseParent, index }) {
    const { lr } = useSchoolContext();
    const [history, setHistory] = React.useState([]);

    const onClose = () => {
        handleClose();
        handleCloseParent();
    }

    React.useEffect(() => {
        const getLrHistory = async () => {
            try {
                console.log(lr[index].id);
                if (lr) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL_HISTORY}/lr/${lr[index].id}`);
                    console.log(response.data);
                    setHistory(response.data);
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        }

        if (open && lr) {
            getLrHistory();
            console.log("Yes history is opened, fetch changes");
        }
    }, [open, index, lr]);

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
            // Ensure modal content is focusable
            disableScrollLock={false}
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
                            History
                        </Typography>
                        <Box sx={{ maxHeight: 500, overflowY: "auto" }}>
                            {history.map((item) => {
                                const statusStyles = {
                                    created: { color: '#21c354', text: 'Created' },
                                    deleted: { color: '#ff4b4b', text: 'Deleted' },
                                    modified: { color: '#faca2b', text: 'Modified' },
                                };

                                const getStatus = (item) => {
                                    if (item.created) return statusStyles.created;
                                    if (item.deleted) return statusStyles.deleted;
                                    return statusStyles.modified; // Default to "modified" if neither created nor deleted
                                };

                                const status = getStatus(item);

                                return (
                                    <Accordion key={item.id}>
                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls={`panel${index}-content`}
                                            id={`panel${index}-header`}
                                        >
                                            <Box>
                                                <Typography sx={{ color: status.color, fontSize: 14 }}>
                                                    {status.text}
                                                </Typography>
                                                <Typography variant="body2" gutterBottom sx={{ color: 'text.secondary' }}>
                                                    {item.updateDate}
                                                </Typography>
                                            </Box>
                                        </AccordionSummary>
                                        <AccordionDetails>
                                            <Typography variant="body2" gutterBottom>
                                                {`${item.user.fname} ${item.user.lname} ${status.text.toLowerCase()}`} an LR entry. {/* lr[index]?.id */}
                                            </Typography>
                                            {status.text === "Modified" && (
                                                <Typography variant="body2" gutterBottom>
                                                    Modified the <span style={{ fontWeight: "bold" }}>{labelMap[item.fieldName]}</span> field
                                                    by changing the value from <span style={{ fontWeight: "bold" }}>{item.oldValue}</span> to <span style={{ fontWeight: "bold" }}>{item.newValue}</span>
                                                </Typography>
                                            )}
                                            {item.lrCopy && [
                                                { label: "Date", value: item.lrCopy.date },
                                                { label: "ORS/BURS No.", value: item.lrCopy.orsBursNo },
                                                { label: "Payee", value: item.lrCopy.payee },
                                                { label: "Particulars", value: item.lrCopy.particulars },
                                                { label: "Object Code", value: item.lrCopy.objectCode },
                                                { label: "Nature Of Payment", value: item.lrCopy.natureOfPayment },
                                                { label: "Amount", value: item.lrCopy.amount },
                                            ].map((lr, idx) => (
                                                <Typography variant="body2" key={`${item.id}-${idx}`}>
                                                    {lr.label}: <span style={{ fontWeight: "bold" }}>{lr.value}</span>
                                                </Typography>
                                            ))}
                                        </AccordionDetails>
                                    </Accordion>
                                );
                            })}
                        </Box>
                    </Box>
                </Paper>
            </Fade>
        </Modal>
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

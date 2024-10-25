import React, { useCallback, useEffect, useState } from 'react';
import {
    Paper,
    Box,
    Modal,
    Backdrop,
    Fade,
    Typography,
    CircularProgress
} from '@mui/material';
import { useSchoolContext } from '../../Context/SchoolProvider';
import axios from 'axios';

const SummaryModal = React.memo(({ open, handleClose }) => {
    const [loading, setLoading] = React.useState(false);
    const [summary, setSummary] = useState([]);
    const { currentDocument } = useSchoolContext();

    useEffect(() => {
        const fetchData = async () => {
            if (!open) return; // Only fetch if modal is open

            setLoading(true);
            try {
                if (currentDocument) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL_LR}/jev/documents/${currentDocument.id}/summary`, {
                        headers: {
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                        }
                    });
                    setSummary(response.data);
                }
            } catch (error) {
                setSummary([]);
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [open, currentDocument]);

    console.log(summary);

    const renderSummary = useCallback(() => {
        // Helper function to render LR items related to the specific JEV's uacsCode
        const renderLr = (relatedLrItems) => {
            if (!relatedLrItems || relatedLrItems.length === 0) {
                // return <Typography>No related data found.</Typography>;
                return;
            }

            // Map over the related LR items and display them
            return relatedLrItems.map((lrItem, lrIndex) => (
                <Typography
                    key={lrIndex}
                    sx={{ color: "#252733" }}
                    variant='body2'
                    component="h1"
                    color="inherit"
                    noWrap>
                    {lrItem.description} : {lrItem.amount}
                </Typography>
            ));
        };

        if (!summary || summary.length === 0) {
            return <Typography>No data available.</Typography>;
        }

        return (
            <React.Fragment>
                {summary.map((item, jevIndex) => {
                    return (
                        <Box key={jevIndex}>
                            {/* Render JEV item */}
                            <Typography
                                sx={{ color: "#252733" }}
                                variant='body1'
                                component="h1"
                                color="inherit"
                                noWrap>
                                {item.uacsName} : {item.uacsCode}
                            </Typography>

                            {/* Render related LR items */}
                            <Box sx={{ marginTop: 1 }}>
                                {renderLr(item.lrs)} {/* Pass lrs: contains LRs under a JEV */}
                            </Box>
                        </Box>
                    );
                })}
            </React.Fragment>
        );
    }, [summary]);

    return (
        <Box >
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="summary-modal-title"
                aria-describedby="summary-modal-description"
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
                                Summary
                            </Typography>
                            <Box sx={{ maxHeight: 500, overflowY: "auto" }}>
                                {loading
                                    ? <Box
                                        sx={{
                                            display: "flex",
                                            minHeight: 150,
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <CircularProgress />
                                    </Box>
                                    : renderSummary()
                                }


                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            </Modal>
        </Box>
    );
});

export default SummaryModal;

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

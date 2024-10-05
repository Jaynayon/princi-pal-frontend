import React, { useEffect, useState, useRef } from 'react';
import '../App.css';
import PropTypes from 'prop-types';
import {
    Paper,
    Tabs,
    Tab,
    Container,
    Grid,
    Box,
    Button,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import Badge from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import FactCheckIcon from '@mui/icons-material/FactCheck';

import {
    FilterDate,
    SchoolSearchFilter
} from '../Components/Filters/FilterDate';
import axios from 'axios';
import { saveAs } from 'file-saver';

import { useSchoolContext } from '../Context/SchoolProvider';

import DocumentTable from '../Components/Table/LRTable';
import JEVTable from '../Components/Table/JEVTable';
import DocumentSummary from '../Components/Summary/DocumentSummary';
import { useNavigationContext } from '../Context/NavigationProvider';
import BudgetAllocationModal from '../Components/Modal/BudgetAllocationModal';
import ApprovalModal from '../Components/Modal/ApprovalModal';
import WarningIcon from '@mui/icons-material/Warning';

export function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    const isHidden = value !== index;

    return (
        <Box
            role="tabpanel"
            hidden={isHidden}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {!isHidden && (
                <Box sx={{ paddingTop: 1 }}>
                    {children}
                </Box>
            )}
        </Box>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

export function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
    },
}));

function SchoolPage(props) {
    const { currentUser, fetchUserNotifications } = useNavigationContext();
    const { year, month, setIsAdding, isEditingRef, currentDocument, currentSchool, lrNotApproved, updateLr, updateJev, value, setValue } = useSchoolContext();
    const [open, setOpen] = React.useState(false);
    const [openApproval, setOpenApproval] = React.useState(false);
    const [exportIsLoading, setExportIsLoading] = React.useState(false);
    const previousBalanceRef = useRef(null);
    const notificationKeysRef = useRef(new Set());
    const isInitialLoad = useRef(true);const [notificationMessage, setNotificationMessage] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
        isEditingRef.current = true;
    }

    const handleClose = () => {
        setOpen(false);
        isEditingRef.current = false;
    }

    const handleOpenApproval = () => {
        setOpenApproval(true);
    }

    const handleCloseApproval = () => {
        setOpenApproval(false);
    }

    const exportDocument = async () => {
        setExportIsLoading(true);  // Start loading
        try {
            if (currentSchool && currentDocument && currentUser) {
                const response = await axios.post(`${process.env.REACT_APP_API_URL_DOWNLOAD}`, {
                    userId: currentUser.id,
                    documentId: currentDocument.id,
                    schoolId: currentSchool.id,
                    year,
                    month
                }, {
                    responseType: 'blob',  // Set the response type to 'blob' to handle binary data
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                    }
                });

                // Extract blob data from the response
                const blobData = new Blob([response.data], { type: 'application/octet-stream' });

                // Use FileSaver.js to trigger file download
                saveAs(blobData, `Documents-${month}-${year}.zip`);

                if (blobData) {
                    console.log("Successfully exported document")
                }
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        } finally {
            setExportIsLoading(false);  // End loading
        }
    };

    const exportDocumentOnClick = async () => { await exportDocument(); }

    console.log("Schools renders")

    // Ensures to update lr and jev only if its not loading and there's a current document
    React.useEffect(() => {
        console.log("Schools useEffect: Document fetched, updating lr and jev");
        // update lr and jev has currentDocument as a dependency
        // fetch lr and jev per document change
        updateLr();
        updateJev();
        setIsAdding(false); //reset state to allow addFields again
    }, [currentDocument, updateLr, updateJev, setIsAdding, value]); // Listen to "value" when changing tabs; reset isAdding

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

useEffect(() => {
    if (currentDocument) {
        const { cashAdvance = 0, budget = 0 } = currentDocument;
        const balance = cashAdvance - budget;
        const previousBalance = previousBalanceRef.current;
        const balanceChanged = balance !== previousBalance;
        const balanceIsNegative = balance < 0;
        const notificationKey = `negative-balance-${currentDocument.id}-${balance}`;

        if (!isInitialLoad.current && balanceIsNegative && balanceChanged) {
            const notificationsSent = JSON.parse(localStorage.getItem('notificationsSent')) || {};
            if (!notificationsSent[notificationKey]) { // Check if the notification has already been sent
                const notification = {
                    userId: currentUser.id,
                    details: `Balance is negative!`,
                    timestamp: new Date().toISOString(),
                };

                // Simulate an API call to create a notification with Authorization header
                axios.post(`${process.env.REACT_APP_API_URL_NOTIF}/create`, notification, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                    }
                })
                .then(response => {
                    console.log('Notification created:', `Balance is negative!`);
                })
                .catch(error => {
                    console.error('Error creating notification:', error);
                });

                setNotificationMessage(`Balance is negative!`);

                // Update local storage to reflect the notification was sent
                notificationsSent[notificationKey] = true;
                localStorage.setItem('notificationsSent', JSON.stringify(notificationsSent));

                setDialogOpen(true); // Open dialog if a notification is created
                fetchUserNotifications(currentUser.id);
            }
        }
        previousBalanceRef.current = balance; // Update the previous balance reference
    }
    isInitialLoad.current = false; // Mark initial load complete after first execution
}, [currentDocument, fetchUserNotifications, currentUser, setNotificationMessage]);

    

    // Handle dialog close
    const handleDialogClose = () => {
        setDialogOpen(false);
    };

    return (
        <Container className="test" maxWidth="lg" sx={{ /*mt: 4,*/ mb: 4 }}>
            <Grid container spacing={2} sx={{ position: 'relative' }}> {/*relative to allow date component to float*/}
                <Grid item xs={12} md={12} lg={12}>
                    <Paper
                        sx={[
                            styles.header, {
                                p: 2,
                                display: 'flex',
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }
                        ]}
                        elevation={0}
                        variant='outlined'>
                        <Box style={styles.header.buttons}>
                            <FilterDate />
                            <SchoolSearchFilter />
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: "center" }}>
                            <Typography
                                sx={{ color: "#252733" }}
                                component="h1"
                                color="inherit"
                                noWrap
                            >
                                {`${month} ${year}`}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                        >
                            <Grid container>
                                <Grid item xs={12} sm={8} md={8} lg={6}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        height: "100%",
                                    }}
                                    >
                                        <DocumentSummary setOpen={() => handleOpen()} />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={6}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                            height: '100%', // Ensure Box fills the height of the Grid item
                                            pr: 2
                                        }}
                                    >
                                        <Button
                                            disabled={exportIsLoading || currentDocument.id === 0 || !currentDocument}
                                            variant="contained"
                                            sx={{ backgroundColor: '#4A99D3' }}
                                            onClick={() => exportDocumentOnClick()}
                                        >Export
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Paper sx={[styles.container, { mt: 1 }]}>
                        <Grid container>
                            <Grid item xs={12} md={12} lg={12}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    overflow: 'auto', //if overflow, hide it
                                    overflowWrap: "break-word",
                                }}>
                                    <Tabs sx={{ minHeight: '10px' }}
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="basic tabs example">
                                        <Tab sx={styles.tab} label="LR & RCD" {...a11yProps(0)} />
                                        <Tab sx={styles.tab} label="JEV" {...a11yProps(1)} />
                                    </Tabs>
                                    <Button
                                        sx={[{ minWidth: "90px" }, open && { fontWeight: 'bold' }]}
                                        onClick={handleOpen}
                                    >
                                        Budget Allocation
                                    </Button>
                                    <IconButton
                                        aria-label="open-approval"
                                        onClick={handleOpenApproval}
                                        sx={{
                                            color: "#C5C7CD",
                                            marginLeft: "auto",
                                            pr: 3
                                        }}
                                    >
                                        <StyledBadge badgeContent={lrNotApproved.length} color="secondary">
                                            <FactCheckIcon />
                                        </StyledBadge>
                                    </IconButton>
                                </Box>
                            </Grid>
                            {/*Document Tables*/}
                            <Grid item xs={12} md={12} lg={12}>
                                <CustomTabPanel value={value} index={0}>
                                    <DocumentTable />
                                </CustomTabPanel>
                                <CustomTabPanel value={value} index={1}>
                                    <JEVTable />
                                </CustomTabPanel>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <ApprovalModal
                open={openApproval}
                handleClose={handleCloseApproval}
            />
            <BudgetAllocationModal
                open={open}
                handleClose={handleClose}
            />
            <Dialog 
            open={dialogOpen} 
            onClose={handleDialogClose}
            maxWidth="md"  
            PaperProps={{
                sx: { 
                    padding: 1, 
                    minHeight: '290px', 
                    minWidth: '390px', 
                    border: '1px solid red', // Red border for the dialog
                    borderRadius: '8px'  // Optional: smooth rounded corners
                } 

            }}
        >
            <DialogTitle>
                <Box display="flex" alignItems="center">
                    <WarningIcon sx={{ color: 'red', fontSize: 60, mr: 2 }} /> 
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Warning</Typography> {/* Make warning bold */}
                </Box>
            </DialogTitle>
            <DialogContent>
                {/* Move notification message lower using marginTop */}
                <Typography sx={{ fontSize: '2em', mt: 4 }}>{notificationMessage}</Typography> 
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                </Button>
            </DialogActions>
        </Dialog>
        </Container >
    );
}

const styles = {
    header: {
        overflow: 'auto', //if overflow, hide it
        overflowWrap: "break-word",
        fontFamily: 'Mulish-Regular',
        buttons: {
            display: 'flex',
            alignItems: 'center',
            width: '650px', //adjust the container
        }
    },
    container: {
        overflow: 'hidden',
        padding: "10px",
        paddingTop: "10px"
    },
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
    },
    button: {
        mt: 2,
        borderRadius: '10px',
        width: '160px',
        padding: '10px 0',
        alignSelf: "center",
        backgroundColor: '#19B4E5', // Default background color for enabled button
        color: 'white', // Default text color for enabled button
        '&:hover': {
            backgroundColor: '#19a2e5', // Background color on hover
        },
        '&.Mui-disabled': {
            backgroundColor: '#e0e0e0', // Background color when disabled
            color: '#c4c4c4', // Text color when disabled
        }
    }
}

export default SchoolPage;
import React from 'react';
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
    Typography
} from '@mui/material';
import IconButton from "@mui/material/IconButton";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

import FilterDate from '../Components/Filters/FilterDate';
import SchoolSearchFilter from '../Components/Filters/SchoolSearchFilter';
import axios from 'axios';
import { saveAs } from 'file-saver';

import { useSchoolContext } from '../Context/SchoolProvider';

import LRTable from '../Components/Table/LRTable';
import JEVTable from '../Components/Table/JEVTable';
import DocumentSummary from '../Components/Summary/DocumentSummary';
import BudgetAllocationModal from '../Components/Modal/BudgetAllocationModal';
import { useAppContext } from '../Context/AppProvider';

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

function SchoolPage(props) {
    const { currentUser } = useAppContext();
    const {
        year,
        month,
        setIsAdding,
        isEditingRef,
        currentDocument,
        currentSchool,
        value,
        setValue
    } = useSchoolContext();

    const [open, setOpen] = React.useState(false);
    const [exportIsLoading, setExportIsLoading] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
        isEditingRef.current = true;
    }

    const handleClose = () => {
        setOpen(false);
        isEditingRef.current = false;
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

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

    const exportDocumentOnClick = async () => {
        await exportDocument();
    }

    console.log("Schools renders")

    // Remove add field when going to another tab
    React.useEffect(() => {
        setIsAdding(false); //reset state to allow addFields again
    }, [value, setIsAdding]); // Listen to "value" when changing tabs; reset isAdding

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
                                sx={{ color: "#252733", fontWeight: "bold", fontSize: "1.2rem" }}
                                component="h1"
                                color="inherit"
                                noWrap
                            >
                                {`${month} ${year}`}
                            </Typography>
                            <CalendarMonthIcon sx={{ ml: 1, color: "#f44133" }} />
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
                                        // onClick={handleOpenApproval}
                                        sx={{
                                            color: "#C5C7CD",
                                            marginLeft: "auto",
                                            pr: 3
                                        }}
                                    >
                                        {/* <StyledBadge badgeContent={lrNotApproved.length} color="secondary">
                                            <FactCheckIcon />
                                        </StyledBadge> */}
                                    </IconButton>
                                </Box>
                            </Grid>
                            {/*Document Tables*/}
                            <Grid item xs={12} md={12} lg={12}>
                                <CustomTabPanel value={value} index={0}>
                                    <LRTable />
                                </CustomTabPanel>
                                <CustomTabPanel value={value} index={1}>
                                    <JEVTable />
                                </CustomTabPanel>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
            <BudgetAllocationModal
                open={open}
                handleClose={handleClose}
            />
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
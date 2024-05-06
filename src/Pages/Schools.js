import '../App.css'
import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import IconButton from "@mui/material/IconButton";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { RecordsProvider } from '../Context/RecordsProvider';
import { SchoolDateFilter, SchoolFieldsFilter, SchoolSearchFilter } from '../Components/Filters/SchoolDateFilter'
import LRTable from '../Components/Table/LRTable';
import Button from '@mui/material/Button';
import BudgetSummary from '../Components/Summary/BudgetSummary';
import { SchoolProvider } from '../Context/SchoolProvider';
import { useSchoolContext } from '../Context/SchoolProvider';
import { useNavigationContext } from '../Context/NavigationProvider';
import RestService from '../Services/RestService';
import DocumentSummary from '../Components/Summary/DocumentSummary';

//import { useState } from 'react';
//import { useEffect } from 'react';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const emptyDocument = {
    budget: 0,
    cashAdvance: 0
}

// Initialize current date to get current month and year
const currentDate = new Date();
const currentMonth = currentDate.toLocaleString('default', { month: 'long' }); // Get full month name
const currentYear = currentDate.getFullYear().toString(); // Get full year as string

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const years = [
    '2021', '2022', '2023', '2024'
];

function Schools(props) {
    // Set initial state for month and year using current date
    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);

    const [value, setValue] = React.useState(0);
    const [currentDocument, setCurrentDocument] = useState(null);
    const { selected, currentSchool } = useNavigationContext();

    const exportDocumentOnClick = async () => {
        await RestService.getExcelFromLr(currentDocument.id);
    }



    //Only retried documents from that school if the current selection is a school
    React.useEffect(() => {
        console.log("Get this school's lr and document");
        // Fetches a Document based on the current school's id
        const fetchLrData = async () => {
            try {
                const getDocument = await RestService.getDocumentBySchoolIdYearMonth(
                    currentSchool.id,
                    year,
                    month
                );

                if (getDocument) {
                    setCurrentDocument(getDocument);
                } else {
                    setCurrentDocument(emptyDocument);
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        if (value === 0) {
            fetchLrData();
        } else if (value === 1) {
            console.log("Fetch RCD")
        } else if (value === 2) {
            console.log("Fetch JEV")
        }

    }, [selected, year, month, currentSchool, value]);

    if (!currentDocument) {
        return null;
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <SchoolProvider
            value={{
                currentMonth, currentYear,
                currentDocument, setCurrentDocument,
                month, setMonth,
                year, setYear,
                months, years
            }}
        >
            <Container className="test" maxWidth="lg" sx={{ /*mt: 4,*/ mb: 4 }}>
                <Grid container spacing={2} sx={{ position: 'relative' }}> {/*relative to allow date component to float*/}
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper
                            sx={[
                                styles.header, {
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'row'
                                }
                            ]}
                            elevation={0}
                            variant='outlined'>
                            <Box style={styles.header.buttons}>
                                <SchoolDateFilter />
                                <SchoolFieldsFilter />
                                <SchoolSearchFilter />
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <RecordsProvider>
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
                                                //backgroundColor: 'green'
                                            }}
                                            >
                                                <DocumentSummary />
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
                                                <Button variant="contained"
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
                                            overflow: 'auto', //if overflow, hide it
                                            overflowWrap: "break-word",
                                        }}>
                                            <Tabs sx={{ minHeight: '10px' }}
                                                value={value}
                                                onChange={handleChange}
                                                aria-label="basic tabs example">
                                                <Tab sx={styles.tab} label="LR" {...a11yProps(0)} />
                                                <Tab sx={styles.tab} label="RCD" {...a11yProps(1)} />
                                                <Tab sx={styles.tab} label="JEV" {...a11yProps(2)} />
                                            </Tabs>
                                        </Box>
                                    </Grid>

                                    {/*Document Tables*/}
                                    <Grid item xs={12} md={12} lg={12}>
                                        <CustomTabPanel value={value} index={0}>
                                            <LRTable />
                                        </CustomTabPanel>
                                        <CustomTabPanel value={value} index={1}>
                                            Item Two
                                        </CustomTabPanel>
                                        <CustomTabPanel value={value} index={2}>
                                            Item Three
                                        </CustomTabPanel>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </RecordsProvider>
                    </Grid>
                </Grid>
            </Container >
        </SchoolProvider>
    );
}

const styles = {
    header: {
        overflow: 'auto', //if overflow, hide it
        overflowWrap: "break-word",
        fontFamily: 'Mulish-Regular',
        buttons: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '650px', //adjust the container
            //position: 'relative'
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
}

export default Schools;
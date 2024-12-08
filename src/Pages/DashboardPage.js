// React & Hooks
import React, { useState, useEffect, useCallback } from 'react';

// External Libraries
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { Box, MenuItem, Tooltip } from '@mui/material';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Select from '@mui/material/Select';

// Context Providers
import { useNavigationContext } from '../Context/NavigationProvider';
import { useSchoolContext } from '../Context/SchoolProvider';

// Custom Components
import FilterDate from '../Components/Filters/FilterDate';
import { transformSchoolText } from '../Components/Navigation/Navigation';
import ApexAnnualReport from '../Components/Charts/ApexAnnualReport';
import ApexChart from '../Components/Charts/ApexChart';
import AnalyticsCardSummary from '../Components/Summary/AnalyticsCardSummary';
import DashboardSummaryDetails from '../Components/Summary/DashboardSummaryDetails';

// Utility Functions
import { calculateWeeklyExpenses } from '../Utility/calculateWeeklyExpenses';

function DashboardPage(props) {
    const { currentUser, currentSchool, setCurrentSchool, } = useNavigationContext();
    const { currentDocument, year, month, setCurrentDocument, jev, updateJev, lr, updateLr } = useSchoolContext();
    const [selectedSchool, setSelectedSchool] = useState('');

    const [loadingSchools] = useState(false);
    const [schoolBudget] = useState(null);

    const [uacsData, setUacsData] = useState([]);

    const initializeSelectedSchool = useCallback(() => {
        if (currentUser && currentUser.schools && currentUser.schools.length > 0) {
            if (currentSchool) {
                setSelectedSchool(currentSchool.id);
            } else {
                setSelectedSchool(currentUser.schools[0].id);
            }

        }
    }, [currentSchool, currentUser]);

    const handleSchoolSelect = async (schoolId) => {
        setSelectedSchool(schoolId);
        setCurrentSchool(currentUser.schools.find(s => s.id === schoolId));
    };

    useEffect(() => {
        initializeSelectedSchool();
        updateJev();
        updateLr();
    }, [initializeSelectedSchool, updateJev, updateLr]);

    useEffect(() => {
        const sampleUacsData = [
            {
                code: '5020502001',
                name: 'Communication Expenses',
                budget: jev[0]?.budget || 0,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5020402000',
                name: 'Electricity Expenses',
                budget: jev[1]?.budget || 0,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5020503000',
                name: 'Internet Subscription Expenses',
                budget: jev[2]?.budget || 0,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5029904000',
                name: 'Transpo/Delivery Expenses',
                budget: jev[3]?.budget || 0,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5020201000',
                name: 'Training Expenses',
                budget: jev[4]?.budget || 0,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5020399000',
                name: 'Other Supplies & Materials Expenses',
                budget: jev[5]?.budget || 0,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '19901020000',
                name: 'Total',
                budget: 500000,
                expenses: [0, 0, 0, 0, 0]
            }
        ];

        const fetchData = async () => {
            try {
                if (lr && lr.length > 0) {
                    // Calculate weekly expenses from the LR data
                    const weeklyExpenses = calculateWeeklyExpenses(lr);

                    // Update uacsData with the calculated weekly expenses
                    const updatedUacsData = sampleUacsData.map(uacs => {
                        if (weeklyExpenses[uacs.code]) {
                            return {
                                ...uacs,
                                expenses: weeklyExpenses[uacs.code]
                            };
                        }
                        return uacs;
                    });

                    setUacsData(updatedUacsData);
                } else {
                    setUacsData(sampleUacsData);
                }
            } catch (error) {
                console.error('Error processing data:', error);
            }
        };

        fetchData();
    }, [lr, jev]);

    if (!currentUser) {
        return null;
    }

    return (
        /*User has no school/s*/
        !currentUser.schools || currentUser.schools.length === 0 ?
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>
                            Currently, you are not assigned to a school.
                        </Typography>
                        <Typography variant="body1">
                            Once assigned, available data will be displayed here.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
            :
            /*User has school/s*/
            <Container className="test" maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper
                            sx={[
                                styles.header, {
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                }
                            ]}
                            elevation={0}
                            variant='outlined'
                        >
                            <FilterDate />
                            <Box style={{ paddingRight: '10px' }}>
                                <Tooltip title={"School Filter"} placement='left'>
                                    <Select
                                        value={selectedSchool}
                                        onChange={(event) => handleSchoolSelect(event.target.value)}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Select School' }}
                                        style={{ width: '100%', height: '40px' }}
                                    >
                                        {loadingSchools ? (
                                            <MenuItem disabled>Loading...</MenuItem>
                                        ) : (
                                            currentUser.schools.map((school) => (
                                                <MenuItem key={school.id} value={school.id}>
                                                    {transformSchoolText(school.name)}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </Tooltip>
                            </Box>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <Box style={{
                            display: 'flex', justifyContent: 'space-between', marginBottom: '1rem',
                            marginLeft: '10px', marginRight: '10px'
                        }}>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                                sx={{ flexGrow: 1, textAlign: 'left', color: '#252733', fontWeight: 'bold' }}
                            >
                                Analytics
                            </Typography>
                            <Typography
                                component="h1"
                                variant="h6"
                                color="inherit"
                                noWrap
                            >
                                {`${month} ${year}`}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}
                        sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: "-15px",
                        }}>
                        <Grid container >
                            <Grid item xs={12} md={6} lg={3} sx={{ padding: '5px' }}>
                                <AnalyticsCardSummary
                                    title={"totalExpenses"}
                                    currentDocument={currentDocument}
                                    month={month}
                                    currentUser={currentUser}
                                    setCurrentDocument={setCurrentDocument}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={3} sx={{ padding: '5px' }}>
                                <AnalyticsCardSummary
                                    title={"budgetLimit"}
                                    currentDocument={currentDocument}
                                    month={month}
                                    currentUser={currentUser}
                                    setCurrentDocument={setCurrentDocument}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={3} sx={{ padding: '5px' }}>
                                <AnalyticsCardSummary
                                    title={"totalBalance"}
                                    currentDocument={currentDocument}
                                    month={month}
                                    currentUser={currentUser}
                                    setCurrentDocument={setCurrentDocument}
                                />
                            </Grid>
                            <Grid item xs={12} md={6} lg={3} sx={{ padding: '5px' }}>
                                <AnalyticsCardSummary
                                    title={"annualBalance"}
                                    currentDocument={currentDocument}
                                    month={month}
                                    currentUser={currentUser}
                                    setCurrentDocument={setCurrentDocument}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <Grid container >
                            <Grid item xs={12} md={8} lg={8} sx={{ padding: '5px' }}>
                                <ApexAnnualReport type="Stacked Bar" currentSchool={currentSchool} year={year} />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} sx={{ padding: '5px' }}>
                                <ApexAnnualReport type="Pie Chart" currentSchool={currentSchool} currentDocument={currentDocument} month={month} year={year} />
                            </Grid>
                            <Grid item xs={12} md={8} lg={8} sx={{ padding: '5px' }}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column'
                                    }}
                                >
                                    <ApexChart uacsData={uacsData} budgetLimit={currentDocument?.budgetLimit} />
                                    <ApexChart totalBudget={schoolBudget} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} sx={{ padding: '5px' }}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        height: "100%",
                                        textAlign: 'left',
                                        marginBottom: '15px',
                                    }}
                                >
                                    <DashboardSummaryDetails
                                        currentDocument={currentDocument}
                                        month={month}
                                        year={year}
                                    />
                                </Paper>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Container>
    );
}

const styles = {
    header: {
        overflow: 'auto',
        overflowWrap: "break-word",
        fontFamily: 'Mulish-Regular',
        buttons: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '650px'
        }
    },
}

export default DashboardPage;
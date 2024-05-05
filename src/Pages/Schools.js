import '../App.css'
import React from 'react';
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
import { SchoolProvider } from '../Context/SchoolProvider';

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

function BudgetSummary(props) {
    const { title, amount, total = false } = props
    return (
        <Paper sx={{ minWidth: 150, height: 65, m: 1, backgroundColor: total ? '#0077B6' : undefined }} variant='outlined'>
            <Box
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontWeight: 'bold',
                    height: '100%',
                }}
            >
                <Typography variant="body2" align="center" sx={{ fontWeight: 'bold', color: total ? '#ffff' : '#9FA2B4' }}>
                    {title}
                </Typography>
                <Typography variant="body2" align="center" sx={{ fontWeight: 'bold', color: total && '#ffff' }}>
                    Php {amount}
                </Typography>
            </Box>
        </Paper>
    );
}

function Schools(props) {
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <SchoolProvider>
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
                            <Paper sx={styles.container}>
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
                                    <Grid item xs={12} md={12} lg={12} sx={{ pt: 2 }}>
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
                                                        <IconButton sx={{ alignSelf: "center" }}>
                                                            <AddBoxIcon sx={{ fontSize: 25, color: '#20A0F0' }} />
                                                        </IconButton>
                                                        <Grid container pb={1} >
                                                            <Grid item xs={12} md={4} lg={4}>
                                                                <BudgetSummary total title="Total" amount="9,675.43" />
                                                            </Grid>
                                                            <Grid item xs={12} md={4} lg={4}>
                                                                <BudgetSummary title="Budget this month" amount="18,000.00" />
                                                            </Grid>
                                                            <Grid item xs={12} md={4} lg={4}>
                                                                <BudgetSummary title="Balance" amount="8,324.57" />
                                                            </Grid>
                                                        </Grid>
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
                                                        <Button variant="contained" sx={{ backgroundColor: '#4A99D3' }}>Export</Button>
                                                    </Box>
                                                </Grid>
                                            </Grid>
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
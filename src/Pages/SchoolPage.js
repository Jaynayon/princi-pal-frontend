import '../App.css'
import React, { } from 'react';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { RecordsProvider } from '../Context/RecordsProvider';
import { SchoolDateFilter, SchoolFieldsFilter, SchoolSearchFilter } from '../Components/Filters/SchoolFilters'
import DocumentTable from '../Components/Table/LRTable';
import Button from '@mui/material/Button';
import { useSchoolContext } from '../Context/SchoolProvider';
// import { useNavigationContext } from '../Context/NavigationProvider';
import DocumentSummary from '../Components/Summary/DocumentSummary';
import JEVTable from '../Components/Table/JEVTable';

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

function Schools(props) {
    const { year, month, setIsAdding, currentDocument, exportDocument, reload, updateLr, updateJev, value, setValue } = useSchoolContext();
    //const { selected } = useNavigationContext();

    const exportDocumentOnClick = async () => {
        await exportDocument();
    }

    console.log("Schools renders")

    //Only retried documents from that school if the current selection is a school
    React.useEffect(() => {
        console.log("Schools useEffect: lr updated");
        // if (value === 0) {
        //     updateLr(); //update or fetch lr data on load
        // } else if (value === 1) {
        //     updateJev();
        // }

        updateLr();
        updateJev();
        setIsAdding(false); //reset state to allow displayFields again

    }, [value, year, month, reload, updateLr, updateJev, setIsAdding]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (!currentDocument) { //returns null until there's value
        return null;
    }

    return (
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
                                            <Tab sx={styles.tab} label="LR & RCD" {...a11yProps(0)} />
                                            <Tab sx={styles.tab} label="JEV" {...a11yProps(1)} />
                                        </Tabs>
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
                    </RecordsProvider>
                </Grid>
            </Grid>
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
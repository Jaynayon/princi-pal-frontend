import '../App.css';
import React from 'react';
import PropTypes from 'prop-types';
import {
    Paper,
    Tabs,
    Tab,
    Container,
    Grid,
    Box,
    Button
} from '@mui/material';

import {
    FilterDate,
    SchoolFieldsFilter,
    SchoolSearchFilter
} from '../Components/Filters/FilterDate';

import { useSchoolContext } from '../Context/SchoolProvider';
// import { useNavigationContext } from '../Context/NavigationProvider';

import DocumentTable from '../Components/Table/LRTable';
import JEVTable from '../Components/Table/JEVTable';
import DocumentSummary from '../Components/Summary/DocumentSummary';
import BudgetModal from '../Components/Modal/BudgetModal';

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

// const theme = createTheme({
//     components: {
//         MuiButton: {
//             styleOverrides: {
//                 root: {
//                     backgroundColor: '#19B4E5', // Default background color for enabled button
//                     color: 'white', // Default text color for enabled button
//                     '&:hover': {
//                         backgroundColor: '#19a2e5', // Background color on hover
//                     },
//                     '&.Mui-disabled': {
//                         backgroundColor: "#e0e0e0", // Background color when disabled
//                         color: '#c4c4c4', // Text color when disabled
//                     }
//                 }
//             }
//         }
//     }
// });

function SchoolPage(props) {
    const { year, month, setIsAdding, currentDocument, exportDocument, reload, updateLr, updateJev, value, setValue } = useSchoolContext();
    //const { selected } = useNavigationContext();

    const exportDocumentOnClick = async () => {
        await exportDocument();
    }

    console.log("Schools renders")

    //Only retried documents from that school if the current selection is a school
    React.useEffect(() => {
        console.log("Schools useEffect: lr updated");
        updateLr();
        updateJev();

        setIsAdding(false); //reset state to allow addFields again
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
                            <FilterDate />
                            <SchoolFieldsFilter />
                            <SchoolSearchFilter />
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
                                        <BudgetModal />
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
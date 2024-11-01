import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Container, Button, Tabs, Tab } from '@mui/material';

import PropTypes from 'prop-types';
import CreatePositionTab from '../Components/Tabs/CreatePositionTab';
import CreateUacsTab from '../Components/Tabs/CreateUacsTab';
import CreatePrincipalTab from '../Components/Tabs/CreatePrincipalTab';
import CreateSchoolTab from '../Components/Tabs/CreateSchoolTab';
import CreateIntegrateTab from '../Components/Tabs/CreateIntegrateTab';
import LogoutDialog from '../Components/Modal/LogoutDialog';

// TabPanel component for displaying content based on the active tab
const TabPanel = ({ children, value, index }) => {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
};

function AdminPage() {
    const [tabValue, setTabValue] = useState(0);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Container
            maxWidth={false}
            style={styles.outer_container}
        >
            <Paper style={styles.paper} >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        pl: 2,
                        pb: 1,
                        pr: 4
                    }}
                >
                    <Box
                        style={{
                            display: 'flex',
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "0.5rem",
                            marginBottom: "0.60rem"
                        }}
                    >
                        <img
                            src="/logoremovebgpreview-1@2x-black.png"
                            alt="logo"
                            style={{ width: "70px", height: "auto" }}
                        />
                        <Typography variant="h5" style={styles.title}>
                            Admin Panel
                        </Typography>
                    </Box>
                    <Button
                        variant="outlined"
                        sx={{
                            textTransform: 'none', // Remove uppercase transformation
                            borderRadius: '4px', // Slightly rounded corners
                            padding: '4px 12px', // Adjust padding to match the look
                            borderColor: '#ddd', // Light gray border color
                            color: 'red', // Dark text color
                            '&:hover': {
                                borderColor: '#bbb', // Slightly darker border on hover
                            },
                        }}
                        onClick={() => setLogoutDialogOpen(true)}
                    >
                        Logout
                    </Button>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        pl: 2,
                        boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)" // Bottom shadow
                    }}
                >
                    <Tabs value={tabValue} onChange={handleTabChange} centered >
                        <Tab label="Principals" sx={styles.tab} />
                        <Tab label="Schools" sx={[styles.tab]} />
                        <Tab label="Integration" sx={styles.tab} />
                        <Tab label="UACS" sx={styles.tab} />
                        <Tab label="Positions" sx={styles.tab} />
                    </Tabs>
                </Box>

                {/* Tab Content */}
                <Box sx={styles.content}>
                    {tabValue === 0 && (<CreatePrincipalTab />)}

                    {tabValue === 1 && (<CreateSchoolTab />)}

                    {tabValue === 2 && (<CreateIntegrateTab />)}

                    {tabValue === 3 && (<CreateUacsTab />)}

                    {tabValue === 4 && (<CreatePositionTab />)}
                </Box>
            </Paper>

            {/* Logout confirmation dialog */}
            <LogoutDialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
            />
        </Container>
    );
}

const styles = {
    outer_container: {
        width: "100vw",
        height: "100vh",
        overflow: "auto",
        backgroundImage: `url(/bg.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    },
    title: {
        fontFamily: "Mulish",
        textAlign: "center"
    },
    paper: {
        // minWidth: '100%',
        maxWidth: "1440px",
        paddingTop: '15px',
        borderRadius: '10px',
        margin: 'auto',
        marginBottom: '20px',
        marginTop: '20px',
    },
    content: {
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "3rem",
        width: "100%",
        maxWidth: "700px", // Adjust if needed
        margin: "0 auto", // Center align horizontally
    },
    tab: {
        textTransform: 'none',
        '&.Mui-selected': {
            color: 'black', // Color of selected tab
            fontWeight: 'bold', // Font weight of selected tab
        }
    }
}

export default AdminPage;
import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { Container, Button, Tabs, Tab } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import PropTypes from 'prop-types';
import CreatePositionTab from '../Components/Tabs/CreatePositionTab';
import CreateUacsTab from '../Components/Tabs/CreateUacsTab';
import CreatePrincipalTab from '../Components/Tabs/CreatePrincipalTab';
import CreateSchoolTab from '../Components/Tabs/CreateSchoolTab';
import CreateIntegrateTab from '../Components/Tabs/CreateIntegrateTab';

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

    const handleLogout = () => {
        if (JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))) {
            window.localStorage.removeItem("LOCAL_STORAGE_TOKEN")
            window.location.href = "https://localhost:3000/";
        } else {
            console.log("Local storage item not found");
        }
        setLogoutDialogOpen(false); // Close dialog after logout
    };

    return (
        <Container
            maxWidth={false}
            style={styles.outer_container}
        >
            <Container
                maxWidth="md"
                style={styles.inner_container}
            >
                <Typography
                    variant="h4"
                    style={styles.title}
                >
                    Admin Page
                </Typography>
                <Paper style={styles.paper} >
                    <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                        <Tabs value={tabValue} onChange={handleTabChange} centered>
                            <Tab label="Create Principal" />
                            <Tab label="Create School" />
                            <Tab label="Integrate Principal" />
                            <Tab label="Create UACS" />
                            <Tab label="Create Position" />
                        </Tabs>
                        <Button onClick={() => setLogoutDialogOpen(true)}>Logout</Button>
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
            </Container>

            {/* Logout confirmation dialog */}
            <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} aria-labelledby="logout-dialog-title" maxWidth="xs" fullWidth>
                <DialogTitle id="logout-dialog-title">Are you sure you want to Logout?</DialogTitle>
                <DialogContent sx={{ display: "flex", flexDirection: "row", justifyContent: "flex-end", p: 0 }}>
                    <DialogActions>
                        <Box>
                            <Button onClick={() => setLogoutDialogOpen(false)} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={handleLogout} color="primary">
                                Logout
                            </Button>
                        </Box>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        </Container>
    );
}

const styles = {
    outer_container: {
        width: "100vw",
        height: "100vh",
        position: "relative",
        overflow: "auto",
        backgroundImage: `url(/bg.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
    },
    inner_container: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        zIndex: 1,
        paddingTop: "64px",
        padding: "0 1rem",
    },
    title: {
        marginBottom: "2rem",
        marginTop: "2rem",
        fontFamily: "Mulish",
        color: "#000",
        textAlign: "center"
    },
    paper: {
        width: '100%',
        padding: '2rem',
        borderRadius: '10px',
        margin: 'auto',
        position: 'relative',
        bottom: '20px',
        left: '0',
        right: '0',
        zIndex: 1,
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
    }
}

export default AdminPage;
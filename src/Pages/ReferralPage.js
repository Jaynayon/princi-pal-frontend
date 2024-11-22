import React, { useState, useEffect } from "react";
import { Button, Typography, Container, Box, Snackbar, Alert } from "@mui/material";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LinkOffIcon from '@mui/icons-material/LinkOff';
import SchoolIcon from '@mui/icons-material/School';
import { transformSchoolText } from "../Components/Navigation/Navigation";
import { useAppContext } from "../Context/AppProvider";

const ReferralPage = () => {
    const { currentUser } = useAppContext();
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [school, setSchool] = useState(null);
    const [page, setPage] = useState('invalid');
    const location = useLocation();
    const navigate = useNavigate();
    const code = location.pathname.split('/')[2];

    console.log(currentUser)

    useEffect(() => {
        // Get if code exists; check user association
        const validateCode = async (code) => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL_CODE}/${code}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                    }
                });

                // Code exists; returns School
                if (response.status === 200) {
                    setSchool(response.data);
                    try {
                        const assoc = await axios.post(`${process.env.REACT_APP_API_URL_ASSOC}/user`, {
                            userId: currentUser.id,
                            schoolId: response.data.id
                        }, {
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                            }
                        });
                        // if already associated; exist
                        if (assoc) {
                            setPage("exist");
                        }
                    } catch (e) {
                        setPage('join'); // else, join
                        console.error(e);
                    }
                }
            } catch (error) {
                setPage('invalid');
                console.error(error);
            }
        };

        if (code) {
            validateCode(code);
        } else {
            return;
        }

    }, [location.pathname, currentUser, code]);

    const acceptInvitation = async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_ASSOC}/referral`, {
                code: code,
                userId: currentUser.id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                }
            });

            if (response.status === 201) {
                setSuccessMessage('You have successfully accepted the invitation. Redirecting to the dashboard...');
                setOpenSnackbar(true);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
        window.location.href = '/';
    };

    return (
        <Container
            maxWidth={false}
            style={{
                width: "100vw",
                height: "100vh",
                position: "relative",
                overflow: "auto",
                backgroundImage: `url(/bg.png)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Box
                maxWidth="sm"
                sx={{
                    padding: "20px",
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white',
                    textAlign: 'center',
                    backgroundImage: page === 'join' ? `url(/bg.png)` : 'none',
                    backgroundSize: 'cover',
                }}
            >
                {page === "exist" && (
                    <React.Fragment>
                        <SchoolIcon sx={{ fontSize: 60, color: "#4a99d3" }} />
                        <Typography
                            variant="h5"
                            fontWeight={"bold"}
                            gutterBottom
                        >
                            You are already invited to{" "}
                            <strong style={{ color: "#4a99d3" }}>{transformSchoolText(school?.name || "")}</strong>
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                            There's no need to take any further action.
                            You are now a member and have access to all available resources and tools within the platform.
                        </Typography>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            sx={{ fontSize: 12, mb: 2 }} // Adjust the line height here
                        >
                            You can go ahead and start using the platform right away!
                            Head over to the School tab to view and manage the organization's data.
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => navigate('/')}
                            sx={{ backgroundColor: '#4a99d3' }}
                        >
                            Go Back
                        </Button>
                    </React.Fragment>
                )}
                {page === "join" && (
                    <React.Fragment>
                        <SchoolIcon sx={{ fontSize: 60, color: "#4a99d3" }} />
                        <Typography
                            variant="h5"
                            fontWeight={"bold"}
                            gutterBottom
                        >
                            You have been invited to join{" "}
                            <strong style={{ color: "#4a99d3" }}>{transformSchoolText(school?.name || "")}</strong>
                        </Typography>
                        <Typography
                            variant="body1"
                            gutterBottom
                        >
                            By accepting this invitation, you will be able to gain access to critical School
                            resources and tools designed to enhance organizational efficiency.
                        </Typography>
                        <Typography
                            variant="body2"
                            gutterBottom
                            component="div"
                        >
                            <ul style={{ textAlign: "left", margin: "10px 0" }}>
                                <li>Access data for <strong>MOOE generation</strong>.</li>
                                <li>View and manage:
                                    <ul>
                                        <li>Liquidation Reports (LR)</li>
                                        <li>Journal Entry Vouchers (JEV)</li>
                                        <li>Report of Cash Disbursements (RCD)</li>
                                        <li>Cash Disbursement Registers (CDR)</li>
                                    </ul>
                                </li>
                                <li>Add, modify, or delete School data.</li>
                                <li>See members of the organization.</li>
                            </ul>
                        </Typography>
                        <Typography
                            color="textSecondary"
                            gutterBottom
                            sx={{ fontSize: 12, mb: 2 }} // Adjust the line height here
                        >
                            By accepting this invitation, you agree to responsibly manage and access the data provided,
                            ensuring accurate and transparent record-keeping for the organization.
                        </Typography>
                        <Button
                            variant="contained"
                            fullWidth
                            onClick={acceptInvitation}
                            sx={{ backgroundColor: '#4a99d3' }}
                            disabled={isLoading}
                        >
                            Accept Invitation
                        </Button>
                    </React.Fragment>
                )}
                {page === "invalid" && (
                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                color: 'red',
                                fontWeight: "bold",
                                mb: 4
                            }}
                        >
                            404 OOPS!
                        </Typography>
                        <Alert
                            severity="error"
                            icon={<LinkOffIcon />}
                            sx={{ mb: 2 }}
                        >
                            It looks like the link you’ve used is either broken, expired, or invalid.
                            If you’re trying to reset your password or access a secure area,
                            please request a new link or contact support for further assistance.
                        </Alert>
                        <Button
                            variant="contained"
                            onClick={() => navigate('/login')}
                            sx={{ backgroundColor: '#4a99d3' }}
                        >
                            Go Back
                        </Button>
                    </Box>
                )}
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
            >
                <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Container >
    );
};

export default ReferralPage;

import React, { memo, useEffect, useState } from 'react';

// Custom component import
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import { Box, FormControl, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import axios from 'axios';
import CopyableTextField from '../Input/CopyableTextField';

const InviteMembersModal = memo(({ open, onClose, currentSchool }) => {
    const [member, setMember] = useState('Member');
    const [inviteEmail, setInviteEmail] = useState('');
    const [invitationMessage, setInvitationMessage] = useState('');
    const [isInvitationSuccessful, setIsInvitationSuccessful] = useState(false);
    const [referralLink, setReferralLink] = useState('');

    const handleInvite = () => {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (inviteEmail.trim() === '' || !emailRegex.test(inviteEmail)) {
            setInvitationMessage('Please enter a valid email.');
            setIsInvitationSuccessful(false);
            return;
        }

        const invitePayload = {
            email: inviteEmail,
            schoolId: currentSchool.id,
            admin: member === 'Admin'
        };

        axios.post(`${process.env.REACT_APP_API_URL_ASSOC}/invite`, invitePayload, {
            headers: {
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
            }
        })
            .then(response => {
                setInvitationMessage('Invitation sent successfully!');
                setIsInvitationSuccessful(true); // Set success state
            })
            .catch(error => {
                if (error.response && error.response.status === 409) {
                    setInvitationMessage('User already invited or has an ongoing invitation');
                } else {
                    console.error("Error inviting member:", error.response ? error.response.data : error.message);
                    // Set a more descriptive error message for the user
                    if (error.response && error.response.data && error.response.data.message) {
                        setInvitationMessage(error.response.data.message);
                    } else {
                        setInvitationMessage('Failed to send invitation. Please try again.');
                    }
                }
                setIsInvitationSuccessful(false); // Set failure state
            });

        // Clear the input after attempt
        setInviteEmail('');
    };

    useEffect(() => {
        const fetchReferralLink = async () => {
            try {
                if (currentSchool) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL_CODE}/school/${currentSchool.id}`, {
                        headers: {
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                        }
                    });

                    setReferralLink(response.data);
                }
            } catch (error) {
                console.error("Error fetching referral link:", error.response ? error.response.data : error.message);
            }
        };

        fetchReferralLink();
    }, [currentSchool]);

    useEffect(() => {
        if (invitationMessage) {
            const timeout = setTimeout(() => {
                setInvitationMessage('');
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [invitationMessage]);

    return (
        <React.Fragment>
            <Dialog
                open={open}
                onClose={onClose}
                aria-labelledby="exceed-warning-dialog-title"
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        maxWidth: 500,
                    },
                }}
            >
                <DialogTitle id="exceed-warning-dialog-title">
                    Invite Members
                </DialogTitle>
                <DialogContent sx={{ pb: 2 }}>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "stretch", // Ensures both child boxes stretch to the same height
                            justifyContent: "center",
                            width: "100%",
                            // backgroundColor: "red",
                        }}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                pt: 1,
                                mr: 1,
                                width: "100%",
                                minWidth: 120,
                                // backgroundColor: "green",
                            }}
                        >
                            <TextField
                                id="invite"
                                label="Enter email"
                                variant="outlined"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                fullWidth
                                error={!!invitationMessage && !isInvitationSuccessful} // Error if there's a message and not successful
                                InputProps={{
                                    style: {
                                        borderColor: isInvitationSuccessful ? "green" : undefined, // Green border if successful
                                    },
                                }}
                                helperText={
                                    invitationMessage && (
                                        <span style={{ color: isInvitationSuccessful ? "green" : "red" }}>
                                            {invitationMessage}
                                        </span>
                                    )
                                }
                            />
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                // backgroundColor: "pink",
                            }}
                        >
                            <FormControl sx={{ maxWidth: 120, minWidth: 30, mt: 1, mr: 1 }}>
                                <InputLabel id="demo-select-small-label">Role</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={member}
                                    label="Role"
                                    onChange={(event) => setMember(event.target.value)}
                                >
                                    <MenuItem value="Member">Member</MenuItem>
                                    <MenuItem value="Admin">Admin</MenuItem>
                                </Select>
                            </FormControl>
                            <Button
                                sx={{ height: "55px", mt: 1, maxWidth: 60, minWidth: 50 }}
                                variant="contained"
                                className="inviteButton"
                                onClick={handleInvite}
                            >
                                Invite
                            </Button>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogContent
                    sx={{
                        backgroundColor: "#f5f5f5",
                        pt: 1
                    }}
                >
                    <Typography variant="body2" color="textSecondary" sx={{ fontWeight: "bold", pb: 1 }}>
                        Or, send an invitation link to your members instead.
                    </Typography>
                    <CopyableTextField referralLink={referralLink} />
                    <Typography
                        color="textSecondary"
                        sx={{ fontSize: 12, pt: 1 }} // Adjust the line height here
                    >
                        Your invite link is renewed every 7 days.
                    </Typography>
                </DialogContent>
            </Dialog>
        </React.Fragment>
    );
});

export default InviteMembersModal;


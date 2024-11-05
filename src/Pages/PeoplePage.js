import React, { useState, useEffect, useCallback } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Menu, Dialog, DialogTitle, DialogContent, DialogActions, ListItemText, Skeleton } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import axios from 'axios'; // Import Axios for making HTTP requests
import { useNavigationContext } from '../Context/NavigationProvider';
import { transformSchoolText } from '../Components/Navigation/Navigation';
import { Typography } from '@mui/material';

function PeoplePage(props) {
    const [member, setMember] = useState('Member');
    const [dropdownAnchorEl, setDropdownAnchorEl] = useState(null);
    const [deleteAnchorEl, setDeleteAnchorEl] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [searchValue, setSearchValue] = useState('');
    const [inviteEmail, setInviteEmail] = useState('');
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false); // State for confirmation dialog
    const [selectedRole, setSelectedRole] = useState(''); // State for selected role
    const [deleteConfirmationDialogOpen, setDeleteConfirmationDialogOpen] = useState(false); // State for delete confirmation dialog
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState('');
    const [schools, setSchools] = useState([]);
    const [rows, setRows] = useState([]);

    const { currentUser } = useNavigationContext();
    const [currentAssocation, setCurrentAssociation] = useState('');

    const [currentSchool, setCurrentSchool] = useState({ id: null });
    const [applications, setApplications] = useState([]);
    const [invitationMessage, setInvitationMessage] = useState('');
    const [isInvitationSuccessful, setIsInvitationSuccessful] = useState(false);


    const [isLoading, setIsLoading] = useState(false);

    const fetchAssociation = useCallback(async () => {
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_ASSOC}/user`, {
                userId: currentUser.id,
                schoolId: selectedValue
            }, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                }
            });
            setCurrentAssociation(response.data); // Update the state with the fetched data
        } catch (error) {
            console.error('Error fetching association:', error);
        }
    }, [currentUser, selectedValue]);

    //currentUser association, which will change per school
    //to fetch the user from the school she belong
    // Function to fetch users by school ID
    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_API_URL_SCHOOL}/users`,
                { schoolId: selectedValue }, {
                headers: {
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                }
            });
            setRows(response.data); // Update the state with the fetched data
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setIsLoading(false);
        }
    }, [selectedValue]);

    useEffect(() => {
        // Fetch users when the component mounts or when the selected school changes
        console.log(selectedValue)
        if (selectedValue) {
            fetchUsers();
            fetchAssociation();
        }
    }, [selectedValue, fetchUsers, currentUser, fetchAssociation]); // Dependency on selectedValue ensures the effect runs whenever selectedValue changes

    // Fetch schools when component mounts
    useEffect(() => {
        if (currentUser && currentUser.schools) {
            setSchools(currentUser.schools);
            //fetchAssociation();
            if (currentUser.schools.length > 0) {
                setSelectedValue(currentUser.schools[0].id);
            }
        }
    }, [currentUser]); // Empty dependency array ensures the effect runs only once

    // Function to handle school selection change
    const handleSchoolChange = (event) => {
        setSelectedValue(event.target.value); // Update selected school
        //fetchUsers(); // Fetch users belonging to the selected school
    };

    //
    useEffect(() => {
        // Assuming the current school is set based on some logic or user interaction
        if (selectedValue) {
            setCurrentSchool({ id: selectedValue });
        }
    }, [selectedValue]);

    const handleClose = (value) => {
        setOpen(false);
        //setSelectedValue(value);
    };

    /*const schoolAvatar = (
        <Avatar>
            <SchoolIcon />
        </Avatar>
    );*/

    const handleClickOpen = async () => {
        console.log("Current School State:", currentSchool); // Debugging line
        if (currentSchool && currentSchool.id) {
            console.log(`Fetching applications from: ${process.env.REACT_APP_API_URL_ASSOC}/applications/${currentSchool.id}`);
            setOpen(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL_ASSOC}/applications/${currentSchool.id}`, {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                    }
                });
                console.log("Applications fetched:", response.data); // Debugging line
                setApplications(response.data);
            } catch (e) {
                console.error(e);
            }
        } else {
            console.error("Cannot fetch applications: School ID is missing.");
        }
    };

    const handleAccept = async (associationRequest) => {
        try {
            // Sending request to approve the association
            const response = await axios.post(`${process.env.REACT_APP_API_URL_ASSOC}/approve`, associationRequest, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`,
                }
            });

            console.log('Success:', response.data);
            fetchUsers(); // Fetch new users after accepting
        } catch (error) {
            console.error("Error approving user:", error.response ? error.response.data : error.message);
        }
    };


    const handleReject = async (application) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL_ASSOC}/reject`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                },
                data: application // Pass the application object as data in the DELETE request
            });

            console.log('User rejected successfully:', response.data);

            // Update the UI by removing the rejected application from the list
            setApplications(applications.filter(app => app.id !== application.userId));
        } catch (error) {
            console.error('Error rejecting user:', error.response ? error.response.data : error.message);
        }
    };

    const handleDropdownOpen = (event, index) => {
        setDropdownAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleDeleteOpen = (event, index) => {
        // Open delete confirmation dialog when "Delete" button is clicked
        //setDeleteConfirmationDialogOpen(true);
        // Also set the deleteAnchorEl and selectedIndex
        setDeleteAnchorEl(event.currentTarget);
        setSelectedIndex(index);
        console.log(rows[index]);
    };

    const handleMenuClose = () => {
        // Close delete menu and reset selectedIndex
        setDeleteAnchorEl(null);
        setDropdownAnchorEl(null);
        setSelectedIndex(null);
    };

    const handleDelete = (event, index) => {
        // Open delete confirmation dialog when "Delete" button is clicked
        setDeleteConfirmationDialogOpen(true);
        // Also set the deleteAnchorEl and selectedIndex
        // setDeleteAnchorEl(event.currentTarget);
        // setSelectedIndex(index);
    };

    const confirmDelete = async () => {
        try {
            if (selectedIndex && rows[selectedIndex]) {
                const userId = rows[selectedIndex].id; // Get userId of the selected user
                const schoolId = rows[selectedIndex].schoolId; // Get schoolId of the selected user
                // Make an API call to delete the user association
                const response = await axios.delete(`${process.env.REACT_APP_API_URL_ASSOC}/${userId}/${schoolId}`, {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                    }
                });
                console.log("User deleted successfully. " + response.data);
                // Remove the deleted row from the state
                setRows(prevRows => prevRows.filter((_, index) => index !== selectedIndex));
            }
            // Close the delete confirmation dialog
            setDeleteConfirmationDialogOpen(false);
        } catch (error) {
            console.error("Error deleting user:", error);
            // Handle error scenario
        } finally {
            // Close the delete menu and reset selectedIndex
            handleMenuClose();
        }
    };

    const cancelDelete = () => {
        // Close delete confirmation dialog without deleting
        setDeleteConfirmationDialogOpen(false);
        setDropdownAnchorEl(null);
        setDeleteAnchorEl(null);
    };

    const handleRoleChange = (newRole) => {
        setSelectedRole(newRole);
        setConfirmationDialogOpen(true); // Open confirmation dialog
    };

    const confirmRoleChange = async () => {
        try {
            let endpoint = '';
            let newRole = '';
            if ((selectedRole === "Member" && rows[selectedIndex].admin) || (selectedRole === "Admin" && !rows[selectedIndex].admin)) {
                if (selectedRole === "Member" && rows[selectedIndex].admin) {
                    endpoint = `${process.env.REACT_APP_API_URL_ASSOC}/demote`;
                    newRole = false;
                } else if (selectedRole === "Admin" && !rows[selectedIndex].admin) {
                    endpoint = `${process.env.REACT_APP_API_URL_ASSOC}/promote`;
                    newRole = true;
                }

                const response = await axios.patch(endpoint, {
                    userId: rows[selectedIndex].id,
                    schoolId: rows[selectedIndex].schoolId // changed to rows[selectedIndex].schoolId from selectedIndex
                }, {
                    headers: {
                        'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                    }
                });

                console.log(response)

                // Update role in frontend state if successful
                const updatedRows = [...rows];
                updatedRows[selectedIndex].admin = newRole;
                setRows(updatedRows);
            }
        } catch (error) {
            console.error('Error changing role:', error);
            // Handle error scenario
        } finally {
            // Close confirmation dialog
            setConfirmationDialogOpen(false);
            // Close delete menu and reset selectedIndex
            handleMenuClose();
        }
    };

    const cancelRoleChange = () => {
        // Close confirmation dialog without changing role
        setConfirmationDialogOpen(false);
        setDropdownAnchorEl(null);
    };


    /*const handleInvite = () => {
        if (inviteEmail.trim() === '') {
            setInvitationMessage('Please enter a valid email.');
            return;
        }

        console.log("Inviting email:", inviteEmail);

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
                console.log("Invitation sent successfully:", response.data);
                setInvitationMessage('Invitation sent successfully!');
            })
            .catch(error => {
                console.error("Error inviting member:", error.response ? error.response.data : error.message);
                setInvitationMessage('Failed to send invitation. Please try again.');
            });

        setInviteEmail('');
    };*/

    const handleInvite = () => {
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (inviteEmail.trim() === '' || !emailRegex.test(inviteEmail)) {
            setInvitationMessage('Please enter a valid email.');
            setIsInvitationSuccessful(false);
            return;
        }

        console.log("Inviting email:", inviteEmail);

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
                console.log("Invitation sent successfully:", response.data);
                setInvitationMessage('Invitation sent successfully!');
                setIsInvitationSuccessful(true); // Set success state
            })
            .catch(error => {
                console.error("Error inviting member:", error.response ? error.response.data : error.message);

                // Set a more descriptive error message for the user
                if (error.response && error.response.data && error.response.data.message) {
                    setInvitationMessage(error.response.data.message);
                } else {
                    setInvitationMessage('Failed to send invitation. Please try again.');
                }
                setIsInvitationSuccessful(false); // Set failure state
            });

        // Clear the input after attempt
        setInviteEmail('');
    };

    // Filtered rows based on search value
    const filteredRows = rows.filter(row =>
        (row && row.name && row.name.toLowerCase().includes(searchValue.toLowerCase())) ||
        (row && row.email && row.email.toLowerCase().includes(searchValue.toLowerCase()))
    );

    return (
        <Container className="test" maxWidth="lg" sx={{ mb: 2 }}>
            <Grid container spacing={2}>

                {currentAssocation.admin === true ?
                    <React.Fragment>
                        <Grid item xs={12} md={6} lg={6}>
                            <Box sx={{ height: '55px' }}>
                                <TextField
                                    sx={{ height: '20px', width: "100%" }}
                                    id="search"
                                    label="Search by name or email"
                                    variant="outlined"
                                    className="searchTextField"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6} lg={6} sx={{ display: "flex", flexDirection: "row" }}>
                            <Box sx={{ width: '50%' }}>
                                <TextField
                                    id="invite"
                                    label="Enter email"
                                    variant="outlined"
                                    className="inviteTextField"
                                    value={inviteEmail}
                                    onChange={(e) => setInviteEmail(e.target.value)}
                                    fullWidth
                                    error={!!invitationMessage && !isInvitationSuccessful} // Error if there's a message and not successful
                                    InputProps={{
                                        style: {
                                            borderColor: isInvitationSuccessful ? 'green' : undefined, // Green border if successful
                                        },
                                    }}
                                />
                                {invitationMessage && (
                                    <Typography
                                        variant="body2"
                                        color={isInvitationSuccessful ? "green" : "error"} // Change color based on success
                                        sx={{ mt: 1, fontWeight: 'bold', marginRight: 41.5, width: "100%" }} // Add top margin and bold text
                                    >
                                        {invitationMessage}
                                    </Typography>
                                )}
                            </Box>

                            <FormControl sx={{ minWidth: 120 }} size="53px">
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
                                sx={{ width: "20%", height: "55px" }}
                                variant="contained"
                                className="inviteButton"
                                onClick={handleInvite}
                            >
                                Invite
                            </Button>

                        </Grid>
                        <Grid item xs={6} md={6} lg={12} sx={{ display: 'flex', alignSelf: "center" }}>
                            <FormControl sx={{ minWidth: 150 }} >
                                <InputLabel id="demo-select-small-label">School Filter</InputLabel>
                                <Select
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={selectedValue}
                                    label="Member"
                                    onChange={handleSchoolChange}
                                >
                                    {schools?.map((school) => (
                                        <MenuItem key={school.id} value={school.id}>
                                            {transformSchoolText(school.name)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6} md={6} lg={12} sx={{ display: 'flex', alignSelf: "center" }}>
                            <FormControl sx={{ minWidth: 150 }} >
                                {/* Application Dialog */}
                                <Button variant="outlined" onClick={handleClickOpen}>
                                    Open Application Dialog
                                </Button>
                                <Dialog onClose={handleClose} open={open} sx={{ margin: 2, '& .MuiDialog-paper': { minWidth: 400 } }}>
                                    <DialogTitle sx={{ textAlign: 'center' }}>Application for School</DialogTitle>
                                    <List sx={{ p: 3 }}>
                                        {applications.length === 0 ? (
                                            <ListItem>
                                                <ListItemText primary="No applications found." />
                                            </ListItem>
                                        ) : (
                                            applications?.map(application => (
                                                <ListItem key={application.id} disableGutters>
                                                    <ListItemText primary={`${application.fname} ${application.mname || ''} ${application.lname}`} />
                                                    <Box display="flex" justifyContent="space-between" gap={1}>
                                                        <Button
                                                            onClick={() => {
                                                                handleAccept({ userId: application.id, schoolId: application.schoolId });
                                                                handleClose();  // Close the dialog after accepting
                                                            }}
                                                            variant="contained"
                                                            color="primary"
                                                        >
                                                            Accept
                                                        </Button>

                                                        <Button
                                                            onClick={() => {
                                                                handleReject({ userId: application.id, schoolId: application.schoolId });
                                                                handleClose();  // Close the dialog after rejecting
                                                            }}
                                                            variant="contained"
                                                            color="secondary"
                                                        >
                                                            Reject
                                                        </Button>
                                                    </Box>
                                                </ListItem>
                                            ))
                                        )}
                                    </List>

                                </Dialog>
                            </FormControl>
                        </Grid>
                    </React.Fragment>
                    :
                    <React.Fragment>
                        <Grid item xs={12} md={12} lg={12} sx={{ display: "flex", flexDirection: "row" }}>
                            <Box sx={{ height: '55px' }}>
                                <FormControl sx={{ minWidth: 150 }} >
                                    <InputLabel id="demo-select-small-label">School Filter</InputLabel>
                                    <Select
                                        labelId="demo-select-small-label"
                                        id="demo-select-small"
                                        value={selectedValue}
                                        label="Member"
                                        onChange={handleSchoolChange}
                                    >
                                        {schools?.map((school) => (
                                            <MenuItem key={school.id} value={school.id}>
                                                {transformSchoolText(school.name)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                            <TextField
                                sx={{ height: '20px', width: "350px", ml: 2 }}
                                id="search"
                                label="Search by name or email"
                                variant="outlined"
                                className="searchTextField"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </Grid>
                    </React.Fragment>
                }
                <Grid item xs={12} md={12} lg={12} sx={{}}>
                    <TableContainer component={Paper} sx={{ padding: '10px', paddingBottom: '30px' }}>
                        <Table md={{ display: 'flex', height: '100%', width: '100%' }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    {currentAssocation.admin === "true" && <TableCell>Actions</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <>
                                        {Array.from({ length: 3 }).map((_, index) => (
                                            <TableRow key={index}>
                                                <TableCell colSpan={4} align="center">
                                                    <Skeleton animation="wave" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    filteredRows.map((row, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Grid container alignItems="center" spacing={1}>
                                                    <Grid item>
                                                        {row.name && (
                                                            <Avatar sx={{ bgcolor: blue[900] }}>
                                                                {row.name.charAt(0)}
                                                            </Avatar>
                                                        )}
                                                    </Grid>
                                                    <Grid item>{`${row.fname} ${row.mname.charAt(0) + "."} ${row.lname}`}</Grid>
                                                </Grid>
                                            </TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>
                                                {/* Role with dropdown arrow */}
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    {row.admin === true ?
                                                        row.position === "Principal" ?
                                                            <span>Principal</span>
                                                            :
                                                            <span>Admin</span>
                                                        :
                                                        <span>Member</span>
                                                    }
                                                    {row.position !== "Principal" &&
                                                        currentAssocation.admin === true &&
                                                        currentAssocation.position === "Principal" &&
                                                        <ArrowDropDownIcon onClick={(event) => handleDropdownOpen(event, index)} />}
                                                </div>
                                                {/* Dropdown menu for role options */}
                                                {row.position !== "Principal" &&
                                                    currentAssocation.admin === true &&
                                                    currentAssocation.position === "Principal" &&
                                                    <Menu
                                                        id={`menu-dropdown-${index}`}
                                                        anchorEl={dropdownAnchorEl}
                                                        open={Boolean(dropdownAnchorEl && selectedIndex === index)}
                                                        onClose={handleMenuClose}
                                                    >
                                                        {/* Role options */}
                                                        <MenuItem onClick={() => handleRoleChange("Admin")}>Admin</MenuItem>
                                                        <MenuItem onClick={() => handleRoleChange("Member")}>Member</MenuItem>
                                                    </Menu>
                                                }
                                            </TableCell>
                                            {currentAssocation.admin === true && row.position !== "Principal" &&
                                                <TableCell>
                                                    {/* Delete button */}
                                                    <Button
                                                        aria-controls={`menu-delete-${index}`}
                                                        aria-haspopup="true"
                                                        onClick={(event) => handleDeleteOpen(event, index)}
                                                    >
                                                        <MoreHorizIcon />
                                                    </Button>
                                                    {/* Delete menu */}
                                                    <Menu
                                                        id={`menu-delete-${index}`}
                                                        anchorEl={deleteAnchorEl}
                                                        open={Boolean(deleteAnchorEl && selectedIndex === index)}
                                                        onClose={handleMenuClose}
                                                    >
                                                        <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                                    </Menu>
                                                </TableCell>
                                            }
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            {/* Confirmation dialog for role change */}
            <Dialog open={confirmationDialogOpen} onClose={cancelRoleChange}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    Are you sure you want to change?
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmRoleChange}>Save Changes</Button>
                    <Button onClick={cancelRoleChange}>Cancel</Button>
                </DialogActions>
            </Dialog>
            {/* Confirmation dialog for delete */}
            <Dialog open={deleteConfirmationDialogOpen} onClose={cancelDelete}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete?
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmDelete}>Yes</Button>
                    <Button onClick={cancelDelete}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default PeoplePage;



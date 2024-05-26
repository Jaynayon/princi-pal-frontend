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
import { Menu, Dialog, DialogTitle, DialogContent, DialogActions, ListItemAvatar, ListItemText } from '@mui/material';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import SchoolIcon from '@mui/icons-material/School'; // If SchoolIcon is a MUI icon
import axios from 'axios'; // Import Axios for making HTTP requests
import { useSchoolContext } from '../Context/SchoolProvider';
import { useNavigationContext } from '../Context/NavigationProvider';

function People(props) {
    const [member, setMember] = useState('');
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

    const fetchAssociation = useCallback(async () => {
        try {
            const response = await axios.post('http://localhost:4000/associations/user', {
                userId: currentUser.id,
                schoolId: selectedValue
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
        try {
            const response = await axios.post('http://localhost:4000/schools/users', { schoolId: selectedValue });
            setRows(response.data); // Update the state with the fetched data
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }, [selectedValue]);

    useEffect(() => {
        // Fetch users when the component mounts or when the selected school changes
        console.log(selectedValue)
        if (selectedValue) {
            fetchUsers();
            fetchAssociation();
        }
        console.log(currentAssocation)
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
    const handleMemberChange = (event) => {
        setSelectedValue(event.target.value); // Update selected school
        //fetchUsers(); // Fetch users belonging to the selected school
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        //setSelectedValue(value);
    };

    const schoolAvatar = (
        <Avatar>
            <SchoolIcon />
        </Avatar>
    );

    const handleAccept = () => {
        handleClose('accepted');
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
            if (selectedIndex !== null && rows[selectedIndex]) {
                const userId = rows[selectedIndex].userId; // Get userId of the selected user
                const schoolId = rows[selectedIndex].schoolId; // Get schoolId of the selected user
                // Make an API call to delete the user association
                await axios.delete(`http://localhost:4000/associations/${userId}/${schoolId}`);
                console.log("User deleted successfully.");
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
    
            if (rows[selectedIndex].admin) {
                endpoint = 'http://localhost:4000/associations/demote';
                newRole = false;
            } else {
                endpoint = 'http://localhost:4000/associations/promote';
                newRole = true;
            }
    
            const response = await axios.patch(endpoint, {
                userId: rows[selectedIndex].id,
                schoolId: selectedValue
            });
    
            // Update role in frontend state if successful
            const updatedRows = [...rows];
            updatedRows[selectedIndex].admin = newRole;
            setRows(updatedRows);
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

    const handleInvite = () => {
        // Implement invite functionality here
        console.log("Inviting email:", inviteEmail);
        // You can send an invitation using the inviteEmail value
        // Reset inviteEmail state after sending invitation if needed
        setInviteEmail('');
    };

    // Filtered rows based on search value
    const filteredRows = rows.filter(row =>
        (row && row.name && row.name.toLowerCase().includes(searchValue.toLowerCase())) ||
        (row && row.email && row.email.toLowerCase().includes(searchValue.toLowerCase()))
    );

    return (
        <Container className="test" maxWidth="lg" sx={{ mt: 2, mb: 2 }}>
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
                        <Grid item xs={12} md={6} lg={6}>
                            <TextField
                                sx={{ width: '50%' }}
                                id="invite"
                                label="Invite by email"
                                variant="outlined"
                                className="inviteTextField"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                            <FormControl sx={{ minWidth: 120 }} size="53px">
                                <InputLabel sx={{}} id="demo-select-small-label">Member</InputLabel>
                                <Select
                                    sx={{}}
                                    labelId="demo-select-small-label"
                                    id="demo-select-small"
                                    value={member}
                                    label="Member"
                                    onChange={(event) => setMember(event.target.value)}
                                >
                                    <MenuItem>Member</MenuItem>
                                    <MenuItem>Guess</MenuItem>
                                    <MenuItem>Admin</MenuItem>
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
                                    onChange={handleMemberChange}
                                >
                                    {schools?.map((school) => (
                                        <MenuItem key={school.id} value={school.id}>
                                            {school.name}
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
                                <Dialog onClose={handleClose} open={open} sx={{ '& .MuiDialog-paper': { minWidth: 400 } }}>
                                    <DialogTitle sx={{ textAlign: 'center' }}>Application for School</DialogTitle>
                                    <List>
                                        <ListItem disableGutters sx={{ paddingRight: '20px' }}>
                                            <ListItemAvatar sx={{ paddingLeft: '10px' }}>{schoolAvatar}</ListItemAvatar>
                                            <ListItemText primary="Kiki Kiki" />
                                            <Button onClick={handleAccept} variant="contained" color="primary">
                                                Accept
                                            </Button>
                                        </ListItem>
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
                                        onChange={handleMemberChange}
                                    >
                                        {schools?.map((school) => (
                                            <MenuItem key={school.id} value={school.id}>
                                                {school.name}
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
                                {filteredRows.map((row, index) => (
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
                                ))}
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
                    <Button onClick={confirmRoleChange}>Cancel</Button>
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

export default People;




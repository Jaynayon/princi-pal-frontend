import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
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
    const {currentUser} = useNavigationContext();

        //currentUser association, which will change per school
        //to fetch the user from the school she belong
        // Function to fetch users by school ID
        const fetchUsers = async () => {
            try {
                const response = await axios.post('http://localhost:4000/schools/users', { schoolId: selectedValue });
                setRows(response.data); // Update the state with the fetched data
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        
                    // Function to handle school selection change
            const handleMemberChange = (event) => {
                setSelectedValue(event.target.value); // Update selected school
                fetchUsers(); // Fetch users belonging to the selected school
            };

            useEffect(() => {
                // Fetch users when the component mounts or when the selected school changes
                if (selectedValue) {
                    fetchUsers(selectedValue);
                }
            }, [selectedValue]); // Dependency on selectedValue ensures the effect runs whenever selectedValue changes


        // Function to fetch schools from backend
        const fetchSchools = async () => {
        try {
            const response = await fetch('http://localhost:4000/schools/all');
            if (!response.ok) {
                throw new Error('Failed to fetch schools');
            }
            const data = await response.json();
            setSchools(data); // Set the fetched schools to the state

            // Set the default selected school value and fetch users
            if (data.length > 0) {
                setSelectedValue(data[0].id); // Set to the first school's ID as default
            }
        } catch (error) {
            console.error('Error fetching schools:', error);
        }
    };
        // Fetch schools when component mounts
        useEffect(() => {
            fetchSchools();
            // If you have a predefined list of schools in currentUser, you can use it instead
            // setSchools(currentUser?.schools || []);
        }, []); // Empty dependency array ensures the effect runs only once

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
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
        setDeleteAnchorEl(event.currentTarget);
        setSelectedIndex(index);
    };

    const handleMenuClose = () => {
        setDropdownAnchorEl(null);
        setDeleteAnchorEl(null);
        setSelectedIndex(null);
    };

    const handleDelete = () => {
        // Open confirmation dialog before deleting
        setDeleteConfirmationDialogOpen(true);
    };

    const confirmDelete = () => {
        // Implement delete functionality here
        console.log("Delete button clicked for row at index:", selectedIndex);
        // Close the menu after delete
        handleMenuClose();
        // Close delete confirmation dialog
        setDeleteConfirmationDialogOpen(false);
    };

    const cancelDelete = () => {
        // Close delete confirmation dialog without deleting
        setDeleteConfirmationDialogOpen(false);
    };

    const handleRoleChange = (newRole) => {
        setSelectedRole(newRole); // Set the selected role
        // Open confirmation dialog before changing role
        setConfirmationDialogOpen(true);
    };

    const confirmRoleChange = () => {
        // Implement role change functionality here
        console.log(`Role changed to ${selectedRole} for row at index:`, selectedIndex);
        // Close the menu after role change
        handleMenuClose();
        // Close confirmation dialog
        setConfirmationDialogOpen(false);
    };

    const cancelRoleChange = () => {
        // Close confirmation dialog without changing role
        setConfirmationDialogOpen(false);
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
        <Container className="test" maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12}
                    sx={{
                        display: 'flex',
                    }}>
                    <TextField
                        sx={{ margin: '11px', marginTop: '-5px', height: '20px', width: '40%' }}
                        id="search"
                        label="Search by name or email"
                        variant="outlined"
                        className="searchTextField"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                    <TextField
                        sx={{ margin: '5px', marginTop: '-5px', marginLeft: '50px' , width: '30%' }}
                        id="invite"
                        label="Invite by email"
                        variant="outlined"
                        className="inviteTextField"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    <FormControl sx={{ minWidth: 120 }} size="53px">
                        <InputLabel sx={{ margin: '5px', marginTop: '-5px'}} id="demo-select-small-label">Member</InputLabel>
                        <Select
                            sx={{ margin: '-5px', marginTop: '-5px' }}
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
                        sx={{ margin: '5px', marginTop: '-5px', width: '10%'}}
                        variant="contained"
                        className="inviteButton"
                        onClick={handleInvite}
                    >
                        Invite
                    </Button>
                </Grid>
                <Grid item xs={5} md={12} lg={12} sx={{ display: 'flex', margin: '5px', marginTop: '0px' }}>
    <FormControl sx={{ m: 1, minWidth: 150 }} >
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
<Grid item xs={5} md={12} lg={12} sx={{ display: 'flex', margin: '5px', marginTop: '0px', }}>
    <FormControl sx={{ m: 1, minWidth: 150 }} >
        {/* Application Dialog */}
        <br />
        <Button variant="outlined" onClick={handleClickOpen}>
            Open Application Dialog
        </Button>
        <Dialog onClose={handleClose} open={open} sx={{'& .MuiDialog-paper': {minWidth: 400} }}>
            <DialogTitle sx={{textAlign: 'center'}}>Application for School</DialogTitle>
            <List>
                <ListItem disableGutters sx={{paddingRight: '20px'}}>
                    <ListItemAvatar sx={{paddingLeft: '10px'}}>{schoolAvatar}</ListItemAvatar>
                    <ListItemText primary="Kiki Kiki" />
                    <Button onClick={handleAccept} variant="contained" color="primary">
                Accept
            </Button>
                </ListItem>
            </List>
        </Dialog>
    </FormControl>
</Grid>
                <Grid item xs={12} md={12} lg={12} sx={{ margin: '5px', marginTop: '-5px' }}>
                    <TableContainer component={Paper} sx={{ padding: '10px', paddingBottom: '30px' }}>
                        <Table md={{ display: 'flex', height: '100%', width: '100%' }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Role</TableCell>
                                    <TableCell>Last Activity</TableCell>
                                    <TableCell>Actions</TableCell>
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
                                            <Grid item>{row.name || row.email}</Grid>
                                        </Grid>
                                    </TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>
                                            {/* Role with dropdown arrow */}
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <span>{row.role}</span>
                                                <ArrowDropDownIcon onClick={(event) => handleDropdownOpen(event, index)} />
                                            </div>
                                            {/* Dropdown menu for role options */}
                                            <Menu
                                                id={`menu-dropdown-${index}`}
                                                anchorEl={dropdownAnchorEl}
                                                open={Boolean(dropdownAnchorEl && selectedIndex === index)}
                                                onClose={handleMenuClose}
                                            >
                                                {/* Role options */}
                                                <MenuItem onClick={() => handleRoleChange("ADMIN")}>ADMIN</MenuItem>
                                                <MenuItem onClick={() => handleRoleChange("OWNER")}>OWNER</MenuItem>
                                            </Menu>
                                        </TableCell>
                                        <TableCell>{row.lastActivity}</TableCell>
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
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
            {/* Confirmation dialog for role change */}
            <Dialog open={confirmationDialogOpen} onClose={() => setConfirmationDialogOpen(false)}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    Are you sure you want to change?
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmRoleChange}>Cancel</Button>
                    <Button onClick={cancelRoleChange}>Save Changes</Button>
                </DialogActions>
            </Dialog>
            {/* Confirmation dialog for delete */}
            <Dialog open={deleteConfirmationDialogOpen} onClose={() => setDeleteConfirmationDialogOpen(false)}>
                <DialogTitle>Confirmation</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete?
                </DialogContent>
                <DialogActions>
                    <Button onClick={confirmDelete}>Delete</Button>
                    <Button onClick={cancelDelete}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default People;




import React, { useState } from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
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
import './People.css';

function People(props) {
    const [member, setMember] = useState('');
    const handleChange = (event) => {
        setMember(event.target.value);
    };

    const rows = [
        {name: 'Deriel Magallanes', email: 'derielgwapsmagallanes@cit.edu', role: 'Member', lastActivity: 'Nov 2'},
        {name: 'Ellain J', email: 'ellaine@cit.edu', role: 'Member',lastActivity: 'Dec 3' },
        {name: 'Janicka Ngeps', email: 'janickangepert@cit.edu', role: 'Owner' },
        {name: 'Brian Despi', email: 'briandespirads@cit.edu', role: 'Member' },
        {name: 'Luff D', email: 'luffyd@cit.edu', role: 'Member' },
    ];

    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
        >
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    <TextField id="search" label="Search by name or email" variant="outlined" className="searchTextField" />
                </Grid>
                <Grid item>
                    <TextField id="invite" label="Invite by email" variant="outlined" className="inviteTextField" />
                </Grid>
                <Grid item>
                    <FormControl sx={{ m: 1, minWidth: 120 }} size="53px">
                        <InputLabel id="demo-select-small-label">Member</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={member}
                            label="Member"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem>Member</MenuItem>
                            <MenuItem>Guess</MenuItem>
                            <MenuItem>Admin</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item>
                    <Button variant="contained" className="inviteButton">Invite</Button>
                </Grid>
                <Grid item>
                    <FormControl sx={{ m: 1, minWidth: 150 }} size="60px">
                        <InputLabel id="demo-select-small-label">School Filter</InputLabel>
                        <Select
                            labelId="demo-select-small-label"
                            id="demo-select-small"
                            value={member}
                            label="Member"
                            onChange={handleChange}
                        >
                            <MenuItem value="">
                                <em>None</em>
                            </MenuItem>
                            <MenuItem>CIT</MenuItem>
                            <MenuItem>ACT</MenuItem>
                            <MenuItem>SM CITY</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
                <Grid container spacing={10}>
                    <Grid item md={12} md={8} lg={9}>
                    <TableContainer component={Paper} sx={{ width: 1099, height: 500}}>
                            <Table md={{ width  : 500, height: 600}} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Last Activity</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>
                                                <Grid container alignItems="center" spacing={1}>
                                                    <Grid item>
                                                        <Avatar sx={{ bgcolor: blue[900] }}>{row.name.charAt(0)}</Avatar>
                                                    </Grid>
                                                        <Grid item>{row.name}</Grid>
                                                    </Grid>
                                            </TableCell>
                                            <TableCell>{row.email}</TableCell>
                                            <TableCell>{row.role}</TableCell>
                                            <TableCell>{row.lastActivity}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default People;

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
        { name: 'Deriel Magallanes', email: 'derielgwapsmagallanes@cit.edu', role: 'Member', lastActivity: 'Nov 2' },
        { name: 'Ellain J', email: 'ellaine@cit.edu', role: 'Member', lastActivity: 'Dec 3' },
        { name: 'Janicka Ngeps', email: 'janickangepert@cit.edu', role: 'Owner' },
        { name: 'Brian Despi', email: 'briandespirads@cit.edu', role: 'Member' },
        { name: 'Luff D', email: 'luffyd@cit.edu', role: 'Member' },
    ];

    return (
        <Container className="test" maxWidth="lg" sx={{ /*mt: 4,*/ mb: 4 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={12} lg={12}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                    }}>
                    <TextField sx={{ margin: '5px', marginTop: '-5px' }} id="search" label="Search by name or email" variant="outlined" className="searchTextField" />
                    <TextField sx={{ margin: '5px', marginTop: '-5px' }} id="invite" label="Invite by email" variant="outlined" className="inviteTextField" />
                    <FormControl sx={{ minWidth: 120 }} size="53px">
                        <InputLabel sx={{ margin: '5px', marginTop: '-5px' }} id="demo-select-small-label">Member</InputLabel>
                        <Select
                            sx={{ margin: '5px', marginTop: '-5px' }}
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
                    <Button sx={{ margin: '5px', marginTop: '-5px' }} variant="contained" className="inviteButton">Invite</Button>
                </Grid>
                <Grid item xs={5} md={5} lg={5} sx={{ display: 'flex', }}>
                    <TextField sx={{ margin: '5px', marginTop: '-5px', marginBottom: '-5px' }} id="schoolFilter" label="School Filter" variant="outlined" className="schoolFilter" />
                </Grid>
                <Grid item xs={12} md={12} lg={12} sx={{ margin: '5px' }}>
                    <TableContainer component={Paper} sx={{ padding: '10px', paddingBottom: '30px' }}>
                        <Table md={{ display: 'flex', height: '100%', width: '100%' }} aria-label="simple table">
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
            </Grid>
        </Container>
    );
}

export default People;

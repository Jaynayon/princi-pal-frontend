import React from 'react';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button'; 
import './People.css';

function People(props) {
    return (
        <Box
            component="form"
            noValidate
            autoComplete="off"
        >
            <Grid container spacing={0} alignItems="center">
                <Grid>
                    <TextField id="search" label="Search by name or email" variant="outlined" className="searchTextField" />
                </Grid>
                <Grid>
                    <TextField id="invite" label="Invite by email" variant="outlined" className="inviteTextField" />
                </Grid>
                <Grid>
                    <Button variant="contained" className="inviteButton">Invite</Button>
                </Grid>
            </Grid>
            <Container maxWidth="lg" sx={{ mt: 3, mb: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={8} lg={9}>
                        <Paper className='paperContainer'>
                            {/* Content */}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4} lg={3}>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default People;

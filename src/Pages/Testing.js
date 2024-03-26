import '../App.css'
import React from 'react';
import Paper from '@mui/material/Paper';
import RecordsTable from '../Components/Table/RecordsTable';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import DateFilter from '../Components/Filters/DateFilter';

//this includes the button lists
//pero separate kada component

function Testing() {
    return (
        <Container maxWidth="lg" sx={{ /*mt: 4,*/ mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={12}>
                    <Paper
                        sx={[styles.header, { p: 2, display: 'flex', flexDirection: 'row' }]}
                        elevation={0}
                        variant='outlined'>
                        <DateFilter />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <RecordsTable />
                </Grid>
                <Grid item xs={12} md={8} lg={9}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                    >
                        Content
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4} lg={3}>
                    <Paper
                        sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            height: 240,
                        }}
                    >
                        Content
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
}

const styles = {
    header: {
        overflowWrap: "break-word",
        fontFamily: 'Mulish-Regular'
    },
}

export default Testing;

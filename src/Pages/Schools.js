import '../App.css'
import React from 'react';
import Paper from '@mui/material/Paper';
import RecordsTable from '../Components/Table/RecordsTable';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { DateFilter, FieldsFilter, SearchFilter } from '../Components/Filters/Filters'
//import { useState } from 'react';
//import { useEffect } from 'react';

//xs, sm, md sizes are important

function Schools(props) {
    return (
        <Container className="test" maxWidth="lg" sx={{ /*mt: 4,*/ mb: 4 }}>
            <Grid container spacing={2} sx={{ position: 'relative' }}> {/*relative to allow date component to float*/}
                <Grid item xs={12} md={12} lg={12}>
                    <Paper
                        sx={[
                            styles.header, {
                                p: 2,
                                display: 'flex',
                                flexDirection: 'row',
                            }
                        ]}
                        elevation={0}
                        variant='outlined'>
                        <Box style={styles.header.buttons}>
                            <Box sx={{}} >
                                <DateFilter />
                                <Paper sx={{ display: 'flex', position: 'absolute', width: '300px', height: '15%' }}>

                                </Paper>
                            </Box>
                            <FieldsFilter />
                            <SearchFilter />
                        </Box>
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
        </Container >
    );
}

const styles = {
    header: {
        overflow: 'auto', //if overflow, hide it
        overflowWrap: "break-word",
        fontFamily: 'Mulish-Regular',
        buttons: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '650px', //adjust the container
            //position: 'relative'
        }
    },
}

export default Schools;
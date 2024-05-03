import React, { useState } from 'react';
import 'react-date-range/dist/styles.css'; 
import 'react-date-range/dist/theme/default.css'; 
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import ReactApexChart from 'react-apexcharts';
import EditIcon from '@mui/icons-material/Edit';
import Typography from '@mui/material/Typography';
import { DateFilter } from '../Components/Filters/Filters';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import { Box, Button, Menu, MenuItem } from '@mui/material';

const ApexChart = () => {
    const [options] = useState({
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: 'Line Chart',
            align: 'left',
            style: {
                fontFamily: 'Mulish-Regular',
                fontSize: '20px',
            }
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        }
    });

    const [series] = useState([{
        name: "Budget",
        data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }]);

    return (
        <div>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="line" height={350} />
            </div>
            <div id="html-dist"></div>
        </div>
    );
};

function Dashboard(props) {
    const [selectedSchool, setSelectedSchool] = useState('');
    const handleSchoolChange = (event) => {
        setSelectedSchool(event.target.value);
    };
    
    const [clickedButton, setClickedButton] = useState('');
    const [editableAmounts, setEditableAmounts] = useState({
        'Monthly Budget': { currency: 'Php', amount: '0.00' },
        'Budget Limit': { currency: 'Php', amount: '0.00' },
        'Total Balance': { currency: 'Php', amount: '0.00' }
    });
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');

    const getCurrentMonthYear = () => {
        const currentDate = new Date();
        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const month = monthNames[currentDate.getMonth()];
        const year = currentDate.getFullYear();
        return `${month} ${year}`;
    };

    const handleOpen = (text) => {
        setOpen(true);
        setClickedButton(text);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (event) => {
        const newValue = event.target.value;
        if (
            newValue === '' ||                      
            (newValue >= 0 && newValue <= 999999)  
        ) {
            setEditableAmounts({
                ...editableAmounts,
                [clickedButton]: { ...editableAmounts[clickedButton], amount: newValue }
            });
            setError('');
        } else {
            setError('Please enter a valid number between 0 and 999,999.');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(`New ${clickedButton}: ${editableAmounts[clickedButton].currency} ${editableAmounts[clickedButton].amount}`);
        setOpen(false);
    };

    const [schoolMenuAnchor, setSchoolMenuAnchor] = useState(null);

    const handleClickSchoolMenu = (event) => {
        setSchoolMenuAnchor(event.currentTarget);
    };

        const handleCloseSchoolMenu = () => {
    setSchoolMenuAnchor(null);
    };

    const handleSelectSchool = (school) => {
    setSelectedSchool(school); 
    setSchoolMenuAnchor(null); 
    };

    const renderEditableCard = (title) => (
        <Paper
            sx={{
                position: 'relative',
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 160,
                textAlign: 'left',
                paddingLeft: (title === 'Monthly Budget' || title === 'Budget Limit' || title === 'Total Balance') ? '30px' : '0',
            }}
        >
            {title}
            <p style={{ fontSize: '2.0rem', fontWeight: 'bold' }}>{editableAmounts[title].currency} {editableAmounts[title].amount}</p>
            {title === 'Budget Limit' && (
                <Button onClick={() => handleOpen(title)} className={clickedButton === title ? 'clicked' : ''} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', padding: 0 }}>
                    <EditIcon sx={{ width: '30px', height: '30px' }} />
                </Button>
            )}
            <Modal
                open={open && clickedButton === title}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    width: 400,
                    borderRadius: '15px',
                    textAlign: 'center',
                }}>
                    <Button onClick={handleClose} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: '#757575', fontSize: '1.5rem', cursor: 'pointer' }}>×</Button>
                    <h2 id="modal-modal-title" style={{ fontSize: '30px', marginBottom: '20px' }}>Edit {title}</h2>
                    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                        <TextField
                            type="text"
                            value={editableAmounts[title].amount}
                            onChange={handleChange}
                            label="Input New Amount"
                        />
                    </form>
                    <div style={{ marginBottom: '20px' }}>
                        <Button onClick={handleSubmit} style={{ backgroundColor: '#19B4E5', borderRadius: '10px', color: '#fff', width: '160px', padding: '10px 0' }}>Save</Button>
                    </div>
                </Box>
            </Modal>
        </Paper>
    );
    
    const renderSummaryCard = () => (
        <Paper
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 380,
                textAlign: 'left',
            }}
        >
            <p style={{ paddingLeft: '20px', fontWeight: 'bold', marginBottom: '5px', marginTop: '5px', fontSize: '20px' }}>Summary</p>
            <p style={{ paddingLeft: '20px', paddingBottom: '5px', fontSize: '12px', marginTop: '0' }}>{getCurrentMonthYear()}</p>
            <p style={{ paddingLeft: '20px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '0' }}>Total Monthly Budget: {editableAmounts['Monthly Budget'].currency} {editableAmounts['Monthly Budget'].amount}</p>
            <p style={{ paddingLeft: '20px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '0' }}>Total Monthly Budget Limit: {editableAmounts['Budget Limit'].currency} {editableAmounts['Budget Limit'].amount}</p>
            <p style={{ paddingLeft: '20px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '0' }}>Total Monthly Balance: {editableAmounts['Total Balance'].currency} {editableAmounts['Total Balance'].amount}</p>
        </Paper>
    );

    return (
        <Container className="test" maxWidth="lg">
            <Box sx={{ position: 'relative' }}>
                {}
                <Grid container spacing={2}>
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
                        <DateFilter />
            <Box sx={{ m: 1, minWidth: 150 }}>
                <Button
                    id="school-filter"
                    aria-controls="school-menu"
                    aria-haspopup="true"
                    onClick={handleClickSchoolMenu}
                    sx={{ fontWeight: '900' }} // Adjust font weight
                >
                School
                </Button>
                <Menu
                    id="school-menu"
                    anchorEl={schoolMenuAnchor}
                    open={Boolean(schoolMenuAnchor)}
                    onClose={handleCloseSchoolMenu}
            >
                <MenuItem onClick={() => handleSelectSchool("")}><em>None</em></MenuItem>
                <MenuItem onClick={() => handleSelectSchool("CIT")}>CIT</MenuItem>
                <MenuItem onClick={() => handleSelectSchool("ACT")}>ACT</MenuItem>
                <MenuItem onClick={() => handleSelectSchool("SM CITY")}>SM CITY</MenuItem>
                </Menu>
                </Box>
            </Box>

                    </Paper>
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                    <Box style={{
                        display: 'flex', justifyContent: 'space-between', marginBottom: '1rem',
                        marginLeft: '10px', marginRight: '10px' 
                    }}>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                            sx={{ flexGrow: 1, textAlign: 'left', color: '#252733', fontWeight: 'bold' }}
                        >
                            Analytics
                        </Typography>
                        <Typography
                            component="h1"
                            variant="h6"
                            color="inherit"
                            noWrap
                        
                        >
                            {getCurrentMonthYear()}
                        </Typography>
                    </Box>
                </Grid>

                <Grid item xs={12} md={12} lg={12}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginTop: "-15px",
                    }}>
                    <Grid container >
                        <Grid item xs={12} md={4} lg={4} sx={{ padding: '5px' }}>
                            {renderEditableCard('Monthly Budget')}
                        </Grid>
                        <Grid item xs={12} md={4} lg={4} sx={{ padding: '5px' }}>
                            {renderEditableCard('Budget Limit')}
                        </Grid>
                        <Grid item xs={12} md={4} lg={4} sx={{ padding: '5px' }}>
                            {renderEditableCard('Total Balance')}
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={12} lg={12}>
                    <Grid container >
                        <Grid item xs={12} md={8} lg={8} sx={{ padding: '5px' }}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 380,
                                }}
                            >
                                <ApexChart />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4} lg={4} sx={{ padding: '5px' }}>

                            {renderSummaryCard()}
                        </Grid>
                    </Grid>
                </Grid>
                
                </Grid>
            </Box>
        </Container>
    );
}

const styles = {
    header: {
        overflow: 'auto',
        overflowWrap: "break-word",
        fontFamily: 'Mulish-Regular',
        buttons: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '650px'
        }
    },
}

export default Dashboard;

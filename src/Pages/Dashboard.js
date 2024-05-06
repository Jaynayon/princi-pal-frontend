import React, { useState, useEffect } from 'react';
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
import Select from '@mui/material/Select';
import { Box, Button, Menu, MenuItem } from '@mui/material';

const ApexChart = ({ data }) => {
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
        data: data.budgetData
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
    const [schoolData, setSchoolData] = useState({
        'CIT': {
            monthlyBudget: { currency: 'Php', amount: '1000.00' },
            budgetLimit: { currency: 'Php', amount: '0.00' },
            totalBalance: { currency: 'Php', amount: '500.00' },
            budgetData: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        },
        'ACT': {
            monthlyBudget: { currency: 'Php', amount: '1500.00' },
            budgetLimit: { currency: 'Php', amount: '0.00' },
            totalBalance: { currency: 'Php', amount: '1000.00' },
            budgetData: [20, 45, 25, 61, 55, 72, 78, 101, 156]
        },
        'SM CITY': {
            monthlyBudget: { currency: 'Php', amount: '2000.00' },
            budgetLimit: { currency: 'Php', amount: '0.00' },
            totalBalance: { currency: 'Php', amount: '1500.00' },
            budgetData: [15, 38, 30, 49, 40, 65, 70, 85, 135]
        }
    });

    useEffect(() => {
        const firstOption = Object.keys(schoolData)[0];
        if (!selectedSchool) {
            setSelectedSchool(firstOption);
            setEditableAmounts(schoolData[firstOption]);
        }
    }, [schoolData, selectedSchool]);

    const handleSchoolChange = (event) => {
        setSelectedSchool(event.target.value);
    };
    
    const [clickedButton, setClickedButton] = useState('');
    const [editableAmounts, setEditableAmounts] = useState({});
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [selectedMonthYear, setSelectedMonthYear] = useState('');
    const [applyButtonClicked, setApplyButtonClicked] = useState(false);

    useEffect(() => {
        const firstOption = Object.keys(schoolData)[0];
        if (!selectedSchool) {
            setSelectedSchool(firstOption);
            setEditableAmounts(schoolData[firstOption]);
        }
        if (!applyButtonClicked) {
            setSelectedMonthYear(getCurrentMonthYear());
        }
    }, [schoolData, selectedSchool, applyButtonClicked]);

    const handleDateFilterApply = (selectedMonthYear) => {
        setSelectedMonthYear(selectedMonthYear);
    };

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
        const regex = /^\d+(\.\d{0,2})?$/;
        if (
            newValue === '' ||                      
            (regex.test(newValue) && parseFloat(newValue) >= 0 && parseFloat(newValue) <= 999999999)  
        ) {
            setEditableAmounts({
                ...editableAmounts,
                [clickedButton]: { ...editableAmounts[clickedButton], amount: newValue }
            });
            setError('');
        } else {
            setError('Please enter a valid number.');
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const updatedAmount = editableAmounts[clickedButton];
        console.log(`New ${clickedButton}: ${updatedAmount.currency} ${updatedAmount.amount}`);
        setSchoolData({
            ...schoolData,
            [selectedSchool]: {
                ...schoolData[selectedSchool],
                budgetLimit: updatedAmount
            }
        });
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
        setEditableAmounts(schoolData[school]);
    };

    const renderEditableCard = (title) => {
        const amountData = editableAmounts[title] || { currency: '', amount: '' };
        let displayTitle = title;
        if (title === 'monthlyBudget') displayTitle = 'Monthly Budget';
        else if (title === 'budgetLimit') displayTitle = 'Budget Limit';
        else if (title === 'totalBalance') displayTitle = 'Total Balance';
    
        return (
            <Paper
                sx={{
                    position: 'relative',
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 160,
                    textAlign: 'left',
                    paddingLeft: (displayTitle === 'Monthly Budget' || displayTitle === 'Budget Limit' || displayTitle === 'Total Balance') ? '30px' : '0',
                }}
            >
                {displayTitle}
                <p style={{ fontSize: '2.0rem', fontWeight: 'bold' }}>{amountData.currency} {amountData.amount}</p>
                {displayTitle === 'Budget Limit' && (
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
                        <h2 id="modal-modal-title" style={{ fontSize: '30px', marginBottom: '20px' }}>Edit {displayTitle}</h2>
                        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                            <TextField
                                type="text"
                                value={amountData.amount}
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
    };
    
    const renderSummaryCard = () => {
        const monthlyBudgetData = editableAmounts['Monthly Budget'] || { currency: '', amount: '' };
        const budgetLimitData = editableAmounts['Budget Limit'] || { currency: '', amount: '' };
        const totalBalanceData = editableAmounts['Total Balance'] || { currency: '', amount: '' };
    
        return (
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
                <p style={{ paddingLeft: '20px', paddingBottom: '5px', fontSize: '12px', marginTop: '0' }}>{selectedMonthYear}</p>
                <p style={{ paddingLeft: '20px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '0' }}>Total Monthly Budget: {monthlyBudgetData.currency} {monthlyBudgetData.amount}</p>
                <p style={{ paddingLeft: '20px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '0' }}>Total Monthly Budget Limit: {budgetLimitData.currency} {budgetLimitData.amount}</p>
                <p style={{ paddingLeft: '20px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '0' }}>Total Monthly Balance: {totalBalanceData.currency} {totalBalanceData.amount}</p>
            </Paper>
        );
    };

    return (
        <Container className="test" maxWidth="lg">
            <Box sx={{ position: 'relative' }}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Paper
                            sx={[
                                styles.header, {
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between', 
                                }
                            ]}
                            elevation={0}
                            variant='outlined'
                        >
                            <Box style={styles.header.buttons}>
                                <DateFilter onApply={handleDateFilterApply} />
                            </Box>
                            <Box style={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                                <Select
                                    id="school-filter"
                                    value={selectedSchool}
                                    onChange={(event) => handleSelectSchool(event.target.value)}
                                    sx={{
                                        fontWeight: '900', 
                                        height: '40px',    
                                        minWidth: '120px', 
                                    }}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        School
                                    </MenuItem>
                                    {Object.keys(schoolData).map((school) => (
                                        <MenuItem key={school} value={school}>{school}</MenuItem>
                                    ))}
                                </Select>
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
                                {selectedMonthYear}
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
                                {renderEditableCard('monthlyBudget')}
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} sx={{ padding: '5px' }}>
                                {renderEditableCard('budgetLimit')}
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} sx={{ padding: '5px' }}>
                                {renderEditableCard('totalBalance')}
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
                                    {selectedSchool && schoolData[selectedSchool] ? (
                                        <ApexChart data={schoolData[selectedSchool]} />
                                    ) : (
                                        <Typography variant="body1">No data available for the selected school.</Typography>
                                    )}
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

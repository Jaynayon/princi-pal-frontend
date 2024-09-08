import React, { useState, useEffect, useCallback } from 'react';
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
import { FilterDate } from '../Components/Filters/FilterDate';
import Select from '@mui/material/Select';
import { Box, Button, MenuItem } from '@mui/material';
import { useNavigationContext } from '../Context/NavigationProvider';
import { useSchoolContext } from '../Context/SchoolProvider';
import { transformSchoolText } from '../Components/Navigation/Navigation';

//Apex Chart
const ApexChart = ({ uacsData = [], budgetLimit }) => {
    const [selectedCategory, setSelectedCategory] = useState(uacsData[0]?.code || '');

    const generateSeries = (expenses) => [
        {
            name: "Actual Expenses",
            data: expenses
        }
    ];

    const generateOptions = (budget, maxExpense) => ({
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
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5
            },
        },
        xaxis: {
            categories: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5'],
        },
        yaxis: {
            title: {
                text: 'Amount (PHP)'
            },
            max: Math.max(budget, maxExpense), // Ensure Y-axis is high enough to show the budget
        },
        annotations: {
            yaxis: [
                {
                    y: budget,
                    borderColor: '#FF0000',
                    label: {
                        borderColor: '#FF0000',
                        style: {
                            color: '#fff',
                            background: '#FF0000'
                        },
                        text: 'Budget Limit'
                    }
                }
            ]
        }
    });

    // Get the selected UACS data based on the selected category
    const selectedUacs = uacsData.find(uacs => uacs.code === selectedCategory);

    // Handle the case where selectedUacs is undefined
    if (!selectedUacs) {
        return <Typography variant="body1"></Typography>;
    }

    // Check if the selected category is "Total"
    const budgetToUse = selectedCategory === '19901020000' ? budgetLimit : selectedUacs.budget;
    const maxExpense = Math.max(...selectedUacs.expenses);

    return (
        <div>
            {uacsData.length === 0 ? (
                <Typography variant="body1">No data available.</Typography>
            ) : (
                <div style={{ position: 'relative', marginBottom: '40px' }}>
                    {/* Render the line chart based on selected category */}
                    <div>
                        <ReactApexChart
                            options={generateOptions(budgetToUse, maxExpense)}
                            series={generateSeries(selectedUacs.expenses)}
                            type="line"
                            height={350}
                        />
                        {/* Container for x-axis labels and dropdown */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <div style={{ marginLeft: '10px' }}>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    style={{
                                        width: '100px', // Set the width to make it smaller
                                        padding: '5px'
                                    }}
                                >
                                    {uacsData.map((uacs) => (
                                        <option key={uacs.code} value={uacs.code}>
                                            {uacs.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Sample data
const sampleUacsData = [
    {
        code: '5020502001',
        name: 'Communication Expenses',
        budget: 10000, //jev property: documentId, jev.budget
        expenses: [5000, 0, 18000, 20000, 50000]
    },
    {
        code: '5020402000',
        name: 'Electricity Expenses',
        budget: 50000,
        expenses: [1000, 5000, 6000, 47000, 10000]
    },
    {
        code: '5020503000',
        name: 'Internet Subscription Expenses',
        budget: 10000,
        expenses: [0, 5000, 10000, 15000, 20000]
    },
    {
        code: '5029904000',
        name: 'Transpo/Delivery Expenses',
        budget: 10000,
        expenses: [0, 5000, 10000, 15000, 20000]
    },
    {
        code: '5020201000',
        name: 'Training Expenses',
        budget: 10000,
        expenses: [0, 5000, 10000, 15000, 20000]
    },
    {
        code: '5020399000',
        name: 'Other Supplies & Materials Expenses',
        budget: 10000,
        expenses: [0, 5000, 10000, 15000, 20000]
    },
    {
        code: '1990101000',
        name: 'Advances to Operating Expenses',
        budget: 10000,
        expenses: [0, 5000, 10000, 15000, 20000]
    },
    {
        code: '19901020000',
        name: 'Total',
        budget: 500000,
        expenses: [0, 5000, 7000, 26000, 150000]
    }
];


function DashboardPage(props) {
    const { currentUser } = useNavigationContext();
    const [selectedSchool, setSelectedSchool] = useState('');
    const [clickedButton, setClickedButton] = useState('');
    const [editableAmounts, setEditableAmounts] = useState({});
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [applyButtonClicked, setApplyButtonClicked] = useState(false);
    const [schoolMenuAnchor, setSchoolMenuAnchor] = useState(null);
    const [schools, setSchools] = useState([]);
    const [loadingSchools, setLoadingSchools] = useState(false);
    const [schoolBudget, setSchoolBudget] = useState(null);
    const {
        currentDocument,
        currentSchool,
        year,
        month,
        setCurrentDocument,
        fetchDocumentBySchoolId
    } = useSchoolContext();

    // This function only runs when dependencies: currentSchool & currentUser are changed
    const initializeSelectedSchool = useCallback(() => {
        if (currentUser && currentUser.schools && currentUser.schools.length > 0) {
            setSelectedSchool(currentSchool?.id || currentUser.schools[0].id); // Ensure a valid value
        }
    }, [currentSchool, currentUser]);

    useEffect(() => {
        initializeSelectedSchool();
    }, [month, year, initializeSelectedSchool]);

    // Function that calls a document by their school id, year, and month
    useEffect(() => {
        if (selectedSchool !== '') {
            fetchDocumentBySchoolId(selectedSchool);
        }
    }, [selectedSchool, fetchDocumentBySchoolId]);

    const handleSchoolSelect = async (schoolId) => {
        setSelectedSchool(schoolId);
        console.log('Selected school:', schoolId);
    };

    const updateDocumentById = async (docId, value) => {
        try {
            const response = await fetch(`http://localhost:4000/documents/${docId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ budgetLimit: value })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Budget limit updated successfully:', data);
                return true;
            } else {
                console.error('Failed to update budget limit:', data);
                return false;
            }
        } catch (error) {
            console.error('Error updating budget limit:', error);
            return false;
        }
    };

    const getCurrentMonthYear = () => {
        const currentDate = new Date();
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
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
            setError('Please enter a valid number between 0 and 999,999 with up to 2 decimal places.');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedAmount = editableAmounts[clickedButton];
        console.log('Document ID:', currentDocument.id);

        try {
            const isUpdated = await updateDocumentById(currentDocument.id, updatedAmount.amount);

            if (isUpdated) {
                console.log('Budget limit saved successfully');
                setCurrentDocument({
                    ...currentDocument,
                    budgetLimit: parseFloat(updatedAmount.amount)
                });
                setEditableAmounts({
                    ...editableAmounts,
                    [clickedButton]: { ...editableAmounts[clickedButton], amount: '' }
                });
                setError('');
                setOpen(false);
            } else {
                console.error('Failed to save budget limit');
                setError('Failed to save budget limit. Please try again later.');
            }
        } catch (error) {
            console.error('Error saving budget limit:', error);
            setError('Failed to save budget limit. Please try again later.');
        }
    };

    const renderEditableCard = (title) => {
        const amountData = editableAmounts[title] || { currency: '', amount: '' };
        let displayTitle = title;
        if (title === 'monthlyBudget') displayTitle = 'Monthly Budget';
        else if (title === 'budgetLimit') displayTitle = 'Budget Limit';
        else if (title === 'totalBalance') displayTitle = 'Total Balance';

        if (!currentDocument) {
            return null;
        }

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
                {displayTitle === 'Monthly Budget' && (
                    <p style={{ fontSize: '2.0rem', fontWeight: 'bold' }}>Php {currentDocument.budget ? parseFloat(currentDocument.budget).toFixed(2) : '0.00'}</p>

                )}
                {displayTitle === 'Budget Limit' && (
                    <p style={{ fontSize: '2.0rem', fontWeight: 'bold' }}>Php {currentDocument.budgetLimit ? parseFloat(currentDocument.budgetLimit).toFixed(2) : '0.00'}</p>
                )}
                {displayTitle === 'Budget Limit' && (
                    <Button onClick={() => handleOpen(title)} className={clickedButton === title ? 'clicked' : ''} style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', padding: 0 }}>
                        <EditIcon sx={{ width: '30px', height: '30px' }} />
                    </Button>
                )}
                {displayTitle === 'Total Balance' && (
                    <p style={{ fontSize: '2.0rem', fontWeight: 'bold' }}>Php {((currentDocument.cashAdvance || 0) - (currentDocument.budget || 0)).toFixed(2)}</p>
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
        const budgetLimitData = editableAmounts['Budget Limit'] || { currency: '', amount: '' };

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
                <p style={{ paddingLeft: '20px', paddingBottom: '5px', fontSize: '12px', marginTop: '0' }}>{`${month} ${year}`}</p>
                <p style={{ paddingLeft: '20px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '0' }}>Total Monthly Budget : Php {currentDocument?.budget ? parseFloat(currentDocument.budget).toFixed(2) : '0.00'}</p>
                <p style={{ paddingLeft: '20px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '0' }}>Total Budget Limit: Php {currentDocument?.budgetLimit ? parseFloat(currentDocument.budgetLimit).toFixed(2) : '0.00'}</p>
                <p style={{ paddingLeft: '20px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '0' }}>Total Balance: Php {((currentDocument?.cashAdvance || 0) - (currentDocument?.budget || 0)).toFixed(2)}</p>
            </Paper>
        );
    };

    if (!currentUser) {
        return null;
    }

    return (
        /*User has no school/s*/
        !currentUser.schools || currentUser.schools.length === 0 ?
            <Container maxWidth="lg">
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h5" gutterBottom>
                            Currently, you are not assigned to a school.
                        </Typography>
                        <Typography variant="body1">
                            Once assigned, available data will be displayed here.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
            :
            /*User has school/s*/
            <Container className="test" maxWidth="lg">
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
                            <FilterDate />
                            <Box style={{ paddingRight: '10px' }}>
                                <Select
                                    value={selectedSchool}
                                    onChange={(event) => handleSchoolSelect(event.target.value)}
                                    displayEmpty
                                    inputProps={{ 'aria-label': 'Select School' }}
                                    style={{ width: '100%', height: '40px' }}
                                >
                                    {loadingSchools ? (
                                        <MenuItem disabled>Loading...</MenuItem>
                                    ) : (
                                        currentUser.schools.map((school) => (
                                            <MenuItem key={school.id} value={school.id}>
                                                {transformSchoolText(school.name)}
                                            </MenuItem>
                                        ))
                                    )}
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
                                {`${month} ${year}`}
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
                                    <ApexChart uacsData={sampleUacsData} budgetLimit={currentDocument?.budgetLimit} />
                                    <ApexChart totalBudget={schoolBudget} />
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} sx={{ padding: '5px' }}>
                                {renderSummaryCard()}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
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

export default DashboardPage;
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

const calculateWeeklyExpenses = (expensesData) => {
    const weeklyExpenses = {};
    const dates = expensesData.map(({ date }) => new Date(date));
    const earliestDate = new Date(Math.min(...dates));
    const latestDate = new Date(Math.max(...dates));

    const getWeekDifference = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const timeDiff = end - start;
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        const maxWeeks = Math.ceil(daysDiff / 7) <= 12 ? Math.ceil(daysDiff / 7) : 12;
        return maxWeeks; 
    };

    const totalWeeks = getWeekDifference(earliestDate, latestDate) + 1; 

    const getStartOfWeek = (weekIndex, startDate) => {
        const start = new Date(startDate);
        start.setDate(start.getDate() + weekIndex * 7);
        return start;
    };

   
    const getWeekIndex = (date) => {
        const startOfWeek = new Date(earliestDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); 
        const timeDiff = date - startOfWeek;
        const daysDiff = timeDiff / (1000 * 60 * 60 * 24); 
        return Math.floor(daysDiff / 7); 
    };


    expensesData.forEach(({ objectCode }) => {
        if (!weeklyExpenses[objectCode]) {
            weeklyExpenses[objectCode] = new Array(totalWeeks).fill(0);
        }
    });

 
    expensesData.forEach(({ date, objectCode, amount }) => {
        const expenseDate = new Date(date);
        const weekIndex = getWeekIndex(expenseDate);

        if (weekIndex >= 0 && weekIndex < totalWeeks) {
            weeklyExpenses[objectCode][weekIndex] += amount;
        }

   
        //console.log(`Date: ${date}, Object Code: ${objectCode}, Amount: ${amount}, Week Index: ${weekIndex}`);
        //console.log(`Updated Weekly Expenses: ${JSON.stringify(weeklyExpenses)}`);
    });

    //console.log('Final Weekly Expenses:', JSON.stringify(weeklyExpenses));
    return weeklyExpenses;
};


//Apex Chart
// Apex Chart
const ApexChart = ({ uacsData = [], budgetLimit }) => {
    const [selectedCategory, setSelectedCategory] = useState('5020502001');
    const [chartType, setChartType] = useState('line');

    useEffect(() => {
        if (selectedCategory === '19901020000') {
            setChartType('bar');
        } else {
            setChartType('line');
        }
    }, [selectedCategory]);

    const generateSeries = () => {
        if (!uacsData || uacsData.length === 0) {
            return [];
        }
        if (selectedCategory === '19901020000') {
            const totalExpenses = uacsData.slice(0, -1).map(uacs => {
                return uacs?.expenses?.reduce((acc, expense) => acc + expense, 0) || 0;
            });
            return [
                {
                    name: "Total Expenses",
                    data: totalExpenses
                }
            ];
        } else {
            const selectedUacs = uacsData.find(uacs => uacs.code === selectedCategory);
            if (selectedUacs && selectedUacs.expenses) {
                return [
                    {
                        name: "Actual Expenses",
                        data: selectedUacs.expenses
                    }
                ];
            } else {
                return [];
            }
        }
    };

    const generateOptions = (budget, maxExpense, chartType, categories) => {
        const annotations = selectedCategory === '19901020000' ? [
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
        ] : []; // Remove the red line for non-total categories

        return {
            chart: {
                height: 350,
                type: chartType,
                zoom: {
                    enabled: false
                }
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '60%',
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                show: true,
                width: 2,
                colors: ['#0000FF']
            },
            grid: {
                row: {
                    colors: ['#f3f3f3', 'transparent'],
                    opacity: 0.5
                }
            },
            xaxis: {
                categories: categories,
                labels: {
                    rotate: -45,
                    style: {
                        fontSize: '12px'
                    }
                }
            },
            yaxis: {
                title: {
                    text: 'Amount (PHP)'
                },
                max: Math.max(budget, maxExpense),
            },
            annotations: {
                yaxis: annotations // Conditionally add the red line for the total category
            }
        };
    };

    const selectedUacs = uacsData.find(uacs => uacs.code === selectedCategory);
    if (!selectedUacs && selectedCategory !== '19901020000') {
        return <Typography variant="body1"></Typography>;
    }

    const generateWeekLabels = (numberOfWeeks) => {
        return Array.from({ length: numberOfWeeks }, (_, i) => `Week ${i + 1}`);
    };

    let weekLength = uacsData.find(item => item.code === selectedCategory).expenses.length;
    const categories = selectedCategory === '19901020000'
        ? uacsData.slice(0, -1).map(uacs => uacs.name)
        : generateWeekLabels(weekLength >= 12 ? 12 : weekLength);

    const budgetToUse = selectedCategory === '19901020000' ? budgetLimit : selectedUacs.budget;
    const maxExpense = selectedCategory === '19901020000'
        ? Math.max(...uacsData.slice(0, -1).map(uacs => uacs.expenses.reduce((acc, expense) => acc + expense, 0)))
        : Math.max(...selectedUacs.expenses);

    const stackedSeries = uacsData.map(({ name, expenses }) => ({
        name,
        data: Array(12).fill(0).map((_, i) => {
            return expenses.reduce((acc, expense, idx) => {
                const monthIndex = idx % 12;
                if (monthIndex === i) {
                    acc += expense;
                }
                return acc;
            }, 0);
        })
    }));

    const stackedOptions = {
        chart: {
            type: 'bar',
            stacked: true,
            height: 350,
        },
        plotOptions: {
            bar: {
                horizontal: false,
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        yaxis: {
            title: {
                text: 'Expenses (PHP)',
            },
        },
        colors: ['#FF4560', '#008FFB', '#00E396', '#775DD0', '#FEB019', '#FF6F61', '#F1A7A1', '#F5E1D6']
    };

    const pieSeries = uacsData.map(({ expenses }) =>
        (expenses || []).reduce((acc, expense) => acc + expense, 0)
    );

    const pieOptions = {
        labels: uacsData.map(({ name }) => name || 'Unknown'),
        chart: {
            type: 'pie',
            height: 350,
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                }
            }
        }],
        legend: {
            show: false
        },
        colors: ['#FF4560', '#008FFB', '#00E396', '#775DD0', '#FEB019', '#FF6F61', '#F1A7A1', '#F5E1D6']
    };

return (
    <div>
        {uacsData.length === 0 ? (
            <Typography variant="body1">No data available.</Typography>
        ) : (
            <div style={{ position: 'relative', marginBottom: '40px' }}>
            <ReactApexChart
                options={generateOptions(budgetToUse, maxExpense, chartType, categories)}
                series={generateSeries()}
                type={chartType}
                height={350}
            />

            {/* Container for x-axis labels and dropdown */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: '20px' }}>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    style={{
                        width: '800px', // Increased width for a bigger dropdown
                        padding: '10px', // Increased padding for a larger click area
                        fontSize: '16px', // Increased font size for better readability
                        border: '1px solid #ccc', // Set border color
                        borderRadius: '4px', // Rounded corners
                        backgroundColor: '#f0f0f0', // Background color
                        color: '#333', // Font color
                        cursor: 'pointer', // Change cursor on hover
                    }}
                >
                    {uacsData.map((uacs) => (
                        <option key={uacs.code} value={uacs.code}>
                            {uacs.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Custom layout for the charts */}
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '40px' }}>
                {/* Container for stacked bar chart and pie chart */}
                <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                    {/* Stacked bar chart Paper */}
                    <Paper elevation={1} style={{ marginLeft: '370px', padding: '20px', height: '420px', width: '800px' }}>
                        <Typography variant="h6" align="center">Monthly UACS Expenses</Typography>
                        <ReactApexChart
                            options={stackedOptions}
                            series={stackedSeries}
                            type="bar"
                            height={350} // Adjusted height for the chart
                            style={{ width: '100%' }}
                        />
                    </Paper>

                    {/* Pie chart Paper, wider */}
                    <Paper elevation={1} style={{ padding: '20px', height: '420px', width: '310px', marginLeft: '10px' }}>
                        <Typography variant="h6" align="center">Expense Distribution</Typography>
                        <ReactApexChart
                            options={pieOptions}
                            series={pieSeries}
                            type="pie"
                            height={280}
                            style={{ width: '100%' }}
                        />
                    </Paper>
                </div>
            </div>
        </div>
    )}
</div>
);
};


function DashboardPage(props) {
    const { currentUser, currentSchool, setCurrentSchool, } = useNavigationContext();
    const { currentDocument, year, month, setCurrentDocument, jev, updateJev, lr, updateLr } = useSchoolContext();
    const [selectedSchool, setSelectedSchool] = useState('');
    const [clickedButton, setClickedButton] = useState('');
    const [editableAmounts, setEditableAmounts] = useState({});
    const [open, setOpen] = useState(false);
    const [error, setError] = useState('');
    const [loadingSchools] = useState(false);
    const [schoolBudget] = useState(null);

    const [uacsData, setUacsData] = useState([]);


    // This function only runs when dependencies: currentSchool & currentUser are changed

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Log the specific fields (date, objectCode, and amount) for each LR row
                if (lr && lr.length > 0) {
                    lr.forEach(row => {
                        //console.log(`Date: ${row.date}, UACS Object Code: ${row.objectCode}, Amount: ${row.amount}`);
                    });
                } else {
                    console.log('No LR data available');
                }
            } catch (error) {
                console.error('Error fetching document data:', error);
            }
        };
        fetchData();
    }, [lr]); 


    const initializeSelectedSchool = useCallback(() => {
        if (currentUser && currentUser.schools && currentUser.schools.length > 0) {
            if (currentSchool) {
                setSelectedSchool(currentSchool.id); 
            } else {
                setSelectedSchool(currentUser.schools[0].id); 
            }

        }
    }, [currentSchool, currentUser]);

    useEffect(() => {
        initializeSelectedSchool();
        updateJev();
        updateLr();
    }, [initializeSelectedSchool, updateJev, updateLr]);

    useEffect(() => {
        const sampleUacsData = [
            {
                code: '5020502001',
                name: 'Communication Expenses',
                budget: jev[0]?.budget,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5020402000',
                name: 'Electricity Expenses',
                budget: jev[1]?.budget,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5020503000',
                name: 'Internet Subscription Expenses',
                budget: jev[2]?.budget,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5029904000',
                name: 'Transpo/Delivery Expenses',
                budget: jev[3]?.budget,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5020201000',
                name: 'Training Expenses',
                budget: jev[4]?.budget,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5020399000',
                name: 'Other Supplies & Materials Expenses',
                budget: jev[5]?.budget,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '1990101000',
                name: 'Advances to Operating Expenses',
                budget: jev[6]?.budget,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '19901020000',
                name: 'Total',
                budget: 500000,
                expenses: [0, 0, 0, 0, 0]
            }
        ];

        const fetchData = async () => {
            try {
                if (lr && lr.length > 0) {
                    // Calculate weekly expenses from the LR data
                    const weeklyExpenses = calculateWeeklyExpenses(lr);

                    // Update uacsData with the calculated weekly expenses
                    const updatedUacsData = sampleUacsData.map(uacs => {
                        if (weeklyExpenses[uacs.code]) {
                            return {
                                ...uacs,
                                expenses: weeklyExpenses[uacs.code]
                            };
                        }
                        return uacs;
                    });

                    setUacsData(updatedUacsData);
                }
            } catch (error) {
                console.error('Error processing data:', error);
            }
        };

        fetchData();
    }, [lr, jev]);

    const handleSchoolSelect = async (schoolId) => {
        setSelectedSchool(schoolId);
        setCurrentSchool(currentUser.schools.find(s => s.id === schoolId));
        console.log('Selected school:', schoolId);
    };

    const updateDocumentById = async (docId, value) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_DOC}/${docId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
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
    

    console.log(jev)


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
    
        // Get the monthly budget from the current document
        const monthlyBudget = currentDocument?.budget ? parseFloat(currentDocument.budget) : 0;
    
        // Validate if the input amount exceeds the monthly budget
        let finalBudgetLimit = parseFloat(updatedAmount.amount);
        if (finalBudgetLimit > monthlyBudget) {
            finalBudgetLimit = monthlyBudget;
            setError(`The budget limit has been adjusted to match the monthly budget: Php ${monthlyBudget.toFixed(2)}`);
        }
    
        try {
            const isUpdated = await updateDocumentById(currentDocument.id, finalBudgetLimit);
    
            if (isUpdated) {
                console.log('Budget limit saved successfully');
                setCurrentDocument({
                    ...currentDocument,
                    budgetLimit: finalBudgetLimit // Save the adjusted value
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
        const totalBalance = (currentDocument.cashAdvance || 0) - (currentDocument.budget || 0);
        const totalBalanceColor = totalBalance < 0 ? 'red' : 'black'; 
    
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
                     <p style={{ fontSize: '2.0rem', fontWeight: 'bold', color: totalBalanceColor }}> {}
                     Php {totalBalance.toFixed(2)}
                 </p>
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
        const totalBalance = (currentDocument?.cashAdvance || 0) - (currentDocument?.budget || 0);
        const totalBalanceColor = totalBalance < 0 ? 'red' : 'black'; 
    
        return (
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 380,
                    textAlign: 'left',
                    marginBottom: '15px', 
                }}
            >
                <p style={{ paddingLeft: '20px', fontWeight: 'bold', marginBottom: '5px', marginTop: '5px', fontSize: '20px' }}>Summary</p>
                <p style={{ paddingLeft: '20px', paddingBottom: '5px', fontSize: '12px', marginTop: '0' }}>{`${month} ${year}`}</p>
                <p style={{ paddingLeft: '20px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '0' }}>Total Monthly Budget: Php {currentDocument?.budget ? parseFloat(currentDocument.budget).toFixed(2) : '0.00'}</p>
                <p style={{ paddingLeft: '20px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '0' }}>Total Budget Limit: Php {currentDocument?.budgetLimit ? parseFloat(currentDocument.budgetLimit).toFixed(2) : '0.00'}</p>
                <p style={{ paddingLeft: '20px', borderBottom: '1px solid #ccc', paddingBottom: '5px', marginTop: '0', color: totalBalanceColor }}>
                    Total Balance: Php {totalBalance.toFixed(2)}
                </p>
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
                                    <ApexChart uacsData={uacsData} budgetLimit={currentDocument?.budgetLimit} />
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
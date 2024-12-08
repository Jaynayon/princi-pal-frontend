import React, { useState, useEffect, useCallback, memo } from 'react';
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
import FilterDate from '../Components/Filters/FilterDate';
import Select from '@mui/material/Select';
import { Box, Button, MenuItem, Tooltip } from '@mui/material';
import { useNavigationContext } from '../Context/NavigationProvider';
import { useSchoolContext } from '../Context/SchoolProvider';
import { transformSchoolText } from '../Components/Navigation/Navigation';
import axios from 'axios';

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
    });

    return weeklyExpenses;
};

const ApexAnnualReport = memo(({ currentSchool, currentDocument, month, year, type }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchStackedData = async () => {
            try {
                if (currentSchool) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL_LR}/jev/school/${currentSchool.id}/year/${year}/stackedbar`, {
                        headers: {
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                        }
                    });
                    setData(response.data || []);
                }
            } catch (error) {
                console.error('Error processing data:', error);
                setData([]); // Fallback in-case no data is received
            }
        }

        fetchStackedData();
    }, [currentSchool, year]);

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

    const pieSeries = data.map(({ data }) =>
        (data || []).reduce((acc, expense) => acc + expense, 0)
    );

    const pieOptions = {
        labels: data.map(({ name }) => name || 'Unknown'),
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

    if (type === "Stacked Bar" && data.length > 0) {
        return (
            <React.Fragment>
                {/* Stacked bar chart Paper */}
                <Paper elevation={1} style={{ padding: '20px', height: 520, width: '100%' }}>
                    <Tooltip title={"Annual Unified Accounts Code Structure Expenditure by Month"} placement='top'>
                        <Typography variant="h6" align="center">Annual UACS Expenditure by Month</Typography>
                    </Tooltip>
                    <ReactApexChart
                        options={stackedOptions}
                        series={data}
                        type="bar"
                        height={430} // Adjusted height for the chart
                        style={{ width: '100%' }}
                    />
                </Paper>
            </React.Fragment>
        );
    }

    if (type === "Pie Chart" && data.length > 0) {
        const totalBalance = Number(currentDocument.annualBudget - currentDocument.annualExpense);
        const totalBalanceColor = totalBalance < 0 ? 'red' : 'black';

        const formatAmount = (value) => new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);

        const SummaryDetails = ({ description, amount, type }) => {
            return (
                <Typography align="left" sx={{
                    borderBottom: '1px solid #ccc',
                    paddingBottom: '5px',
                    paddingTop: '5px',
                    marginTop: '0',
                    width: "100%",
                    color: type === 'balance' && totalBalanceColor
                }}>
                    {description}: <strong>Php {formatAmount(amount)}</strong>
                </Typography>
            );
        }

        return (
            <React.Fragment>
                {/* Pie chart Paper, wider */}
                <Paper elevation={1} style={{ padding: '20px', height: 520, width: '100%' }}>
                    <Tooltip title={"Total Annual Unified Accounts Code Structure Expenditure"} placement='top'>
                        <Typography variant="h6" align="center">Total Annual UACS Expenditure</Typography>
                    </Tooltip>
                    <ReactApexChart
                        options={pieOptions}
                        series={pieSeries}
                        type="pie"
                        height={300}
                        style={{ width: '100%' }}
                    />
                    <Box sx={{ display: 'flex', flexDirection: "column", alignItems: "flex-start", px: 2, mt: 1, maxHeight: 210, overflowY: "auto", }}>
                        <p style={{ fontWeight: 'bold', marginBottom: '5px', marginTop: '5px', fontSize: '20px' }}>Summary</p>
                        <p style={{ paddingBottom: '5px', fontSize: '12px', marginTop: '0' }}>{`January to December ${year}`}</p>
                        <SummaryDetails
                            description="Annual Budget"
                            amount={currentDocument?.annualBudget ? currentDocument.annualBudget : '0.00'}
                        />
                        <SummaryDetails
                            description="Total Annual Expenses"
                            amount={currentDocument?.annualExpense ? currentDocument.annualExpense : '0.00'}
                        />
                        <SummaryDetails
                            type={"balance"}
                            description="Total Annual Balance"
                            amount={totalBalance.toFixed(2)}
                        />
                    </Box>

                </Paper>
            </React.Fragment>
        );
    }
});

// Apex Chart
const ApexChart = ({ uacsData = [], budgetLimit, type }) => {
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
                    columnWidth: '50%'
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
                },
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

    return (
        uacsData.length === 0 ? (
            <Typography variant="body1">No data available.</Typography>
        ) : (
            <div>
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
                            width: '100%', // Increased width for a bigger dropdown
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
            </div>
        )
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

    const formatAmount = (value) => new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);

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
                budget: jev[0]?.budget || 0,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5020402000',
                name: 'Electricity Expenses',
                budget: jev[1]?.budget || 0,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5020503000',
                name: 'Internet Subscription Expenses',
                budget: jev[2]?.budget || 0,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5029904000',
                name: 'Transpo/Delivery Expenses',
                budget: jev[3]?.budget || 0,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5020201000',
                name: 'Training Expenses',
                budget: jev[4]?.budget || 0,
                expenses: [0, 0, 0, 0, 0]
            },
            {
                code: '5020399000',
                name: 'Other Supplies & Materials Expenses',
                budget: jev[5]?.budget || 0,
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
                } else {
                    setUacsData(sampleUacsData);
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
        const monthlyBudget = currentDocument?.cashAdvance ? parseFloat(currentDocument.cashAdvance) : 0;

        // Validate if the input amount exceeds the monthly budget
        let finalBudgetLimit = parseFloat(updatedAmount.amount);
        if (finalBudgetLimit > monthlyBudget) {
            finalBudgetLimit = monthlyBudget;
            setError(`The budget limit has been adjusted to match the monthly budget: Php ${monthlyBudget.toFixed(2)}`);
        }

        try {
            if (finalBudgetLimit !== currentDocument?.budgetLimit) {
                const isUpdated = await updateDocumentById(currentDocument.id, finalBudgetLimit);

                if (isUpdated) {
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
            } else {
                setOpen(false); // Close the modal if the value is the same
            }
        } catch (error) {
            console.error('Error saving budget limit:', error);
            setError('Failed to save budget limit. Please try again later.');
        }
    };

    const renderEditableCard = (title) => {
        const amountData = editableAmounts[title] || { currency: '', amount: '' };
        let displayTitle = title;
        if (title === 'totalExpenses') displayTitle = 'Total Expenses';
        else if (title === 'budgetLimit') displayTitle = 'Budget Limit';
        else if (title === 'totalBalance') displayTitle = 'Total Balance';
        else if (title === 'annualBalance') displayTitle = 'Annual Balance';

        const annualBalance = Number(currentDocument.annualBudget - currentDocument.annualExpense);
        const totalBalance = (currentDocument.cashAdvance || 0) - (currentDocument.budget || 0);
        const totalBalanceColor = totalBalance < 0 ? 'red' : 'black';

        const DisplayAnalytics = ({ amount, type }) => {
            return (
                <p style={{ fontSize: 'clamp(1.5rem, 2vw, 1.9rem)', fontWeight: 'bold', color: type === "balance" && totalBalanceColor }}>
                    Php {formatAmount(amount)}
                </p>
            );
        }

        const getTitleColor = (title, totalBalance) => {
            switch (title) {
                case 'Total Expenses':
                    return "orange";
                case 'Budget Limit':
                    return "#20A0F0";
                case 'Annual Balance':
                    return totalBalance.toFixed(2) >= 0 ? "#803df5" : "red";
                default:
                    return totalBalance.toFixed(2) >= 0 ? "#32b14a" : "red";
            }
        }

        const getTooltipContent = (title) => {
            switch (title) {
                case 'Total Expenses':
                    return `Total LR & RCD expenses for the month of ${month}.`;
                case 'Budget Limit':
                    return `Threshold to notify users when Total Expenses for ${month} exceed this limit.`;
                case 'Annual Balance':
                    return "Remaining balance for the entire year after expenses.";
                default:
                    return "Remaining balance from your monthly cash advance after expenses.";
            }
        }

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
                    borderLeft: 5,
                    borderLeftColor: getTitleColor(displayTitle, totalBalance),
                    paddingLeft: '30px',
                }}
            >
                <Tooltip title={getTooltipContent(displayTitle)} placement='top'>
                    <span style={{ fontSize: 17 }}>{displayTitle}</span>
                </Tooltip>
                {displayTitle === 'Total Expenses' && (
                    <DisplayAnalytics amount={currentDocument.budget ? currentDocument.budget : '0.00'} />
                )}
                {displayTitle === 'Budget Limit' && (
                    <React.Fragment>
                        <DisplayAnalytics amount={currentDocument.budgetLimit ? currentDocument.budgetLimit : '0.00'} />
                        <Tooltip title={"Set Budget Limit"}>
                            <Button
                                sx={{ display: currentUser.position !== "Principal" && "none" }}
                                onClick={() => handleOpen(title)}
                                className={clickedButton === title ? 'clicked' : ''}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: 'none',
                                    border: 'none',
                                    padding: 0
                                }}
                            >
                                <EditIcon sx={{ color: "#20A0F0", width: '30px', height: '30px' }} />
                            </Button>
                        </Tooltip>
                    </React.Fragment>
                )}
                {displayTitle === 'Total Balance' && (
                    <DisplayAnalytics amount={totalBalance.toFixed(2)} type="balance" />
                )}
                {displayTitle === 'Annual Balance' && (
                    <DisplayAnalytics amount={annualBalance.toFixed(2)} type="balance" />
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
                        <h2 id="modal-modal-title" style={{ fontSize: '30px', marginBottom: '20px' }}>Set {displayTitle}</h2>
                        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                            <TextField
                                type="text"
                                value={amountData.amount}
                                onChange={handleChange}
                                label="Input New Amount"
                            />
                        </form>
                        <div style={{ marginBottom: '20px' }}>
                            <Button onClick={handleSubmit} style={{ backgroundColor: '#20A0F0', borderRadius: '10px', color: '#fff', width: '160px', padding: '10px 0' }}>Save</Button>
                        </div>
                    </Box>
                </Modal>
            </Paper>
        );
    };

    const renderSummaryCard = () => {
        const totalBalance = (currentDocument?.cashAdvance || 0) - (currentDocument?.budget || 0);
        const totalBalanceColor = totalBalance < 0 ? 'red' : 'black';

        const SummaryDetails = ({ description, amount, type }) => {
            return (
                <p style={{
                    paddingLeft: '20px',
                    borderBottom: '1px solid #ccc',
                    paddingBottom: '5px',
                    marginTop: '0',
                    color: type === 'balance' && totalBalanceColor
                }}>
                    {description}: <strong>Php {formatAmount(amount)}</strong>
                </p>
            );
        }

        return (
            <Paper
                sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: "100%",
                    textAlign: 'left',
                    marginBottom: '15px',
                }}
            >
                <p style={{ paddingLeft: '20px', fontWeight: 'bold', marginBottom: '5px', marginTop: '5px', fontSize: '20px' }}>Summary</p>
                <p style={{ paddingLeft: '20px', paddingBottom: '5px', fontSize: '12px', marginTop: '0' }}>{`${month} ${year}`}</p>
                <SummaryDetails
                    description="Total Monthly Budget"
                    amount={currentDocument?.budget ? currentDocument.budget : '0.00'}
                />
                <SummaryDetails
                    description="Total Budget Limit"
                    amount={currentDocument?.budgetLimit ? currentDocument.budgetLimit : '0.00'}
                />
                <SummaryDetails
                    type="balance"
                    description="Total Balance"
                    amount={totalBalance.toFixed(2)}
                />
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
                                <Tooltip title={"School Filter"} placement='left'>
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
                                </Tooltip>
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
                            <Grid item xs={12} md={6} lg={3} sx={{ padding: '5px' }}>
                                {renderEditableCard('totalExpenses')}
                            </Grid>
                            <Grid item xs={12} md={6} lg={3} sx={{ padding: '5px' }}>
                                {renderEditableCard('budgetLimit')}
                            </Grid>
                            <Grid item xs={12} md={6} lg={3} sx={{ padding: '5px' }}>
                                {renderEditableCard('totalBalance')}
                            </Grid>
                            <Grid item xs={12} md={6} lg={3} sx={{ padding: '5px' }}>
                                {renderEditableCard('annualBalance')}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <Grid container >
                            <Grid item xs={12} md={8} lg={8} sx={{ padding: '5px' }}>
                                <ApexAnnualReport type="Stacked Bar" currentSchool={currentSchool} year={year} />
                            </Grid>
                            <Grid item xs={12} md={4} lg={4} sx={{ padding: '5px' }}>
                                <ApexAnnualReport type="Pie Chart" currentSchool={currentSchool} currentDocument={currentDocument} month={month} year={year} />
                            </Grid>
                            <Grid item xs={12} md={8} lg={8} sx={{ padding: '5px' }}>
                                <Paper
                                    sx={{
                                        p: 2,
                                        display: 'flex',
                                        flexDirection: 'column'
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
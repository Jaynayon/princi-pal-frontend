import { Box, Tooltip, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

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
            <Box>
                <Tooltip title={"Total Monthly Unified Accounts Code Structure Expenditure"} placement='top'>
                    <Typography variant="h6" align="center">Total Monthly UACS Expenditure</Typography>
                </Tooltip>
                <ReactApexChart
                    options={generateOptions(budgetToUse, maxExpense, chartType, categories)}
                    series={generateSeries()}
                    type={chartType}
                    height={350}
                    style={{ width: '100%' }}
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
            </Box>
        )
    );
};

export default ApexChart;
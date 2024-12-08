import { Box, Paper, Tooltip, Typography } from "@mui/material";
import axios from "axios";
import React, { memo, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import DashboardSummaryDetails from "../Summary/DashboardSummaryDetails";

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
        return (
            <React.Fragment>
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
                    <Box sx={{ height: 210, overflowY: "auto" }}>
                        <DashboardSummaryDetails
                            type={"Annual"}
                            currentDocument={currentDocument}
                            month={month}
                            year={year}
                        />
                    </Box>
                </Paper>
            </React.Fragment>
        );
    }
});

export default ApexAnnualReport;
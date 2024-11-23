import React, { useCallback, useEffect, useState } from 'react';
import {
    Paper,
    Box,
    Modal,
    Backdrop,
    Fade,
    Typography,
    CircularProgress,
    TableContainer,
    TableRow,
    TableCell,
    TableBody,
    TableHead,
    Table
} from '@mui/material';
import axios from 'axios';
import { transformSchoolText } from '../Navigation/Navigation';

const columns = [
    {
        id: 'date',
        label: 'Date',
        minWidth: 80,
        maxWidth: 100,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'orsBursNo',
        label: 'ORS/BURS No.',
        minWidth: 80,
        maxWidth: 80,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'payee',
        label: 'Payee',
        minWidth: 80,
        maxWidth: 80,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'particulars',
        label: 'Particulars',
        minWidth: 100,
        maxWidth: 100,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'objectCode',
        label: 'UACS',
        minWidth: 80,
        maxWidth: 80,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'natureOfPayment',
        label: 'Nature of Payment',
        minWidth: 90,
        maxWidth: 90,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'amount',
        label: 'Amount',
        minWidth: 80,
        maxWidth: 100,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
];

const SummaryModal = React.memo(({ open, handleClose, currentDocument, currentSchool, year, month }) => {
    const [loading, setLoading] = React.useState(false);
    const [summary, setSummary] = useState([]);

    const balance = Number(currentDocument.cashAdvance) - Number(currentDocument.budget)

    const formatNumberDisplay = (number, colId, rowId) => {
        //if (typeof number !== 'number') return ''; // Handle non-numeric values gracefully
        return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!open) return; // Only fetch if modal is open

            setLoading(true);
            try {
                if (currentDocument) {
                    const response = await axios.get(`${process.env.REACT_APP_API_URL_LR}/jev/documents/${currentDocument.id}/summary`, {
                        headers: {
                            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("LOCAL_STORAGE_TOKEN"))}`
                        }
                    });
                    setSummary(response.data);
                }
            } catch (error) {
                setSummary([]);
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [open, currentDocument]);

    const renderSummary = useCallback(() => {
        // Helper function to render LR items related to the specific JEV's uacsCode
        const renderLr = (relatedLrItems) => {
            // Return null if no relatedLrItems are found
            if (!relatedLrItems?.length) return null;

            // Common style for all TableCell elements
            const cellStyle = {
                fontSize: 11,
                align: 'left',
                padding: '8px 16px',
                lineHeight: '1.2',
                wordSpacing: '0.5px',
                letterSpacing: '0.5px',
            };

            const FormattedCell = ({ data, id }) => {
                const column = columns.find((col) => col.id === id);
                return (
                    <TableCell sx={[cellStyle, {
                        minWidth: column.minWidth,
                        maxWidth: column.maxWidth,
                    }]}>
                        <Typography variant="inherit" noWrap>
                            {data}
                        </Typography>
                    </TableCell>
                )
            }

            // Map over the related LR items and display them
            return relatedLrItems.map((lrItem) => (
                <TableRow key={`${lrItem.id}_child_row`}>
                    <FormattedCell id={"date"} data={lrItem.date} />
                    <FormattedCell id={"orsBursNo"} data={lrItem.orsBursNo} />
                    <FormattedCell id={"payee"} data={lrItem.payee} />
                    <FormattedCell id={"particulars"} data={lrItem.particulars} />
                    <FormattedCell id={"objectCode"} data={lrItem.objectCode} />
                    <FormattedCell id={"natureOfPayment"} data={lrItem.natureOfPayment} />
                    <FormattedCell id={"amount"} data={`₱${formatNumberDisplay(lrItem.amount)}`} />
                </TableRow>
            ));
        };

        if (!summary || summary.length === 0) {
            return <Typography>No data available.</Typography>;
        }

        return (
            <React.Fragment>
                {summary.map((item, jevIndex) => {
                    // Skip rendering if the uacsCode is "1990101000"
                    if (item.uacsCode === "1990101000") {
                        return null; // Skip this item
                    }

                    return (
                        <Box key={jevIndex}>
                            {/* Render JEV item */}
                            <Typography
                                sx={{ color: "#252733", fontWeight: 'bold' }}
                                variant='body1'
                                component="h1"
                                color="inherit"
                                noWrap>
                                {item.uacsName}{' '}
                                <i style={{ color: "grey" }}>({item.uacsCode})</i>
                            </Typography>

                            {/* Render related LR items */}
                            <TableContainer sx={{ maxHeight: 250 }}>
                                <Table>
                                    <TableHead sx={{ height: 20 }}>
                                        <TableRow key={`${item.id}_table_row`}>
                                            {columns.map((column) => (
                                                <TableCell
                                                    key={`${column.id}_${item.id}_table_cell`}
                                                    align={column.align}
                                                    style={{
                                                        zIndex: 1,
                                                        minWidth: column.minWidth,
                                                        maxWidth: column.maxWidth,
                                                        fontSize: 10,
                                                        padding: '8px 16px',
                                                        lineHeight: '1.2',
                                                        wordSpacing: '0.5px',
                                                        letterSpacing: '0.5px',
                                                    }}
                                                >
                                                    <Typography variant="inherit">
                                                        {column.label}
                                                    </Typography>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {renderLr(item.lrs)}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            <Box sx={{ display: "flex", mt: 2, justifyContent: "flex-end" }}>
                                <Typography
                                    sx={{ color: "#252733", fontWeight: 'bold', fontSize: 12 }}
                                    variant='body2'
                                    component="h1"
                                    color="inherit"
                                    noWrap>
                                    Total Amount: {`₱${formatNumberDisplay(item.amount)}`}
                                </Typography>
                            </Box>
                        </Box>
                    );
                })}
            </React.Fragment>
        );
    }, [summary]);

    return (
        <Box >
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="summary-modal-title"
                aria-describedby="summary-modal-description"
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
            >
                <Fade in={open}>
                    <Paper sx={[styles.paper, { paddingTop: 3 }]}>
                        <Box>
                            <Typography
                                sx={{ color: "#252733", mb: 1 }}
                                variant='h6'
                                component="h1"
                                color="inherit"
                                noWrap>
                                Summary{" "}
                                <strong style={{ color: "#20A0F0" }}>
                                    ({`${transformSchoolText(currentSchool?.name || "None")}, ${month} ${year}`})
                                </strong>
                            </Typography>
                            <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                                {loading
                                    ? <Box
                                        sx={{
                                            display: "flex",
                                            minHeight: 150,
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}
                                    >
                                        <CircularProgress />
                                    </Box>
                                    : renderSummary()
                                }
                            </Box>
                            <Box>
                                <Typography
                                    sx={{ color: "#252733", fontWeight: 'bold' }}
                                    variant='body1'
                                    component="h1"
                                    color="inherit"
                                    noWrap>
                                    Expense Overview
                                </Typography>
                                <Typography sx={{ fontSize: 13 }}>
                                    Monthly Budget:{" "}
                                    <strong
                                    // style={{
                                    //     color: "white",
                                    //     backgroundColor: 'orange',  // Soft green background
                                    //     padding: '1px 6px',
                                    //     borderRadius: '5px',
                                    // }}
                                    >
                                        {`₱${formatNumberDisplay(currentDocument.cashAdvance)}`}
                                    </strong>{" "}
                                    <i style={{ color: "grey" }}>(Advances to Operating Expenses)</i>
                                </Typography>
                                <Typography sx={{ fontSize: 13 }}>
                                    Total Expenses:{" "}
                                    <strong
                                    // style={{
                                    //     color: "white",
                                    //     backgroundColor: 'green',  // Soft green background
                                    //     padding: '1px 6px',
                                    //     borderRadius: '5px',
                                    // }}
                                    >
                                        {`₱${formatNumberDisplay(currentDocument.budget)}`}
                                    </strong>
                                </Typography>
                                <Typography sx={{ fontSize: 13, fontWeight: 'bold' }}>
                                    Balance:{" "}
                                    <span
                                        style={{
                                            color: "white",
                                            backgroundColor: balance < 0 ? 'red' : 'green',
                                            padding: '1px 6px',
                                            borderRadius: '5px',
                                        }}>
                                        {`₱${formatNumberDisplay(balance)}`}
                                    </span>
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Fade>
            </Modal>
        </Box>
    );
});

export default SummaryModal;

const styles = {
    tab: {
        minHeight: '10px',
        '&.Mui-selected': {
            color: 'black', // Color of selected tab
            fontWeight: 'bold', // Font weight of selected tab
        },
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: 24,
        p: 4.5,
        minWidth: 400,
        maxWidth: 800,
        width: "80%",
        overflowX: "auto",
        maxHeight: 600,
        borderRadius: '15px'
    }
}

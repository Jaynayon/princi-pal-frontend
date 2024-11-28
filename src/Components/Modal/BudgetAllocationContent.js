import React from 'react';
import {
    Box,
    TextField,
    Typography,
    Button,
    InputAdornment,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import { useSchoolContext } from '../../Context/SchoolProvider';
// import { useNavigationContext } from '../../Context/NavigationProvider';

import BudgetConfirmModal from './BudgetConfirmModal';

const columns = [
    {
        id: 'status',
        label: 'Status',
        minWidth: 60,
        maxWidth: 60,
        align: "center",
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'month',
        label: 'Month',
        minWidth: 60,
        maxWidth: 60,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'cashAdvance',
        label: 'Cash Advance',
        minWidth: 60,
        maxWidth: 60,
        fontWeight: "bold",
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    }
];

const emptyDocument = {
    id: 0,
    budget: 0,
    cashAdvance: 0,
    claimant: "",
    sds: "",
    headAccounting: ""
}

export default function BudgetAllocationContent({ handleCloseParent }) {
    const { month, months, year, currentSchool, jev, getDocumentBySchoolIdYear } = useSchoolContext();
    const [documentsByYear, setDocumentsByYear] = React.useState([]);
    const [input, setInput] = React.useState(0);
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [isClicked, setIsClicked] = React.useState(false);

    const getDocumentsByYear = React.useCallback(async () => {
        try {
            if (currentSchool) {
                const response = await getDocumentBySchoolIdYear(currentSchool.id, year);
                if (response) {
                    setDocumentsByYear(response);
                }
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }, [currentSchool, year, getDocumentBySchoolIdYear]);

    const handleConfirmClose = () => {
        setConfirmOpen(false);
    }

    const handleConfirmOpen = () => {
        setConfirmOpen(true);
    }

    const handleInputChange = (event) => {
        let modifiedValue = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        setInput(modifiedValue);
    }

    const handleInputClick = () => { setIsClicked(true) }

    const handleInputBlur = () => { setIsClicked(false) }

    const formatNumberDisplay = (number) => {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    }

    const formatAnnualNumberDisplay = (number) => {
        if (isClicked) { return number > 0 ? number : ""; }
        return formatNumberDisplay(number);
    }

    React.useEffect(() => {
        getDocumentsByYear();
    }, [year, jev, getDocumentsByYear, month]);

    React.useEffect(() => {
        if (documentsByYear) {
            const value = documentsByYear.find(doc => doc.month === month) || emptyDocument;
            setInput(value?.annualBudget || 0);
        }
    }, [documentsByYear, month]);

    const ChipInfo = () => {
        const budgetSet = documentsByYear.some(doc => doc.month === month && doc.annualBudget > 0);
        return (
            <Chip
                label={budgetSet ? "The annual budget has been set." : "The annual budget has not been set."}
                size="small"
                color={budgetSet ? "success" : "warning"}
                variant="outlined"
            />
        );
    };

    return (
        <React.Fragment>
            <Typography id="modal-modal-description" sx={{ mt: 1, mb: .5 }}>
                Establish the required or delegated budget for
                <span style={{ fontWeight: 'bold' }}> {currentSchool?.name} </span>
                for the entirety of fiscal year
                <span style={{ fontWeight: 'bold' }}> {year}</span>.
            </Typography>
            <Box sx={
                {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                    borderRadius: 5,
                    border: "1px solid #c7c7c7",
                    mt: 1.5,
                    p: 3,
                    pb: 2
                }
            }>
                <Stack spacing={1} sx={{ alignItems: 'center' }}>
                    <Stack direction="row" spacing={1}>
                        <TextField
                            disabled={documentsByYear.some(doc => doc.month === month && doc.annualBudget > 0)}
                            variant="standard"
                            value={formatAnnualNumberDisplay(input)}
                            inputProps={{
                                inputMode: 'numeric', // For mobile devices to show numeric keyboard
                                pattern: '[0-9]*',    // HTML5 pattern to restrict input to numeric values
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        ₱{/* Replace this with your desired currency symbol */}
                                    </InputAdornment>
                                ),
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    justifyContent: "flex-start",
                                    fontWeight: "bold",
                                    borderRadius: 10,
                                    fontSize: 13,
                                    height: 30
                                }
                            }}
                            onClick={handleInputClick}
                            onBlur={handleInputBlur}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <Button
                            disabled={documentsByYear.some(doc => doc.month === month && doc.annualBudget > 0) || !input || input < 1}
                            sx={[styles.button, { fontSize: 13, ml: 2, mb: 2, maxHeight: 35 }]}
                            onClick={handleConfirmOpen}
                            variant="contained"
                        >
                            Save
                        </Button>
                    </Stack>
                    <Stack direction="row" spacing={1} sx={{ pt: 1 }}>
                        <ChipInfo />
                    </Stack>
                </Stack>
            </Box>
            <TableContainer sx={{ mt: 2, maxHeight: 250 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        minWidth: column.minWidth,
                                        maxWidth: column.maxWidth,
                                        zIndex: 3,
                                        lineHeight: 1.2,
                                        paddingTop: "7px",
                                        paddingBottom: "7px",
                                    }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{ pt: "20px" }}>
                        {months
                            .map((month, index) => {
                                const uniqueKey = `row_${month}_${index}`;
                                return (
                                    <TableRow key={uniqueKey} hover role="checkbox" tabIndex={-1}>
                                        {columns.map((column) => {
                                            const value = documentsByYear.find(doc => doc.month === month);
                                            return (
                                                <TableCell
                                                    key={column.id}
                                                    align={column.align}
                                                    sx={
                                                        {
                                                            minWidth: column.minWidth,
                                                            maxWidth: column.maxWidth,
                                                            fontSize: column.fontSize,
                                                            padding: 0,
                                                            borderWidth: 0
                                                        }
                                                    }
                                                >
                                                    {column.id === "status" ?
                                                        <Box sx={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            position: "relative",
                                                            height: 50
                                                        }}>
                                                            <Box sx={styles.verticalStep} />
                                                            <Box sx={{
                                                                display: 'flex',
                                                                backgroundColor: value?.cashAdvance ? "#00c851" : "#d6d6d6",
                                                                alignItems: 'center',
                                                                color: "white",
                                                                justifyContent: "center",
                                                                borderRadius: 10,
                                                                fontSize: 9,
                                                                height: 25,
                                                                width: value?.cashAdvance ? 70 : 30,
                                                                zIndex: 2
                                                            }}
                                                            >
                                                                {value?.cashAdvance ? "Funded" : ""}
                                                            </Box>
                                                        </Box>
                                                        :
                                                        column.id === "month" ?
                                                            <Box> {month} </Box>
                                                            :
                                                            <Box> ₱ {formatNumberDisplay(value?.cashAdvance ?? 0)}</Box>
                                                    }
                                                </TableCell>
                                            )
                                        })}
                                    </TableRow>
                                )
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <BudgetConfirmModal
                open={confirmOpen}
                handleClose={handleConfirmClose}
                handleCloseParent={handleCloseParent}
                value={input || 0} />
        </React.Fragment >
    );
}

const styles = {
    verticalStep: {
        display: "flex",
        backgroundColor: "#d8d8d8",
        flexDirection: "column",
        position: "absolute",
        width: 1.5,
        zIndex: 1,
        height: "100%"
    },
    button: {
        mt: 2,
        borderRadius: '10px',
        width: '160px',
        padding: '10px 0',
        alignSelf: "center",
        backgroundColor: '#1565c0', // Default background color for enabled button
        color: 'white', // Default text color for enabled button
        '&:hover': {
            backgroundColor: '#19a2e5', // Background color on hover
        },
        '&.Mui-disabled': {
            backgroundColor: '#e0e0e0', // Background color when disabled
            color: '#c4c4c4', // Text color when disabled
        }
    }
}

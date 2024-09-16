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
    Select,
    FormControl,
    MenuItem,
} from '@mui/material';

import { useSchoolContext } from '../../Context/SchoolProvider';
// import { useNavigationContext } from '../../Context/NavigationProvider';

import ConfirmModal from './ConfirmModal';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        },
    },
};

const getStyles = (name, personName) => ({
    fontWeight: "650",
    color: personName === name ? "#176AF6" : null
});

export default function AnnualTab() {
    const { month, months, year, currentSchool, jev, getDocumentBySchoolIdYear, isEditingRef } = useSchoolContext();
    const [documentsByYear, setDocumentsByYear] = React.useState([]);
    const [tabMonth, setTabMonth] = React.useState(month); // Initally get current month value
    const [selectedDocument, setSelectedDocument] = React.useState(null); // Initially get current Document value
    const [input, setInput] = React.useState(0);
    const [confirmOpen, setConfirmOpen] = React.useState(false);

    const handleConfirmClose = () => {
        setConfirmOpen(false);
        isEditingRef.current = false;
    }

    const handleConfirmOpen = () => {
        setConfirmOpen(true);
        isEditingRef.current = true;
    }

    const getDocumentsByYear = React.useCallback(async () => {
        try {
            if (currentSchool) {
                const response = await getDocumentBySchoolIdYear(currentSchool.id, year);
                if (response) {
                    console.log(response); //test
                    setDocumentsByYear(response);
                } else {
                    console.log("Documents not fetched");
                }
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }, [currentSchool, year, getDocumentBySchoolIdYear]);

    React.useEffect(() => {
        getDocumentsByYear();
    }, [year, jev, getDocumentsByYear, month]);

    React.useEffect(() => {
        if (documentsByYear) {
            const value = documentsByYear.find(doc => doc.month === tabMonth) || emptyDocument;
            setInput(value?.cashAdvance || 0);
            setSelectedDocument(value);
        }
    }, [documentsByYear, tabMonth]);
    console.log(selectedDocument)

    const handleChangeMonth = (event) => {
        setTabMonth(event.target.value);
        if (documentsByYear) {
            const value = documentsByYear.find(doc => doc.month === tabMonth);
            setSelectedDocument(value ? value : emptyDocument);
        }
    }

    const handleInputChange = (event) => {
        let modifiedValue = event.target.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        setInput(modifiedValue);
        isEditingRef.current = true;
    }

    const formatNumberDisplay = (number) => {
        //if (typeof number !== 'number') return ''; // Handle non-numeric values gracefully
        return number > 0 ? number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00";
    }

    return (
        <React.Fragment>
            <Typography id="modal-modal-description" sx={{ mt: 1, mb: .5 }}>
                Set the required or delegated cash advance for each month of the fiscal year
                <span style={{ fontWeight: 'bold' }}> {year}</span> at
                <span style={{ fontWeight: 'bold' }}> {currentSchool?.name}</span>.
            </Typography>
            <Box sx={
                {
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 80,
                    width: "100%",
                    borderRadius: 5,
                    border: "1px solid #c7c7c7",
                    mt: 1.5,
                    mb: 1.5,
                    p: 1
                }
            }>
                <FormControl variant="standard" sx={{ m: 2, minWidth: 90 }}>
                    <Select
                        name={"document-month-select"}
                        sx={{ fontSize: 13, fontWeight: "bold" }}
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard"
                        value={tabMonth}
                        onChange={handleChangeMonth}
                        label="Age"
                        inputProps={{ 'aria-label': 'Without label' }}
                        MenuProps={MenuProps}
                    >
                        {months.map((item) => (
                            <MenuItem
                                key={item}
                                value={item}
                                style={getStyles(item, tabMonth)}
                            >{item}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    // disabled={documentsByYear.some(doc => doc.month === tabMonth)}
                    disabled={documentsByYear.some(doc => doc.month === tabMonth && doc.cashAdvance > 0)}
                    variant="standard"
                    value={input}
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
                    // onClick={(event) => handleCellClick(column.id, row.id, event)}
                    onChange={(e) => handleInputChange(e)}
                // onKeyDown={(e) => {
                //     if (e.key === 'Enter') {
                //         e.preventDefault();
                //         e.target.blur(); // Invoke handleLogin on Enter key press
                //     }
                // }} 
                />
                <Button
                    disabled={documentsByYear.some(doc => doc.month === tabMonth && doc.cashAdvance > 0)}
                    // disabled={!selectedDocument?.id === 0}
                    sx={[styles.button, { fontSize: 13, m: 2, maxHeight: 35 }]}
                    onClick={handleConfirmOpen}
                    variant="contained"
                >
                    Save
                </Button>
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
                                        // backgroundColor: "green",
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
            <ConfirmModal
                open={confirmOpen}
                month={tabMonth}
                currentDocument={selectedDocument}
                handleClose={handleConfirmClose}
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

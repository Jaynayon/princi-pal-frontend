import '../App.css'
import React from 'react';
import Paper from '@mui/material/Paper';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Backdrop from '@mui/material/Backdrop';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { FilterDate, SchoolFieldsFilter, SchoolSearchFilter } from '../Components/Filters/FilterDate'
import DocumentTable from '../Components/Table/LRTable';
import Button from '@mui/material/Button';
import { useSchoolContext } from '../Context/SchoolProvider';
// import { useNavigationContext } from '../Context/NavigationProvider';
import DocumentSummary from '../Components/Summary/DocumentSummary';
import JEVTable from '../Components/Table/JEVTable';
import RestService from '../Services/RestService';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ paddingTop: 1 }}>
                    {children}
                </Box>
            )}
        </Box>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

// const theme = createTheme({
//     components: {
//         MuiButton: {
//             styleOverrides: {
//                 root: {
//                     backgroundColor: '#19B4E5', // Default background color for enabled button
//                     color: 'white', // Default text color for enabled button
//                     '&:hover': {
//                         backgroundColor: '#19a2e5', // Background color on hover
//                     },
//                     '&.Mui-disabled': {
//                         backgroundColor: "#e0e0e0", // Background color when disabled
//                         color: '#c4c4c4', // Text color when disabled
//                     }
//                 }
//             }
//         }
//     }
// });

function SchoolPage(props) {
    const { year, month, setIsAdding, currentDocument, exportDocument, reload, updateLr, updateJev, value, setValue } = useSchoolContext();
    //const { selected } = useNavigationContext();

    const exportDocumentOnClick = async () => {
        await exportDocument();
    }

    console.log("Schools renders")

    //Only retried documents from that school if the current selection is a school
    React.useEffect(() => {
        console.log("Schools useEffect: lr updated");
        updateLr();
        updateJev();

        setIsAdding(false); //reset state to allow addFields again
    }, [value, year, month, reload, updateLr, updateJev, setIsAdding]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    if (!currentDocument) { //returns null until there's value
        return null;
    }

    return (
        <Container className="test" maxWidth="lg" sx={{ /*mt: 4,*/ mb: 4 }}>
            <Grid container spacing={2} sx={{ position: 'relative' }}> {/*relative to allow date component to float*/}
                <Grid item xs={12} md={12} lg={12}>
                    <Paper
                        sx={[
                            styles.header, {
                                p: 2,
                                display: 'flex',
                                flexDirection: 'row'
                            }
                        ]}
                        elevation={0}
                        variant='outlined'>
                        <Box style={styles.header.buttons}>
                            <FilterDate />
                            <SchoolFieldsFilter />
                            <SchoolSearchFilter />
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={12}>
                    <Grid item xs={12} md={12} lg={12}>
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                        }}
                        >
                            <Grid container>
                                <Grid item xs={12} sm={8} md={8} lg={6}>
                                    <Box sx={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        height: "100%",
                                        //backgroundColor: 'green'
                                    }}
                                    >
                                        <DocumentSummary />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4} md={4} lg={6}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'flex-end',
                                            alignItems: 'center',
                                            height: '100%', // Ensure Box fills the height of the Grid item
                                            pr: 2
                                        }}
                                    >
                                        <Button variant="contained"
                                            sx={{ backgroundColor: '#4A99D3' }}
                                            onClick={() => exportDocumentOnClick()}
                                        >Export
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                    <Paper sx={[styles.container, { mt: 1 }]}>
                        <Grid container>
                            <Grid item xs={12} md={12} lg={12}>
                                <Box sx={{
                                    overflow: 'auto', //if overflow, hide it
                                    overflowWrap: "break-word",
                                }}>
                                    <Tabs sx={{ minHeight: '10px' }}
                                        value={value}
                                        onChange={handleChange}
                                        aria-label="basic tabs example">
                                        <Tab sx={styles.tab} label="LR & RCD" {...a11yProps(0)} />
                                        <Tab sx={styles.tab} label="JEV" {...a11yProps(1)} />
                                        <BudgetModal />
                                    </Tabs>
                                </Box>
                            </Grid>
                            {/*Document Tables*/}
                            <Grid item xs={12} md={12} lg={12}>
                                <CustomTabPanel value={value} index={0}>
                                    <DocumentTable />
                                </CustomTabPanel>
                                <CustomTabPanel value={value} index={1}>
                                    <JEVTable />
                                </CustomTabPanel>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Container >
    );
}

function ConfirmModal({ open, handleClose, handleCloseParent, value }) {
    const { currentDocument, fetchDocumentData, createNewDocument, jev } = useSchoolContext();

    const updateDocumentById = async (newValue) => {
        try {
            const response = await RestService.updateDocumentById(currentDocument?.id, "Cash Advance", newValue);
            if (response) {
                console.log(`Document with id: ${currentDocument?.id} is updated`);
            } else {
                console.log("Document not updated");
            }
            fetchDocumentData(); //fetch data changes
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    const handleOnClick = async () => {
        let obj = {}
        obj = { cashAdvance: value }
        console.log(jev)
        // jev length upon initialization will always be > 2
        if (currentDocument?.id === 0 || jev === null || jev === undefined || (Array.isArray(jev) && jev.length === 0)) { //if there's no current document or it's not yet existing
            await createNewDocument(obj, value);
        } else {
            await updateDocumentById(value); //update field in db
        }

        handleClose();
        handleCloseParent();
    }

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            closeAfterTransition
            slots={{ backdrop: Backdrop }}
        >
            <Fade in={open}>
                <Paper sx={[styles.paper, { p: 3, pb: 2 }]}> {/*Overload padding component*/}
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: "bold" }}>
                        Are you sure you want to set the desired amount?
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 1 }}>
                        You can only set your budget
                        <span style={{ fontWeight: 'bold' }}> once </span>
                        per month for each school. This action cannot be undone.
                    </Typography>
                    <Box sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: " flex-end",
                        pt: 1
                    }}>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={() => handleOnClick()} color="primary">
                            Save
                        </Button>
                    </Box>
                </Paper>
            </Fade>
        </Modal>
    )
}

function BudgetModal() {
    const { month, currentSchool, currentDocument, jev } = useSchoolContext();
    const [open, setOpen] = React.useState(false);
    const [amount, setAmount] = React.useState(0)
    const [confirmOpen, setConfirmOpen] = React.useState(false);
    const [tab, setTab] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(4);
    const [page, setPage] = React.useState(0);

    const columns = [
        {
            id: 'uacsName',
            label: 'Accounts & Explanations',
            minWidth: 130,
            maxWidth: 130,
            align: 'left',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'uacsCode',
            label: 'Code',
            minWidth: 100,
            maxWidth: 100,
            fontSize: 13,
            align: 'left',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'amount',
            label: 'Budget',
            minWidth: 70,
            maxWidth: 70,
            align: 'left',
            format: (value) => value.toLocaleString('en-US'),
        }
    ];

    const handleOpen = () => setOpen(true);

    const handleClose = () => setOpen(false);

    const handleConfirmClose = () => setConfirmOpen(false)

    const handleChange = (event) => {
        const value = event.target.value;
        const regex = /^[0-9]*$/;

        if (regex.test(value)) {
            setAmount(value);
        }
    }

    const handleChangeTab = (event, newTab) => {
        setTab(newTab);
    };

    React.useEffect(() => {
        if (currentDocument) {
            setAmount(currentDocument?.cashAdvance)
        }
        // Disable and set to first tab if document/jev not initialized
        if (Array.isArray(jev) && jev.length === 0 && tab === 1) {
            setTab(0);
            setPage(0);
        }
    }, [currentDocument, jev, tab, setTab, setPage])

    const formatNumberDisplay = (number, colId, rowId) => {
        //if (typeof number !== 'number') return ''; // Handle non-numeric values gracefully
        return number.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage); // Update the page state with the new page value
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10)); // Update rowsPerPage state with the new value
        setPage(0); // Reset page to 0 whenever rows per page changes
    };

    return (
        <React.Fragment>
            <Button
                sx={[{ minWidth: "90px" }, open && { fontWeight: 'bold' }]}
                onClick={handleOpen}
            >
                Budget
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
            >
                <Fade in={open}>
                    <Paper sx={[styles.paper, { paddingTop: 3 }]}>
                        <Box>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs
                                    sx={{ minHeight: '10px' }}
                                    value={tab}
                                    onChange={handleChangeTab}
                                    aria-label="basic tabs example"
                                >
                                    <Tab sx={styles.tab} label="Budget" {...a11yProps(0)} />
                                    <Tab
                                        sx={styles.tab}
                                        label="UACS"
                                        {...a11yProps(1)}
                                        disabled={(Array.isArray(jev) && jev.length === 0)}
                                    />
                                    <Tab sx={styles.tab} label="Annual" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            <CustomTabPanel value={tab} index={0}>
                                <Typography id="modal-modal-description" sx={{ mt: 1, mb: .5 }}>
                                    Set the budget required or delegated for the month of
                                    <span style={{ fontWeight: 'bold' }}> {month}</span> in
                                    <span style={{ fontWeight: 'bold' }}> {currentSchool?.name}</span>.
                                </Typography>
                                <TextField
                                    sx={{ alignSelf: "center", mt: 2, mb: .5, width: "100%" }}
                                    type="text"
                                    value={amount || 0}
                                    disabled={!!currentDocument?.cashAdvance} // Convert to boolean; Disabled if cash advance already set
                                    onChange={(event) => handleChange(event)}
                                    label="Input Amount"
                                />
                                <Button sx={styles.button}
                                    onClick={() => setConfirmOpen(true)}
                                    variant="contained"
                                    disabled={!!currentDocument?.cashAdvance} >
                                    Save
                                </Button>
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={1} sx={{ display: false }}>
                                <Typography id="modal-modal-description" sx={{ mt: 1, mb: .5 }}>
                                    Set a projected budget for various expense categories under UACS in
                                    <span style={{ fontWeight: 'bold' }}> {month}</span> at
                                    <span style={{ fontWeight: 'bold' }}> {currentSchool?.name}</span>.
                                </Typography>
                                <TableContainer sx={{ mt: 2, maxHeight: 280 }}>
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
                                                            lineHeight: 1.2,
                                                            padding: "0px",
                                                            paddingBottom: "10px"
                                                        }}
                                                    >
                                                        {column.label}
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody >
                                            {jev
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                                .map((row, index) => {
                                                    const uniqueKey = `row_${row.id}_${index}`;
                                                    return (
                                                        <TableRow key={uniqueKey} hover role="checkbox" tabIndex={-1}>
                                                            {columns.map((column) => {
                                                                const value = row[column.id];

                                                                return (
                                                                    <TableCell
                                                                        key={column.id}
                                                                        align={column.align}
                                                                        sx={[
                                                                            styles.cell,
                                                                            {
                                                                                minWidth: column.minWidth,
                                                                                maxWidth: column.maxWidth,
                                                                                fontSize: column.fontSize,
                                                                                padding: "0px",
                                                                                paddingBottom: "5px",
                                                                                paddingTop: "5px"
                                                                            }
                                                                        ]}
                                                                    // onClick={(event) => handleCellClick(column.id, row.id, event)}
                                                                    >
                                                                        {/*Amount field*/}
                                                                        {column.id === "amount" ?
                                                                            <Box
                                                                                style={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    flexDirection: 'row',
                                                                                    justifyContent: "flex-start",
                                                                                    height: 40,
                                                                                }}
                                                                            >
                                                                                {formatNumberDisplay(value, column.id, row.id)}
                                                                            </Box>
                                                                            :
                                                                            /*Account Type field*/
                                                                            column.id === "uacsCode" ?
                                                                                /*Object Code*/
                                                                                <Box sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    padding: "0px",
                                                                                }}>
                                                                                    <Box>
                                                                                        {value}
                                                                                    </Box>
                                                                                </Box>
                                                                                :
                                                                                /*Accounts and Explanations*/
                                                                                <Box sx={{
                                                                                    display: 'flex',
                                                                                    alignItems: 'center',
                                                                                    padding: "0px",
                                                                                    paddingRight: "10px"
                                                                                }}>
                                                                                    <Box>
                                                                                        {value}
                                                                                    </Box>
                                                                                </Box>
                                                                        }
                                                                    </TableCell>
                                                                );
                                                            })}
                                                        </TableRow>
                                                    );
                                                })}
                                        </TableBody>
                                    </Table>

                                </TableContainer>
                                <TablePagination
                                    sx={{
                                        '& .MuiToolbar-root': {
                                            padding: 0,
                                            overflowX: "hidden"
                                        },
                                        '& .MuiInputBase-root': { marginLeft: 0 },
                                        '& .MuiTablePagination-actions': { marginLeft: 2 },
                                    }}
                                    rowsPerPageOptions={[4, 10, 25]}
                                    component="div"
                                    count={jev.length}
                                    rowsPerPage={rowsPerPage}
                                    page={Math.min(page, Math.floor(jev.length / rowsPerPage))}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </CustomTabPanel>
                            <CustomTabPanel value={tab} index={2}>
                                <Typography id="modal-modal-description" sx={{ mt: 1, mb: .5 }}>
                                    Set the budget required or delegated each month of the fiscal year at
                                    <span style={{ fontWeight: 'bold' }}> {currentSchool?.name}</span>.
                                </Typography>
                            </CustomTabPanel>
                        </Box>
                        <ConfirmModal
                            open={confirmOpen}
                            handleClose={handleConfirmClose}
                            handleCloseParent={handleClose}
                            value={amount || 0} />
                    </Paper>
                </Fade>
            </Modal>
        </React.Fragment >
    );
}

const styles = {
    header: {
        overflow: 'auto', //if overflow, hide it
        overflowWrap: "break-word",
        fontFamily: 'Mulish-Regular',
        buttons: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '650px', //adjust the container
            //position: 'relative'
        }
    },
    container: {
        overflow: 'hidden',
        padding: "10px",
        paddingTop: "10px"
    },
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
        width: 400,
        borderRadius: '15px',
        //textAlign: 'center',
    },
    button: {
        mt: 2,
        borderRadius: '10px',
        width: '160px',
        padding: '10px 0',
        alignSelf: "center",
        backgroundColor: '#19B4E5', // Default background color for enabled button
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

export default SchoolPage;
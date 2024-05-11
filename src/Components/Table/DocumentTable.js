import React, { Component } from 'react';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import RecordsRow from './RecordsRow';
import Typography from '@mui/material/Typography';
import { SchoolContext } from '../../Context/SchoolProvider';

class LRTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 4,
        };
    }

    // componentDidMount() {
    //     // Accessing context values using this.context
    //     const {
    //         month,
    //         year,
    //         setLr,
    //         fetchLrByDocumentId,
    //         currentDocument,
    //     } = this.context;

    //     // Example usage of context values
    //     console.log('Current Month:', month);
    //     console.log('Current Year:', year);

    //     // Perform operations with context values
    //     // For example, fetching LR data
    //     const documentId = currentDocument ? currentDocument.id : null;
    //     if (documentId) {
    //         fetchLrByDocumentId(documentId)
    //             .then(lrData => {
    //                 setLr(lrData);
    //             })
    //             .catch(error => {
    //                 console.error('Error fetching LR data:', error);
    //             });
    //     }
    // }

    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({
            rowsPerPage: parseInt(event.target.value, 10),
            page: 0
        });
    };

    render() {
        const { page, rowsPerPage } = this.state;
        const { lr } = this.context;
        const columns = [
            {
                id: 'date',
                label: 'Date',
                minWidth: 140,
                maxWidth: 140,
                align: 'left',
                format: (value) => value.toLocaleString('en-US'),
            },
            {
                id: 'orsBursNo',
                label: 'ORS/BURS No.',
                minWidth: 140,
                maxWidth: 140,
                align: 'left',
                format: (value) => value.toLocaleString('en-US'),
            },
            {
                id: 'payee',
                label: 'Payee',
                minWidth: 140,
                maxWidth: 140,
                align: 'left',
                format: (value) => value.toLocaleString('en-US'),
            },
            {
                id: 'particulars',
                label: 'Particulars',
                minWidth: 200,
                maxWidth: 200,
                align: 'left',
                format: (value) => value.toLocaleString('en-US'),
            },
            {
                id: 'objectCode',
                label: 'UACS',
                minWidth: 90,
                maxWidth: 150,
                align: 'left',
                format: (value) => value.toLocaleString('en-US'),
            },
            {
                id: 'natureOfPayment',
                label: 'Nature of Payment',
                minWidth: 100,
                maxWidth: 120,
                align: 'left',
                format: (value) => value.toLocaleString('en-US'),
            },
            {
                id: 'amount',
                label: 'Amount',
                minWidth: 90,
                maxWidth: 100,
                align: 'left',
                format: (value) => value.toLocaleString('en-US'),
            },
        ];

        if (!lr) {
            return null;
        }

        return (
            <SchoolContext.Consumer>
                {({ setLr }) => (
                    <React.Fragment>
                        <TableContainer>
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
                                                }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <RecordsRow
                                        rows={lr}
                                        setRows={setLr}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        columns={columns}
                                    />
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/*<Box sx={{
                            display: "flex"
                        }}>
                            <Box sx={{
                                width: "50%",
                                height: "100%",
                                backgroundColor: "green"
                            }}>
                                s
                            </Box>
                            <TablePagination
                                rowsPerPageOptions={[4, 10, 25, 100]}
                                component="div"
                                count={lr.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={this.handleChangePage}
                                onRowsPerPageChange={this.handleChangeRowsPerPage}
                            />
                        </Box>*/}
                        <Grid container sx={{ mt: 1, pb: 1, overflowX: 'auto' }}>
                            <Grid item xs={12} sm={12} md={8} lg={8} >
                                <Grid container >
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <DocumentTextFields
                                            description="Claimant"
                                        />
                                        <DocumentTextFields
                                            description="SDS"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <DocumentTextFields
                                            description="Head. Accounting Div. Unit"
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4} sx={{ pt: 1 }}>
                                <TablePagination
                                    rowsPerPageOptions={[4, 10, 25, 100]}
                                    component="div"
                                    count={lr.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={this.handleChangePage}
                                    onRowsPerPageChange={this.handleChangeRowsPerPage}
                                />
                            </Grid>
                        </Grid>
                    </React.Fragment>
                )}
            </SchoolContext.Consumer>
        );
    }
}

// Assign the contextType property to access context values using this.context
LRTable.contextType = SchoolContext;

export default LRTable;

const DocumentTextFields = (props) => {
    const { description } = props;
    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row', //main axis (horizontal)
            alignItems: "center", //center vertically
            pt: 1
        }}>
            <Box sx={{
                width: 90,
                fontSize: 14,
                fontWeight: 650,
                color: "#9FA2B4",
                pr: 1.5
            }}>
                <Typography variant="inherit">
                    {description}
                </Typography>
            </Box>
            <TextField
                // value={value}
                variant='standard'
                sx={{
                    "& fieldset": { border: 'none' }
                }}
                InputProps={{
                    //disableUnderline: true,
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 14,
                        height: 30,
                        width: 150,
                        pl: 5,
                    }
                }}
                // onChange={(event) =>
                //     handleInputChange(column.id, row.id, event)
                // }
                //onBlur={() => handleInputBlur(column.id, row.id)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        e.target.blur(); // Invoke handleLogin on Enter key press
                    }
                }}
            />
        </Box>
    );
}
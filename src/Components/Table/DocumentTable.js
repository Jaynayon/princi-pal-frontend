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
import { SchoolContext, useSchoolContext } from '../../Context/SchoolProvider';
import RestService from '../../Services/RestService';

class LRTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 4,
            claimant: "",
            sds: "",
            headAccounting: ""
        };
    }

    componentDidMount() {
        // Accessing context values using this.context
        const { currentDocument, fetchDocumentData, value } = this.context;

        this.setState({ claimant: currentDocument.claimant })
        this.setState({ sds: currentDocument.sds })
        this.setState({ headAccounting: currentDocument.headAccounting })

        if (!currentDocument) {
            return null;
        }
        if (value === 0) {
            fetchDocumentData();
        }

    }

    // componentDidUpdate(prevProps, prevState) {
    //     // Check if currentDocument prop from context has changed
    //     if (this.context.currentDocument !== prevProps.currentDocument) {
    //         // Update state based on the new currentDocument prop
    //         this.updateStateFromDocument(this.context.currentDocument);
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
        const { page, rowsPerPage, claimant, sds, headAccounting } = this.state;
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



        return (
            <SchoolContext.Consumer>
                {({ setLr, currentDocument }) => (
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
                        <Grid container sx={{ mt: 1, pb: 1, overflowX: 'auto' }}>
                            <Grid item xs={12} sm={12} md={8} lg={8} >
                                <Grid container sx={{ pl: 2, pb: 1 }}>
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <DocumentTextFields
                                            id={currentDocument?.id} //pass by value
                                            value={currentDocument?.claimant}
                                            description="Claimant"
                                        />
                                        <DocumentTextFields
                                            id={currentDocument?.id}
                                            value={currentDocument?.sds}
                                            description="SDS"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={6} lg={6}>
                                        <DocumentTextFields
                                            id={currentDocument?.id}
                                            value={currentDocument?.headAccounting}
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
    // const { } = useSchoolContext();
    const { description, value, id } = props;
    const [input, setInput] = React.useState(value !== null ? value : "");
    const [prevInput, setPrevInput] = React.useState('initial state');

    React.useEffect(() => {
        setInput(value); // Set previous input on initial render
    }, [value]); // Update prevInput whenever value prop changes

    const handleInputChange = (event) => {
        setInput(event.target.value);
    }

    const handleInputBlur = async () => {
        if (prevInput !== input) {
            console.log("there are changes");
            await updateDocumentById(input); //update field in db
        } else
            console.log("no changes");
    }

    const handleInputOnClick = (event) => {
        setPrevInput(event.target.value);
    }

    const updateDocumentById = async (newValue) => {
        try {
            const response = await RestService.updateDocumentById(id, description, input);
            if (response) {
                console.log(`Document with id: ${id} is updated`);
                setInput(newValue);
            } else {
                console.log("Document not updated");
            }
            //fetchDocumentData(); //fetch data changes
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    }

    if (!id) {
        return null;
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row', //main axis (horizontal)
            alignItems: "center", //center vertically
            pt: 1
        }}>
            <Box sx={{
                pr: 1.5,
                width: 80,
                fontSize: 13,
                fontWeight: 650,
                color: "#9FA2B4"
            }}>
                <Typography variant="inherit">
                    {description}
                </Typography>
            </Box>
            <TextField
                value={input}
                variant='standard'
                sx={{
                    "& fieldset": { border: 'none' }
                }}
                InputProps={{
                    style: {
                        display: 'flex',
                        alignItems: 'center',
                        fontSize: 14,
                        height: 30,
                        width: 150,
                        pl: 5,
                    }
                }}
                onChange={(event) => handleInputChange(event)}
                onClick={(event) => handleInputOnClick(event)}
                onBlur={(event) => handleInputBlur(event)}
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
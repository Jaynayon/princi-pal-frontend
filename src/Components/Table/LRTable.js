import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import LRRow from './LRRow';
import Typography from '@mui/material/Typography';
import { useSchoolContext } from '../../Context/SchoolProvider';

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
        minWidth: 150,
        maxWidth: 150,
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
        minWidth: 110,
        maxWidth: 110,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'amount',
        label: 'Amount',
        minWidth: 140,
        maxWidth: 140,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
];

export default function LRTable() {
    const {
        currentDocument,
        emptyDocument,
        lr,
        addFields,
        formatDate,
        isAdding,
        setIsAdding,
        isEditingRef,
        isEditable,
        deleteLrByid,
        setLr,
        updateLr,
        fetchDocumentData,
        createLrByDocId,
        value
    } = useSchoolContext();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    useEffect(() => {
        if (currentDocument === emptyDocument) {
            setPage(0);
        }
    }, [currentDocument, emptyDocument]);

    return (
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
                                        zIndex: 1,
                                        minWidth: column.minWidth,
                                        maxWidth: column.maxWidth,
                                    }}
                                >
                                    <Typography variant="inherit" sx={{ ml: 1.5 }}>
                                        {column.label}
                                    </Typography>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <LRRow
                            page={page}
                            rowsPerPage={rowsPerPage}
                            columns={columns}
                            addFields={addFields}
                            formatDate={formatDate}
                            isAdding={isAdding}
                            setIsAdding={setIsAdding}
                            isEditingRef={isEditingRef}
                            isEditable={isEditable}
                            deleteLrByid={deleteLrByid}
                            lr={lr}
                            updateLr={updateLr}
                            setLr={setLr}
                            currentDocument={currentDocument}
                            createLrByDocId={createLrByDocId}
                            fetchDocumentData={fetchDocumentData}
                            value={value}
                        />
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container sx={{ mt: 1, pb: 1, overflowX: 'auto' }}>
                <Grid item xs={12} sm={12} md={8} lg={8} >
                    <Grid container sx={{ pl: 2, pb: 1 }}>
                        <Grid item xs={6} sm={6} md={6} lg={6}>
                            <DocumentTextFields
                                prop={currentDocument}
                                description="Claimant"
                            />
                            <DocumentTextFields
                                prop={currentDocument}
                                description="SDS"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <DocumentTextFields
                                prop={currentDocument}
                                description="Head. Accounting Div. Unit"
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} sx={{ pt: 1 }}>
                    <TablePagination
                        name={"testtest"}
                        rowsPerPageOptions={[4, 10, 25, 100]}
                        component="div"
                        count={lr.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Grid>
            </Grid>
        </React.Fragment>
    );
};

const DocumentTextFields = (props) => {
    const { updateDocumentById, fetchDocumentData } = useSchoolContext();
    const { description, prop } = props;
    // const { } = useSchoolContext();
    // const { description, value, id } = props;
    const id = prop?.id || "None";
    let value;
    if (description === "Claimant") {
        value = prop?.claimant || "None"
    } else if (description === "SDS") {
        value = prop?.sds || "None"
    } else if (description === "Head. Accounting Div. Unit") {
        value = prop?.headAccounting || "None"
    } else {
        value = "None"
    }

    const [input, setInput] = React.useState(prop || "None");
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
            await updateDocumentFooter(input); //update field in db
        } else
            console.log("no changes");
    }

    const handleInputOnClick = (event) => {
        if (value === "None" || value === "none") {
            setInput("")
        }
        setPrevInput(event.target.value);
    }

    const updateDocumentFooter = async (newValue) => {
        try {
            const response = await updateDocumentById(id, description, input);
            if (response) {
                console.log(`Document with id: ${id} is updated`);
                setInput(newValue);
            } else {
                console.log("Document not updated");
            }
            fetchDocumentData(); //fetch data changes
        } catch (error) {
            console.error('Error fetching document:', error);
        }
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
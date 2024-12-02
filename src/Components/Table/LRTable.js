import React, { useEffect, useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import Grid from '@mui/material/Grid';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import LRRow from './LRRow';
import Typography from '@mui/material/Typography';
import { useSchoolContext } from '../../Context/SchoolProvider';
import { useAppContext } from '../../Context/AppProvider';
import { useNavigationContext } from '../../Context/NavigationProvider';
import DocumentTextField from '../Input/DocumentTextField';

const columns = [
    {
        id: 'date',
        label: 'Date',
        minWidth: 130,
        maxWidth: 130,
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
        minWidth: 190,
        maxWidth: 190,
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
        minWidth: 130,
        maxWidth: 130,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'actions',
        label: 'Actions',
        minWidth: 100,
        maxWidth: 100,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
];

export default function LRTable() {
    const { currentUser } = useAppContext();
    const { selected } = useNavigationContext();
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
        removeLrStateById,
        fetchDocumentData,
        createLrByDocId,
        value,
        isSearchingRef
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
        setPage(0);
    }, [currentDocument, emptyDocument]);

    // Memoize dependencies to prevent unnecessary re-renders
    const stableSchools = useMemo(() => currentUser.schools, [currentUser.schools]);
    const stableSelected = useMemo(() => selected, [selected]);

    useEffect(() => {
        let intervalIdLr = null;

        const updateLRData = () => {
            // Fetch data if user is not adding, editing, or searching
            if (!isAdding && !isEditingRef.current && !isSearchingRef.current) {
                updateLr().catch(error => console.error('Error fetching LR data:', error));
            }
        };

        // Check if user is in the school tab or dashboard
        if (stableSchools.find(school => school.name === stableSelected) || stableSelected === "Dashboard") {
            updateLRData();  // Initial fetch immediately
            intervalIdLr = setInterval(updateLRData, 10000);  // Set interval for every 10 seconds
        }

        // Cleanup function to clear interval
        return () => {
            if (intervalIdLr) {
                clearInterval(intervalIdLr);
                intervalIdLr = null;  // Reset intervalId to null after clearing
            }
        };

    }, [updateLr, isAdding, isEditingRef, isSearchingRef, stableSchools, stableSelected]);



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
                                    <Typography variant="inherit" sx={column.id !== "actions" ? { ml: 1.5 } : undefined}>
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
                            removeLrStateById={removeLrStateById}
                            currentDocument={currentDocument}
                            createLrByDocId={createLrByDocId}
                            fetchDocumentData={fetchDocumentData}
                            value={value}
                        />
                    </TableBody>
                </Table>
            </TableContainer>
            <Grid container sx={{ mt: 1, pb: 2 }}>
                <Grid item xs={12} sm={12} md={7} lg={7} >
                    <Grid container sx={{ pl: 2, display: "flex", alignItems: "center" }}>
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                            <DocumentTextField
                                prop={currentDocument}
                                description="Claimant"
                            />
                            <DocumentTextField
                                prop={currentDocument}
                                description="SDS"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={6} lg={6} sx={{ pl: { xs: 0, sm: 2 } }}>
                            <DocumentTextField
                                prop={currentDocument}
                                description="Head. Accounting Div. Unit"
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={5} lg={5} sx={{
                    pr: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: {
                        xs: "flex-start",
                        sm: "flex-start",
                        md: "flex-end"
                    }
                }}>
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
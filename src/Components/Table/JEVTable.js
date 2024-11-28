import React, { useEffect, useMemo, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useSchoolContext } from '../../Context/SchoolProvider';
import JEVRow from './JEVRow';
import { useAppContext } from '../../Context/AppProvider';
import { useNavigationContext } from '../../Context/NavigationProvider';

const columns = [
    {
        id: 'uacsName',
        label: 'Accounts and Explanations',
        minWidth: 140,
        maxWidth: 140,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'uacsCode',
        label: 'Object Code',
        minWidth: 140,
        maxWidth: 140,
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
    {
        id: 'amountType',
        label: 'Amount Type',
        minWidth: 140,
        maxWidth: 140,
        align: 'left',
        format: (value) => value.toLocaleString('en-US'),
    }
];

export default function JEVTable() {
    const { currentUser } = useAppContext();
    const { selected } = useNavigationContext();
    const {
        currentDocument,
        emptyDocument,
        jev,
        updateJev,
        isAdding,
        isEditingRef,
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
        if (currentDocument === emptyDocument) {
            setPage(0);
        }
    }, [currentDocument, emptyDocument]);

    // Memoize dependencies to prevent unnecessary re-renders
    const stableSchools = useMemo(() => currentUser.schools, [currentUser.schools]);
    const stableSelected = useMemo(() => selected, [selected]);

    useEffect(() => {
        let intervalIdJev = null;

        // Check if user is in the school tab or dashboard
        if (stableSchools.find(school => school.name === stableSelected) || stableSelected === "Dashboard") {
            updateJev();  // Initial fetch
            intervalIdJev = setInterval(updateJev, 10000);  // Set interval for every 10 seconds
        }

        // Cleanup function to clear interval
        return () => {
            if (intervalIdJev) {
                clearInterval(intervalIdJev);
                intervalIdJev = null;  // Ensure intervalId is reset to null
            }
        };

    }, [updateJev, isAdding, isEditingRef, isSearchingRef, stableSchools, stableSelected]);


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
                        <JEVRow
                            page={page}
                            rowsPerPage={rowsPerPage}
                            columns={columns}
                        />
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[4, 10, 25, 100]}
                component="div"
                count={jev.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </React.Fragment>
    );
};
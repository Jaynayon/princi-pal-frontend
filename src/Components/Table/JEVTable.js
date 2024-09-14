import React, { useContext, useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { SchoolContext } from '../../Context/SchoolProvider';
import JEVRow from './JEVRow';

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
    const { currentDocument, emptyDocument, jev } = useContext(SchoolContext);
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

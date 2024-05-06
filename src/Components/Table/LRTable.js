import React, { useEffect, useState } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import RecordsRow from './RecordsRow';
import { useSchoolContext } from '../../Context/SchoolProvider';
import { useNavigationContext } from '../../Context/NavigationProvider';

function LRTable(props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(4);
    const { lr, setLr } = useSchoolContext();
    const { fetchLrByDocumentId, fetchDocumentBySchoolIdYearMonth, year, month } = useSchoolContext();
    const { selected } = useNavigationContext();

    const columns = [
        {
            id: 'date',
            label: 'Date',
            minWidth: 50,
            maxWidth: 100,
            align: 'left',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'orsBursNo',
            label: 'ORS/BURS No.',
            minWidth: 50,
            maxWidth: 100,
            align: 'left',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'particulars',
            label: 'Particulars',
            minWidth: 200,
            maxWidth: 280,
            align: 'left',
            format: (value) => value.toLocaleString('en-US'),
        },
        {
            id: 'amount',
            label: 'Amount',
            minWidth: 50,
            maxWidth: 100,
            align: 'left',
            format: (value) => value.toLocaleString('en-US'),
        },
    ];

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0); // Reset to the first page when changing rows per page
    };

    useEffect(() => {
        fetchLrByDocumentId("663583ecf624082c3503c623");
        //fetchDocumentBySchoolIdYearMonth("6634e7fc43d8096920d765ff", year, month);
        //console.log("LR TABLE: Get this school's lr and document");
    }, [selected, year, month]);

    return (
        <React.Fragment>
            <TableContainer sx={styles.tableContainer}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{
                                        ...styles.column,
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
                            text={""} />
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[4, 10, 25, 100]}
                component="div"
                count={lr.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </React.Fragment>
    );
}

const styles = {
    container: {
        overflow: 'hidden',
        padding: "10px",
        paddingTop: "20px"
    },
    tableContainer: {
        maxHeight: 440,
        fontFamily: "Mulish-Regular"
    },
    column: {
        fontFamily: "Mulish-Regular",
        fontWeight: "bold",
        color: "#9FA2B4"
    },
    fontStyling: {
        fontFamily: "Mulish-Regular",
        fontWeight: "bold",
        color: "#808080",
        float: "left",
        fontSize: "16.5px",
        paddingTop: "3px"
    },
    inputStyling: {
        fontFamily: "Mulish-Regular",
        float: "left",
        fontWeight: "bold",
        fontSize: "18px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        background: "transparent",
        outline: "none",
        height: "30px",
        width: "316px",
        padding: "5px",
        marginLeft: "20px",
        marginBottom: "7px"
    }
}

export default LRTable;
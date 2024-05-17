import React, { Component } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { SchoolContext } from '../../Context/SchoolProvider';
import JEVRow from './JEVRow';

class JEVTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 4,
        };
    }

    // componentDidMount() {
    //     // Accessing context values using this.context
    //     const { currentDocument, fetchDocumentData, value } = this.context;

    //     if (!currentDocument) {
    //         return null;
    //     }

    //     fetchDocumentData();
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
        const { jev, currentDocument } = this.context;
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

        if (!jev) {
            return null;
        }

        return (
            <SchoolContext.Consumer>
                {({ setJev }) => (
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
                            onPageChange={this.handleChangePage}
                            onRowsPerPageChange={this.handleChangeRowsPerPage}
                        />
                    </React.Fragment>
                )}
            </SchoolContext.Consumer>
        );
    }
}

// Assign the contextType property to access context values using this.context
JEVTable.contextType = SchoolContext;

export default JEVTable;
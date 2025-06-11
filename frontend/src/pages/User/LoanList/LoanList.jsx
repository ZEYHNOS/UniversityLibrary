import React, { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Alert, TablePagination, Box } from '@mui/material';
import Logo from '../../../components/Logo';
import axios from 'axios';

const columns = [
    { id: 'bookId', label: '책고유번호', align: 'center' },
    { id: 'bookImageUrl', label: '책 이미지', align: 'center' },
    { id: 'bookTitle', label: '책제목', align: 'left' },
    { id: 'loanStart', label: '대출일', align: 'center' },
    { id: 'loanEnd', label: '대출종료일', align: 'center' },
    { id: 'loanStatus', label: '대출상태', align: 'center' },
];

const LoanList = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                setLoading(true);
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const userId = userInfo?.user_id;
                if (!userId) throw new Error('로그인 정보가 없습니다.');
                const response = await axios.get(`http://localhost:2866/api/loan/list/${userId}`);
                setLoans(response.data || []);
                setError(null);
            } catch (err) {
                setError('대출 내역을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchLoans();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress sx={{ color: '#40A0BC' }} />
            </Container>
        );
    }
    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Logo />
            <Typography variant="h4" component="h1" sx={{ color: '#40A0BC', fontWeight: 'bold', mb: 3 }}>
                내 대출 내역
            </Typography>
            {loans.length === 0 ? (
                <Alert severity="info">대출 내역이 없습니다.</Alert>
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: '0 4px 6px rgba(64, 160, 188, 0.1)' }}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.id}
                                            align={col.align}
                                            sx={{ backgroundColor: '#40A0BC', color: 'white', fontWeight: 'bold' }}
                                        >
                                            {col.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {loans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((loan) => {
                                    const isReturned = loan.loanReturn === 'Y';
                                    return (
                                        <TableRow key={loan.bookId} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(64, 160, 188, 0.05)' }, '&:hover': { backgroundColor: 'rgba(64, 160, 188, 0.1)' } }}>
                                            <TableCell align="center">{loan.bookId}</TableCell>
                                            <TableCell align="center">
                                                <Box
                                                    component="img"
                                                    src={"http://localhost:2866"+loan.bookImageUrl}
                                                    alt={loan.bookTitle}
                                                    sx={{ width: 80, height: 110, objectFit: 'contain', borderRadius: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
                                                />
                                            </TableCell>
                                            <TableCell>{loan.bookTitle}</TableCell>
                                            <TableCell align="center">{loan.loanStart ? loan.loanStart.slice(0, 10) : ''}</TableCell>
                                            <TableCell align="center" sx={{ color: isReturned ? 'green' : 'red', fontWeight: 'bold' }}>
                                                {isReturned ? (loan.loanReturnDate ? loan.loanReturnDate.slice(0, 10) : '') : (loan.loanEnd ? loan.loanEnd.slice(0, 10) : '')}
                                            </TableCell>
                                            <TableCell align="center" sx={{ color: isReturned ? 'green' : 'red', fontWeight: 'bold' }}>
                                                {isReturned ? '반납' : '미반납'}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10]}
                        component="div"
                        count={loans.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        labelDisplayedRows={({ from, to, count }) => `${count} / ${to} `}
                        sx={{
                            '.MuiTablePagination-select': { color: '#40A0BC' },
                            '.MuiTablePagination-selectIcon': { color: '#40A0BC' },
                            '.MuiTablePagination-actions button': { color: '#40A0BC' }
                        }}
                    />
                </Paper>
            )}
        </Container>
    );
};

export default LoanList;

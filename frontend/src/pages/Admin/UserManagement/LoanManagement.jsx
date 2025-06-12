import React, { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Alert, TablePagination, Box, Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton } from '@mui/material';
import axios from 'axios';
import Logo from '../../../components/Logo';

const columns = [
    { id: 'loanId', label: '대출ID', align: 'center' },
    { id: 'userId', label: '대출자ID', align: 'center' },
    { id: 'userName', label: '대출자명', align: 'center' },
    { id: 'bookId', label: '도서ID', align: 'center' },
    { id: 'bookTitle', label: '도서명', align: 'center' },
    { id: 'loanStart', label: '대출일', align: 'center' },
    { id: 'loanEnd', label: '반납예정일', align: 'center' },
    { id: 'loanReturnDate', label: '실제반납일', align: 'center' },
    { id: 'loanReturn', label: '반납여부', align: 'center' },
];

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    return date.toISOString().slice(0, 10);
}

function getReturnStatus(loanReturn, loanEnd) {
    if (loanReturn === 'Y') return '반납완료';
    if (loanReturn === 'N') {
        if (!loanEnd) return '대출중';
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const endDate = new Date(loanEnd);
        endDate.setHours(0, 0, 0, 0);
        if (endDate < today) return '대출기간만료';
        return '대출중';
    }
    return '-';
}

function getReturnStatusColor(status) {
    if (status === '반납완료') return '#2563eb'; // 파랑
    if (status === '대출기간만료') return '#dc2626'; // 빨강
    if (status === '대출중') return '#22c55e'; // 초록
    return undefined;
}

const LoanManagement = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchLoans = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:2866/api/loan/list', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setLoans(response.data || []);
                setError(null);
            } catch (error) {
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

    // 모달 핸들러
    const handleRowClick = (loan) => {
        setSelectedLoan(loan);
        setModalOpen(true);
    };
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedLoan(null);
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
                대출 내역 관리
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
                                {loans
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((loan, idx) => (
                                        <TableRow
                                            key={loan.loanId + idx}
                                            sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(64, 160, 188, 0.05)' }, '&:hover': { backgroundColor: 'rgba(64, 160, 188, 0.1)' }, cursor: 'pointer' }}
                                            onClick={() => handleRowClick(loan)}
                                        >
                                            <TableCell align="center">{loan.loanId}</TableCell>
                                            <TableCell align="center">{loan.userId}</TableCell>
                                            <TableCell align="center">{loan.userName}</TableCell>
                                            <TableCell align="center">{loan.bookId}</TableCell>
                                            <TableCell align="center">{loan.bookTitle}</TableCell>
                                            <TableCell align="center">{formatDate(loan.loanStart)}</TableCell>
                                            <TableCell align="center">{formatDate(loan.loanEnd)}</TableCell>
                                            <TableCell align="center">{formatDate(loan.loanReturnDate)}</TableCell>
                                            <TableCell align="center">
                                                <span style={{ color: getReturnStatusColor(getReturnStatus(loan.loanReturn, loan.loanEnd)), fontWeight: 'bold' }}>
                                                    {getReturnStatus(loan.loanReturn, loan.loanEnd)}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
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
            {/* 대출 상세 모달 */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="xs" fullWidth>
                <DialogTitle>대출 상세 정보</DialogTitle>
                <DialogContent>
                    {selectedLoan && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">대출ID: {selectedLoan.loanId}</Typography>
                            <Typography variant="subtitle1">대출자ID: {selectedLoan.userId}</Typography>
                            <Typography variant="subtitle1">대출자명: {selectedLoan.userName}</Typography>
                            <Typography variant="subtitle1">도서ID: {selectedLoan.bookId}</Typography>
                            <Typography variant="subtitle1">도서명: {selectedLoan.bookTitle}</Typography>
                            <Typography variant="subtitle1">대출일: {formatDate(selectedLoan.loanStart)}</Typography>
                            <Typography variant="subtitle1">반납예정일: {formatDate(selectedLoan.loanEnd)}</Typography>
                            <Typography variant="subtitle1">실제반납일: {formatDate(selectedLoan.loanReturnDate)}</Typography>
                            <Typography variant="subtitle1">
                                반납여부: <span style={{ color: getReturnStatusColor(getReturnStatus(selectedLoan.loanReturn, selectedLoan.loanEnd)), fontWeight: 'bold' }}>{getReturnStatus(selectedLoan.loanReturn, selectedLoan.loanEnd)}</span>
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <MuiButton onClick={handleCloseModal} color="primary" variant="outlined">닫기</MuiButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default LoanManagement;

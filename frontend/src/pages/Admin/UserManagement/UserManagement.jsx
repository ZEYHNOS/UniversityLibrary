import React, { useState, useEffect } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Alert, TablePagination, Box, TableSortLabel, Dialog, DialogTitle, DialogContent, DialogActions, Button as MuiButton } from '@mui/material';
import axios from 'axios';
import Logo from '../../../components/Logo';
import { toast } from 'react-toastify';

const columns = [
    { id: 'userId', label: '아이디', align: 'center', sortable: true },
    { id: 'userName', label: '이름', align: 'center', sortable: true },
    { id: 'userDp', label: '부서', align: 'center', sortable: true },
    { id: 'userPhone', label: '전화번호', align: 'center', sortable: true },
    { id: 'userStatus', label: '상태', align: 'center', sortable: true },
];

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('userId');
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:2866/user/list', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setUsers(response.data || []);
                setError(null);
            } catch (error) {
                setError('유저 목록을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    function descendingComparator(a, b, orderBy) {
        if (typeof b[orderBy] === 'number' && typeof a[orderBy] === 'number') {
            return b[orderBy] - a[orderBy];
        }
        return String(b[orderBy]).localeCompare(String(a[orderBy]), 'ko');
    }
    function getComparator(order, orderBy) {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    }
    function stableSort(array, comparator) {
        const stabilizedThis = array.map((el, index) => [el, index]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    }

    const sortedUsers = stableSort(users, getComparator(order, orderBy));

    // 모달 핸들러
    const handleRowClick = (user) => {
        setSelectedUser(user);
        setModalOpen(true);
    };
    // 모달 닫기
    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedUser(null);
    };
    // 비활성화 기능
    const handleDeactivate = async () => {
        if (!selectedUser) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:2866/user/inactive/${selectedUser.userId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // 성공 시 목록 새로고침
            const fetchUsers = async () => {
                try {
                    setLoading(true);
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://localhost:2866/user/list', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUsers(response.data || []);
                    setError(null);
                } catch (error) {
                    setError('유저 목록을 불러오는데 실패했습니다.');
                } finally {
                    setLoading(false);
                }
            };
            await fetchUsers();
            toast.success(`${selectedUser.userId}` + '님이 비활성화 되었습니다.');
            setModalOpen(false);
            setSelectedUser(null);
        } catch (error) {
            alert('비활성화에 실패했습니다.');
            setLoading(false);
        }
    };

    // 활성화 기능
    const handleActivate = async () => {
        if (!selectedUser) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:2866/user/active/${selectedUser.userId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // 성공 시 목록 새로고침
            const fetchUsers = async () => {
                try {
                    setLoading(true);
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://localhost:2866/user/list', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUsers(response.data || []);
                    setError(null);
                } catch (error) {
                    setError('유저 목록을 불러오는데 실패했습니다.');
                } finally {
                    setLoading(false);
                }
            };
            await fetchUsers();
            toast.success(`${selectedUser.userId}` + '님이 활성화 되었습니다.');
            setModalOpen(false);
            setSelectedUser(null);
        } catch (error) {
            alert('활성화에 실패했습니다.');
            setLoading(false);
        }
    };

    // 회원정보 삭제 기능
    const handleDelete = async () => {
        if (!selectedUser) return;
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            await axios.put(
                `http://localhost:2866/user/delete/${selectedUser.userId}`,
                {}, // PUT이므로 body가 필요 없을 경우 빈 객체 전달
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            // 성공 시 목록 새로고침
            const fetchUsers = async () => {
                try {
                    setLoading(true);
                    const token = localStorage.getItem('token');
                    const response = await axios.get('http://localhost:2866/user/list', {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    setUsers(response.data || []);
                    setError(null);
                } catch (error) {
                    setError('유저 목록을 불러오는데 실패했습니다.');
                } finally {
                    setLoading(false);
                }
            };
            await fetchUsers();
            toast.success(`${selectedUser.userId}님이 삭제되었습니다.`);
            setModalOpen(false);
            setSelectedUser(null);
        } catch (error) {
            alert('회원정보 삭제에 실패했습니다.');
            setLoading(false);
        }
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
                회원 목록
            </Typography>
            {sortedUsers.length === 0 ? (
                <Alert severity="info">회원이 없습니다.</Alert>
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
                                            sx={{ backgroundColor: '#40A0BC', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
                                            sortDirection={orderBy === col.id ? order : false}
                                        >
                                            <TableSortLabel
                                                active={orderBy === col.id}
                                                direction={orderBy === col.id ? order : 'asc'}
                                                onClick={() => handleRequestSort(col.id)}
                                                sx={{ color: 'white', '&.Mui-active': { color: 'white' } }}
                                            >
                                                {col.label}
                                            </TableSortLabel>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedUsers
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((user, idx) => (
                                        <TableRow
                                            key={user.userId + idx}
                                            sx={{ '&:nth-of-type(odd)': { backgroundColor: 'rgba(64, 160, 188, 0.05)' }, '&:hover': { backgroundColor: 'rgba(64, 160, 188, 0.1)' }, cursor: 'pointer' }}
                                            onClick={() => handleRowClick(user)}
                                        >
                                            <TableCell align="center">{user.userId}</TableCell>
                                            <TableCell align="center">{user.userName}</TableCell>
                                            <TableCell align="center">{user.userDp}</TableCell>
                                            <TableCell align="center">{user.userPhone}</TableCell>
                                            <TableCell align="center">{user.userStatus}</TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10]}
                        component="div"
                        count={sortedUsers.length}
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
            {/* 유저 상세 모달 */}
            <Dialog open={modalOpen} onClose={handleCloseModal} maxWidth="xs" fullWidth>
                <DialogTitle>회원 정보</DialogTitle>
                <DialogContent>
                    {selectedUser && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle1">아이디: {selectedUser.userId}</Typography>
                            <Typography variant="subtitle1">이름: {selectedUser.userName}</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    {selectedUser?.userStatus === 'INACTIVE' ? (
                        <MuiButton onClick={handleActivate} color="success" variant="contained">활성화</MuiButton>
                    ) : (
                        <MuiButton onClick={handleDeactivate} color="warning" variant="contained">비활성화</MuiButton>
                    )}
                    <MuiButton onClick={handleDelete} color="error" variant="contained">회원정보 삭제</MuiButton>
                    <MuiButton onClick={handleCloseModal} color="primary" variant="outlined">닫기</MuiButton>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default UserManagement;

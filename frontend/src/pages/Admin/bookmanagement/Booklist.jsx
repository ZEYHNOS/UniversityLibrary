import React, { useState, useEffect } from 'react';
import {Container,Table,TableBody,TableCell,TableContainer,TableHead,TableRow,Paper,Typography,CircularProgress,Alert,TablePagination,Box,TextField,Select,MenuItem,FormControl,InputLabel,Grid,Stack,TableSortLabel} from '@mui/material';
import axios from 'axios';
import Logo from '../../../components/Logo';
import BookModal from './BookModal';

const columns = [
    { id: 'bookId', label: '일련번호', align: 'center', sortable: true },
    { id: 'bookImageUrl', label: '이미지', align: 'center', sortable: false },
    { id: 'bookTitle', label: '제목', align: 'left', sortable: true },
    { id: 'bookAuthor', label: '저자', align: 'left', sortable: true },
    { id: 'bookPublisher', label: '출판사', align: 'left', sortable: true },
    { id: 'bookYear', label: '출판년도', align: 'center', sortable: true },
    { id: 'bookPrice', label: '가격', align: 'right', sortable: false },
    { id: 'categoryName', label: '카테고리', align: 'center', sortable: false },
    { id: 'bookStatus', label: '상태', align: 'center', sortable: false },
];

const Booklist = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage] = useState(10);
    const [searchCategory, setSearchCategory] = useState('title');
    const [searchQuery, setSearchQuery] = useState('');
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('bookId');
    const [selectedBook, setSelectedBook] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    // fetchBooks를 useEffect 밖으로 분리
    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:2866/api/book/list');
            setBooks(response.data || []);
            setError(null);
        } catch (error) {
            setError('책 목록을 불러오는데 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleSearchCategoryChange = (event) => {
        setSearchCategory(event.target.value);
    };

    const handleSearchQueryChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // 정렬 함수
    function descendingComparator(a, b, orderBy) {
        if (orderBy === 'bookYear') {
            // 출판년도는 문자열이지만 날짜로 변환해서 비교
            return new Date(b[orderBy]) - new Date(a[orderBy]);
        }
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

    const filteredBooks = books.filter(book => {
        const searchValue = searchQuery.toLowerCase();
        switch (searchCategory) {
            case 'title':
                return book.bookTitle.toLowerCase().includes(searchValue);
            case 'author':
                return book.bookAuthor.toLowerCase().includes(searchValue);
            case 'publisher':
                return book.bookPublisher.toLowerCase().includes(searchValue);
            case 'year':
                return book.bookYear.includes(searchValue);
            default:
                return true;
        }
    });

    const sortedBooks = stableSort(filteredBooks, getComparator(order, orderBy));

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
        <Container maxWidth={false} sx={{ mt: 4, mb: 4, maxWidth: '1300px' }}>
            <Logo />
            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                <Grid item>
                    <Typography 
                        variant="h4" 
                        component="h1" 
                        sx={{ color: '#40A0BC', fontWeight: 'bold' }}
                    >
                        도서 목록
                    </Typography>
                </Grid>
                <Grid item>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <FormControl size="small">
                            <InputLabel id="search-category-label">검색 카테고리</InputLabel>
                            <Select
                                labelId="search-category-label"
                                value={searchCategory}
                                label="검색 카테고리"
                                onChange={handleSearchCategoryChange}
                                sx={{
                                    minWidth: 100,
                                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#40A0BC' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#40A0BC' },
                                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#40A0BC' },
                                }}
                            >
                                <MenuItem value="title">제목</MenuItem>
                                <MenuItem value="author">저자</MenuItem>
                                <MenuItem value="publisher">출판사</MenuItem>
                                <MenuItem value="year">출판년도</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            size="small"
                            label="검색어를 입력하세요"
                            value={searchQuery}
                            onChange={handleSearchQueryChange}
                            sx={{
                                minWidth: 220,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#40A0BC' },
                                    '&:hover fieldset': { borderColor: '#40A0BC' },
                                    '&.Mui-focused fieldset': { borderColor: '#40A0BC' },
                                },
                                '& .MuiInputLabel-root': { color: '#40A0BC' },
                                '& .MuiInputLabel-root.Mui-focused': { color: '#40A0BC' },
                            }}
                        />
                    </Stack>
                </Grid>
            </Grid>
            {sortedBooks.length === 0 ? (
                <Alert severity="info">검색 결과가 없습니다.</Alert>
            ) : (
                <Paper 
                    sx={{ 
                        width: '100%', 
                        minWidth: 1300, 
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px rgba(64, 160, 188, 0.1)'
                    }}
                >
                    <TableContainer sx={{ maxHeight: 600, minWidth: 1300, overflowX: 'hidden' }}>
                        <Table stickyHeader sx={{ minWidth: 1300 }}>
                            <TableHead>
                                <TableRow>
                                    {columns.map((col) => (
                                        <TableCell
                                            key={col.id}
                                            align={col.align}
                                            sx={{ backgroundColor: '#40A0BC', color: 'white', fontWeight: 'bold', cursor: col.sortable ? 'pointer' : 'default' }}
                                            sortDirection={orderBy === col.id ? order : false}
                                        >
                                            {col.sortable ? (
                                                <TableSortLabel
                                                    active={orderBy === col.id}
                                                    direction={orderBy === col.id ? order : 'asc'}
                                                    onClick={() => handleRequestSort(col.id)}
                                                    sx={{ color: 'white', '&.Mui-active': { color: 'white' } }}
                                                >
                                                    {col.label}
                                                </TableSortLabel>
                                            ) : (
                                                col.label
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sortedBooks
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((book, index) => (
                                        <TableRow 
                                            key={book.bookId}
                                            sx={{
                                                '&:nth-of-type(odd)': { backgroundColor: 'rgba(64, 160, 188, 0.05)' },
                                                '&:hover': { backgroundColor: 'rgba(64, 160, 188, 0.1)', cursor: 'pointer' }
                                            }}
                                            onClick={() => { setSelectedBook(book); setModalOpen(true); }}
                                        >
                                            <TableCell align="center">{book.bookId}</TableCell>
                                            <TableCell align="center">
                                                <Box
                                                    component="img"
                                                    src={book.bookImageUrl}
                                                    alt={book.bookTitle}
                                                    sx={{
                                                        width: 100,
                                                        height: 140,
                                                        objectFit: 'contain',
                                                        borderRadius: 1,
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 'medium' }}>{book.bookTitle}</TableCell>
                                            <TableCell>{book.bookAuthor}</TableCell>
                                            <TableCell>{book.bookPublisher}</TableCell>
                                            <TableCell align="center">{book.bookYear}</TableCell>
                                            <TableCell align="right" sx={{ color: '#40A0BC', fontWeight: 'bold' }}>{book.bookPrice.toLocaleString()}원</TableCell>
                                            <TableCell align="center">{book.categoryName}</TableCell>
                                            <TableCell align="center">
                                                {book.bookStatus === 'Y' ? (
                                                    <span style={{ color: 'green', fontWeight: 'bold' }}>대출가능</span>
                                                ) : (
                                                    <span style={{ color: 'red', fontWeight: 'bold' }}>대출불가능</span>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10]}
                        component="div"
                        count={sortedBooks.length}
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
            {selectedBook && (
                <BookModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    book={selectedBook}
                    onUpdate={() => {
                        fetchBooks();
                        setModalOpen(false);
                    }}
                    onDelete={() => {
                        fetchBooks();
                        setModalOpen(false);
                    }}
                    onReload={fetchBooks}
                />
            )}
        </Container>
    );
};

export default Booklist;

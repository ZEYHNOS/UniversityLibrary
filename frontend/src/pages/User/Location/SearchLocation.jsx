import React, { useState } from 'react';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, CircularProgress, Alert, Box, Modal, FormControl, InputLabel, Select, MenuItem, Stack } from '@mui/material';
import axios from 'axios';
import Logo from '../../../components/Logo';
import Input from '../../../components/Input';
import Button from '../../../components/Button';

const columns = [
    { id: 'bookId', label: '일련번호', align: 'center' },
    { id: 'bookImageUrl', label: '이미지', align: 'center' },
    { id: 'bookTitle', label: '제목', align: 'left' },
    { id: 'bookAuthor', label: '저자', align: 'left' },
    { id: 'bookPublisher', label: '출판사', align: 'left' },
    { id: 'bookYear', label: '출판년도', align: 'center' },
    { id: 'categoryName', label: '카테고리', align: 'center' },
    { id: 'bookStatus', label: '상태', align: 'center' },
];

const SearchLocation = () => {
    const [searchCategory, setSearchCategory] = useState('title');
    const [searchQuery, setSearchQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);

    const handleSearch = async () => {
        setLoading(true);
        setError(null);
        setBooks([]);
        try {
            const res = await axios.get('http://localhost:2866/api/book/search', {
                params: {
                    type: searchCategory,
                    keyword: searchQuery,
                }
            });
            setBooks(res.data);
        } catch (err) {
            setError('검색 결과를 불러오지 못했습니다.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Logo />
            <Typography variant="h4" sx={{ color: '#40A0BC', fontWeight: 'bold', mb: 3, mt: 2 }}>
                도서 위치 검색
            </Typography>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    handleSearch();
                }}
                style={{ width: '100%' }}
            >
                <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    sx={{ mb: 3, width: '100%', justifyContent: 'center' }}
                >
                    <FormControl
                        size="small"
                        sx={{ minWidth: 120, height: 44, justifyContent: 'center', background: '#fff' }}
                    >
                        <InputLabel id="search-category-label">검색 카테고리</InputLabel>
                        <Select
                            labelId="search-category-label"
                            value={searchCategory}
                            label="검색 카테고리"
                            onChange={e => setSearchCategory(e.target.value)}
                            sx={{
                                height: 44,
                                display: 'flex',
                                alignItems: 'center',
                                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#40A0BC' },
                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#40A0BC' },
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#40A0BC' },
                                background: '#fff',
                            }}
                        >
                            <MenuItem value="title">제목</MenuItem>
                            <MenuItem value="author">저자</MenuItem>
                            <MenuItem value="publisher">출판사</MenuItem>
                            <MenuItem value="year">출판년도</MenuItem>
                        </Select>
                    </FormControl>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                        <Input
                            placeholder="검색어를 입력하세요"   
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            required
                            style={{ minWidth: 180, maxWidth: 400, width: '100%', height: 44, display: 'flex', alignItems: 'center', background: '#fff' }}
                        />
                    </Box>
                    <Button
                        type="submit"
                        style={{ minWidth: 90, height: 44, padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', background: '#fff' }}
                    >
                        검색
                    </Button>
                </Stack>
            </form>
            {loading && <CircularProgress sx={{ color: '#40A0BC' }} />}
            {error && <Alert severity="error">{error}</Alert>}
            {books.length > 0 && (
                <Paper sx={{ width: '100%', overflow: 'auto', boxShadow: '0 4px 6px rgba(64, 160, 188, 0.1)' }}>
                    <TableContainer sx={{ minWidth: 1100 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    {columns.map(col => (
                                        <TableCell key={col.id} align={col.align} sx={{ backgroundColor: '#40A0BC', color: 'white', fontWeight: 'bold' }}>
                                            {col.label}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {books.map(book => (
                                    <TableRow
                                        key={book.bookId}
                                        hover
                                        sx={{ cursor: 'pointer' }}
                                        onClick={() => setSelectedBook(book)}
                                    >
                                        <TableCell align="center">{book.bookId}</TableCell>
                                        <TableCell align="center">
                                            <Box
                                                component="img"
                                                src={book.bookImageUrl}
                                                alt={book.bookTitle}
                                                sx={{
                                                    width: 80,
                                                    height: 110,
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
                </Paper>
            )}
            {/* 위치 정보 모달/아래 표시 */}
            <Modal open={!!selectedBook} onClose={() => setSelectedBook(null)}>
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', p: 4, borderRadius: 2, boxShadow: 24, minWidth: 400, maxWidth: 600 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        {selectedBook?.bookTitle} 의 위치는
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: '2.4rem',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            background: 'linear-gradient(90deg, #40A0BC, #7ed957, #f9d423, #ff4e50, #40A0BC)',
                            backgroundSize: '200% auto',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            textShadow: '0 0 8px #fff, 0 0 16px #40A0BC',
                            animation: 'shine 1s linear infinite, pop 1.2s ease-in-out infinite',
                            mb: 2,
                            mt: 1,
                            '@keyframes shine': {
                                to: {
                                    backgroundPosition: '200% center'
                                }
                            },
                            '@keyframes pop': {
                                '0%': { transform: 'scale(1)' },
                                '30%': { transform: 'scale(1.13)' },
                                '60%': { transform: 'scale(0.95)' },
                                '100%': { transform: 'scale(1)' }
                            }
                        }}
                    >
                        {selectedBook?.categoryLocation || '위치 정보가 없습니다.'} <b>입니다!</b>
                    </Typography>
                    <Button onClick={() => setSelectedBook(null)} className='w-full'>
                        닫기
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
};

export default SearchLocation;
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Box, IconButton, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { toast } from 'react-toastify';

const BookModal = ({ open, onClose, book, onUpdate, onDelete, onReload }) => {
    const [editBook, setEditBook] = useState({ ...book, category_id: book.category_id || '', });
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);

    // 도서 정보 초기화 함수
    useEffect(() => {
        setEditBook({ ...book, category_id: book.category_id || '' });
        setEditMode(false);
    }, [book]);

    // 카테고리 목록 조회 함수
    useEffect(() => {
        if (editMode) {
            const fetchCategories = async () => {
                try {
                    const res = await axios.get('http://localhost:2866/api/category/list');
                    setCategories(res.data);
                } catch (error) {
                    setCategories([]);
                }
            };
            fetchCategories();
        }
    }, [editMode]);

    // 도서 정보 변경 함수
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditBook(prev => ({ ...prev, [name]: value }));
    };

    // 도서 수정 함수
    const handleUpdate = async () => {
        setLoading(true);
        try {
            const payload = {
                bookTitle: editBook.bookTitle,
                bookAuthor: editBook.bookAuthor,
                bookPublisher: editBook.bookPublisher,
                bookYear: editBook.bookYear,
                bookPrice: Number(editBook.bookPrice),
                category_id: editBook.category_id,
            };
            const res = await axios.put(`http://localhost:2866/api/book/update/${editBook.bookId}`, payload);
            onUpdate(res.data);
            toast.success('책 정보가 수정되었습니다.');
        } catch (err) {
            toast.error('책 정보 수정에 실패했습니다.');
        } finally {
            setLoading(false);
        }
    };

    // 도서 삭제 함수
    const handleDelete = async () => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            console.log("[JWT 토큰]", token);
            await axios.delete(
                `http://localhost:2866/api/book/delete/${book.bookId}`,
                {   
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            toast.success('책 정보가 삭제되었습니다.');
            onDelete(book.bookId);
        } catch (err) {
            toast.error('책 정보 삭제에 실패했습니다.');
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    // 카테고리명 찾기 (표시용)
    const getCategoryName = (id) => {
        const found = categories.find(cat => cat.category_id === id);
        return found ? found.categoryName : editBook.categoryName || '';
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                도서 정보
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 8, top: 8 }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                    <Box
                        component="img"
                        src={editBook.bookImageUrl}
                        alt={editBook.bookTitle}
                        sx={{ width: 120, height: 170, objectFit: 'contain', borderRadius: 1, boxShadow: 1 }}
                    />
                    <TextField
                        label="제목"
                        name="bookTitle"
                        value={editBook.bookTitle || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                        disabled={!editMode}
                    />
                    <TextField
                        label="저자"
                        name="bookAuthor"
                        value={editBook.bookAuthor || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                        disabled={!editMode}
                    />
                    <TextField
                        label="출판사"
                        name="bookPublisher"
                        value={editBook.bookPublisher || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                        disabled={!editMode}
                    />
                    <TextField
                        label="출판일자"
                        name="bookYear"
                        type="date"
                        value={editBook.bookYear ? editBook.bookYear.slice(0, 10) : ''}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                        disabled={!editMode}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="가격"
                        name="bookPrice"
                        value={editBook.bookPrice || ''}
                        onChange={handleChange}
                        fullWidth
                        margin="dense"
                        disabled={!editMode}
                    />
                    {editMode ? (
                        <FormControl fullWidth margin="dense">
                            <InputLabel id="category-label">카테고리</InputLabel>
                            <Select
                                labelId="category-label"
                                name="category_id"
                                value={editBook.category_id || ''}
                                label="카테고리"
                                onChange={handleChange}
                            >
                                {categories.map((cat, idx) => (
                                    <MenuItem
                                        key={cat.category_id || cat.categoryId || idx}
                                        value={cat.category_id || cat.categoryId}
                                        className="text-black"
                                    >
                                        {cat.categoryName} ({cat.category_id || cat.categoryId})
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    ) : (
                        <TextField
                            label="카테고리"
                            name="categoryName"
                            value={getCategoryName(editBook.category_id)}
                            fullWidth
                            margin="dense"
                            disabled
                        />
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                {editMode ? (
                    <>
                        <Button onClick={() => setEditMode(false)} disabled={loading}>취소</Button>
                        <Button
                            onClick={async () => {
                                await handleUpdate();
                                onClose();
                            }}
                            disabled={loading}
                            variant="contained"
                            color="primary"
                        >
                            저장
                        </Button>
                    </>
                ) : (
                    <>
                        <Button onClick={() => setEditMode(true)} disabled={loading}>수정</Button>
                        <Button
                            onClick={async () => {
                                await handleDelete();
                                onClose();
                            }}
                            disabled={loading}
                            color="error"
                        >
                            삭제
                        </Button>
                        <Button
                            onClick={() => {
                                onClose();
                                if (typeof onReload === 'function') onReload();
                            }}
                            disabled={loading}
                        >
                            닫기
                        </Button>
                    </>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default BookModal; 
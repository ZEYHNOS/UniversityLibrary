import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddBook = () => {
    const [formData, setFormData] = useState({
        category_id: '',
        book_title: '',
        book_author: '',
        book_publisher: '',
        book_year: '',
        book_price: '',
        book_img_url: ''
    });
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const [dragActive, setDragActive] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get('http://localhost:2866/api/category/list');
                setCategories(res.data);
            } catch (error) {
                setCategories([]);
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    // 드래그&드롭 이벤트 핸들러
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    };
    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setImageFile(e.dataTransfer.files[0]);
        }
    };
    // input 클릭 핸들러
    const imageInputRef = React.useRef();
    const handleImageBoxClick = () => {
        imageInputRef.current.click();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('로그인이 필요합니다.');
                return;
            }

            let imageUrl = '';
            if (imageFile) {
                const imgForm = new FormData();
                imgForm.append('image', imageFile);
                const imgRes = await axios.post('http://localhost:2866/api/book/upload/images', imgForm, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('[이미지 업로드 응답]', imgRes.data);
                imageUrl = imgRes.data;
            }

            const bookData = {
                ...formData,
                book_img_url: imageUrl
            };
            console.log('[최종 bookData]', bookData);

            const result = await axios.post('http://localhost:2866/api/book/add', bookData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('[책 추가 응답]', result.data);
            toast.success('도서가 성공적으로 추가되었습니다.');
            setFormData({
                category_id: '',
                book_title: '',
                book_author: '',
                book_publisher: '',
                book_year: '',
                book_price: '',
                book_img_url: ''
            });
            setImageFile(null);
            navigate('/');
        } catch (error) {
            toast.error('도서 추가 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
            <Logo />
            <div className="w-full max-w-md bg-white py-8 px-6 shadow-lg rounded-lg">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-gray-900">도서 추가</h2>
                    <Button onClick={() => navigate('/')} className="w-auto px-2 py-0.5 text-base">이전</Button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div
                        className={`flex flex-col items-center justify-center mb-4 border-2 border-dashed rounded cursor-pointer transition-all ${dragActive ? 'border-blue-400 bg-blue-50' : 'border-[#40A0BC] bg-gray-50'}`}
                        style={{ minHeight: '230px' }}
                        onClick={handleImageBoxClick}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {imageFile ? (
                            <img
                                src={URL.createObjectURL(imageFile)}
                                alt="미리보기"
                                className="w-40 h-56 object-cover rounded shadow mb-2 border"
                            />
                        ) : (
                            <span className="text-gray-400 text-sm">이미지를 드래그하거나 클릭해서 추가하세요</span>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            ref={imageInputRef}
                            className="hidden"
                        />
                        <span className="text-xs text-gray-500 mt-2">미리보기</span>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">카테고리</label>
                        <div className="flex items-end gap-2">
                            <div className="flex-1">
                                <select
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleChange}
                                    required
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="" disabled>카테고리를 선택하세요</option>
                                    {categories.map(cat => (
                                        <option key={cat.categoryId} value={cat.categoryId}>
                                            {cat.categoryName} ({cat.categoryId})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <Button
                                type="button"
                                onClick={() => navigate('/admin/addcategory')}
                                className="w-auto px-2 py-0.5 text-base"
                            >
                                추가
                            </Button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">제목</label>
                        <input
                            type="text"
                            name="book_title"
                            value={formData.book_title}
                            onChange={handleChange}
                            required
                            placeholder="예: 해리포터"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">저자</label>
                        <input
                            type="text"
                            name="book_author"
                            value={formData.book_author}
                            onChange={handleChange}
                            required
                            placeholder="예: J.K. 롤링"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">출판사</label>
                        <input
                            type="text"
                            name="book_publisher"
                            value={formData.book_publisher}
                            onChange={handleChange}
                            required
                            placeholder="예: 문학동네"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">출간년도</label>
                        <input
                            type="date"
                            name="book_year"
                            value={formData.book_year}
                            onChange={handleChange}
                            placeholder="yyyy-mm-dd"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">가격</label>
                        <input
                            type="number"
                            name="book_price"
                            value={formData.book_price}
                            onChange={handleChange}
                            required
                            placeholder="예: 15000"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <Button type="submit" className="w-full">책 추가하기</Button>
                </form>
            </div>
        </div>
    );
};

export default AddBook;

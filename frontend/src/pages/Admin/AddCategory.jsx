import React, { useState } from 'react';
import axios from 'axios';
import Logo from '../../components/Logo';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddCategory = () => {
    const [formData, setFormData] = useState({
        categoryId: '',
        categoryName: '',
        categoryLocation: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('로그인이 필요합니다.');
                return;
            }

            await axios.post('http://localhost:2866/api/category/add', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            toast.success('카테고리가 성공적으로 추가되었습니다.');
            setFormData({
                categoryId: '',
                categoryName: '',
                categoryLocation: ''
            });
            setTimeout(() => navigate('/admin/addbook'), 100);
        } catch (error) {
            if (error.response?.status === 403) {
                toast.error('관리자 권한이 필요합니다.');
            } else {
                toast.error('카테고리 추가 중 오류가 발생했습니다.');
            }
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                <div className="w-full max-w-md flex flex-col items-center">
                    <Logo />
                    <div className="mt-8 w-full">
                        <div className="bg-white py-8 px-6 shadow-lg rounded-lg">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold text-gray-900">카테고리 추가</h2>
                                <Button onClick={() => navigate('/admin/addbook')} className="w-auto px-2 py-0.5 text-base">이전</Button>
                            </div>
                        
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                                        카테고리 ID
                                    </label>
                                    <input
                                        type="text"
                                        id="categoryId"
                                        name="categoryId"
                                        value={formData.categoryId}
                                        onChange={handleChange}
                                        required
                                        placeholder="예: 001"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
                                        카테고리명
                                    </label>
                                    <input
                                        type="text"
                                        id="categoryName"
                                        name="categoryName"
                                        value={formData.categoryName}
                                        onChange={handleChange}
                                        required
                                        placeholder="예: 문학"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="categoryLocation" className="block text-sm font-medium text-gray-700">
                                        도서위치
                                    </label>
                                    <input
                                        type="text"
                                        id="categoryLocation"
                                        name="categoryLocation"
                                        value={formData.categoryLocation}
                                        onChange={handleChange}
                                        required
                                        placeholder="예: A열 1, 2층 "
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    />
                                </div>

                                <Button type="submit" className="w-full">카테고리 추가</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCategory;

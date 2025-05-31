import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import api from '../api/axiosInstance';
import Logo from '../components/Logo';
import Input from '../components/Input';
import Button from '../components/Button';

const Signin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        user_id: '',
        user_pw: ''
    });

    const [error, setError] = useState('');

    const handleChange = (field) => (e) => {
        setFormData({
            ...formData,
            [field]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/user/signin', formData);
            const token = response.data.token;
            
            if (token) {
                // 토큰 저장
                localStorage.setItem('token', token);
                
                // 토큰 디코딩
                const decodedToken = jwtDecode(token);
                
                // 사용자 정보 저장
                const userInfo = {
                    user_id: decodedToken.sub,
                    user_name: decodedToken.userName,
                    user_role: decodedToken.userRole
                };
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                
                // 메인 페이지로 이동
                navigate('/');
            } else {
                throw new Error('토큰이 없습니다.');
            }
        } catch (err) {
            console.error('로그인 실패:', err);
            setError('아이디 또는 비밀번호가 올바르지 않습니다.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
            <div className="w-full max-w-md">
                <div className="mb-8">
                    <Logo />
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <Input
                        label="아이디"
                        value={formData.user_id}
                        onChange={handleChange('user_id')}
                        required
                    />
                    <Input
                        label="비밀번호"
                        type="password"
                        value={formData.user_pw}
                        onChange={handleChange('user_pw')}
                        required
                    />
                    <div className="pt-4">
                        <Button>로그인</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signin;

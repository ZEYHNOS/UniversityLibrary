import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import { toast } from 'react-toastify';

// axios 기본 설정
axios.defaults.withCredentials = true; // 쿠키 포함 설정

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        user_id: '',
        user_pw: '',
        user_name: '',
        user_dp: '',
        user_phone: ''
    });

    const [error, setError] = useState('');

    const affiliationOptions = [
        { value: '컴퓨터공학과', label: '컴퓨터공학과' },
        { value: '간호학과', label: '간호학과' },
        { value: '전기공학과', label: '전기공학과' },
        { value: '기계공학과', label: '기계공학과' },
        { value: '미디어디지털과', label: '미디어디지털과' },
        { value: '교수', label: '교수' },
        { value: '교직원', label: '교직원' }
    ];

    const handleChange = (field) => (e) => {
        setFormData({
            ...formData,
            [field]: e.target.value
        });
        setError(''); // 입력 시 에러 메시지 초기화
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/user/signup', formData, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            toast.success('회원가입이 완료되었습니다.');
            setTimeout(() => navigate('/'), 100);
        } catch (err) {
            toast.error('회원가입 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white p-6">
            <div className="w-full max-w-md">
                <div className="mb-8" >
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
                    <Input
                        label="이름"
                        value={formData.user_name}
                        onChange={handleChange('user_name')}
                        required
                    />
                    <Select
                        label="소속"
                        value={formData.user_dp}
                        onChange={handleChange('user_dp')}
                        options={affiliationOptions}
                        required
                    />
                    <Input
                        label="전화번호"
                        type="tel"
                        value={formData.user_phone}
                        onChange={handleChange('user_phone')}
                        required
                    />
                    <div className="pt-4">
                        <Button type="submit" className="w-full">회원가입 완료</Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../../../components/Logo';
import Button from '../../../components/Button';

const Management = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">
            <div className="flex flex-col items-center justify-center min-h-screen p-6">
                <div className="w-full max-w-md flex flex-col items-center">
                <Logo />
                    <div className="mt-8 w-full flex flex-col items-center gap-2">
                        <Button onClick={() => navigate('/admin/usermanagement/signup')} className="w-full">회원 추가</Button>
                        <Button onClick={() => navigate('/admin/usermanagement/userlist')} className="w-full">회원 조회</Button>
                        <Button onClick={() => navigate('/admin/usermanagement/loanlist')} className="w-full">대출내역 조회</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Management;

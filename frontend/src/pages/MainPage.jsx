import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';

const MainPage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // 로컬 스토리지에서 사용자 정보 확인
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const parsedUserInfo = JSON.parse(userInfo);
      setIsLoggedIn(true);
      setUserRole(parsedUserInfo.user_role);
      setUserName(parsedUserInfo.user_name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    setIsLoggedIn(false);
    setUserRole(null);
    setUserName('');
    navigate('/');
  };

  const renderButtons = () => {
    if (!isLoggedIn) {
      return (
        <>
          <Button onClick={() => navigate('/signin')}>로그인 하기</Button>
          <Button onClick={() => navigate('/signup')}>회원가입</Button>
        </>
      );
    }

    if (userRole?.toUpperCase() === 'ADMIN') {
      return (
        <>
          <Button>대출 승인 및 반납</Button>
          <Button>도서 등록 및 삭제</Button>
          <Button>도서 상태 관리</Button>
          <Button>사용자 정보 수정</Button>
        </>
      );
    }

    return (
      <>
        <Button>도서 검색하기</Button>
        <Button>이용내역 조회</Button>
        <Button>도서 위치찾기</Button>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {isLoggedIn && (
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-end items-center gap-4">
            <span className="text-gray-700">
              환영합니다, {userName}님!
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-500 border border-red-500 rounded-full hover:bg-red-50 transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-6">
        <div className="w-full max-w-md flex flex-col items-center">
          <Logo />
          <div className="mt-8 w-full flex flex-col items-center gap-2">
            {renderButtons()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainPage; 
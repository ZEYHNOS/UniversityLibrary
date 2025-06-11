import React, { useState } from 'react';
import Logo from '../../../components/Logo';
import Button from '../../../components/Button';
import Input from '../../../components/Input';
import axios from 'axios';

const LoanPage = () => {
    const [mode, setMode] = useState('loan'); 
    const [userId, setUserId] = useState('');
    const [bookId, setBookId] = useState('');
    const [loanList, setLoanList] = useState([]); // 대출 내역 (반납 모드에서 사용)

    // 대출 진행
    const handleLoan = async () => {
        try {
            const response = await axios.post('http://localhost:2866/api/loan/create', {
                userId: userId,
                bookId: bookId,
            });
            alert(response.data); // "대출 등록 완료" 등
        } catch (error) {
            if (error.response) {
                alert(error.response.data || '대출 요청 실패');
            } else {
                alert('서버 오류');
            }
        }
    };

    // 대출 내역 조회
    const handleSearchLoans = async () => {
        try {
            const res = await axios.get(`http://localhost:2866/api/loan/return/not?userId=${userId}`);
            setLoanList(res.data); // [{loanId, bookTitle, loanStart}, ...]
        } catch (err) {
            console.log(err);
            alert('대출 내역 조회 실패');
        }
    };

    // 반납 진행
    const handleReturn = async (loanId) => {
        try {
            console.log(loanId);
            const res = await axios.patch(`http://localhost:2866/api/loan/return/${loanId}`);
            alert(res.data);
            handleSearchLoans(); // 반납 후 대출 내역 새로고침
        } catch (err) {
            if (err.response) {
                alert(err.response.data || '반납 요청 실패');
            } else {
                alert('서버 오류');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Logo />
        <div className="flex gap-4 mt-8">
            <Button
            className={`border-2 border-[#40A0BC] ${mode === 'loan' ? 'bg-[#40A0BC] text-white' : 'bg-white text-[#40A0BC]'}`}
            onClick={() => setMode('loan')}
            >
            대출
            </Button>
            <Button
            className={`border-2 border-[#40A0BC] ${mode === 'return' ? 'bg-[#40A0BC] text-white' : 'bg-white text-[#40A0BC]'}`}
            onClick={() => setMode('return')}
            >
            반납
            </Button>
        </div>

        {mode === 'loan' && (
            <div className="w-96 mt-10 flex flex-col gap-6 items-center">
            <Input
                label="유저 ID"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                required
            />
            <Input
                label="책 ID"
                value={bookId}
                onChange={e => setBookId(e.target.value)}
                required
            />
            <Button className="w-full" onClick={handleLoan}>
                대출 진행
            </Button>
            </div>
        )}

        {mode === 'return' && (
            <div className="w-96 mt-10 flex flex-col gap-6 items-center">
            <Input
                label="유저 ID"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                required
            />
            <Button className="w-full" onClick={handleSearchLoans}>
                대출 내역 조회
            </Button>
            {loanList.length > 0 && (
                <div className="w-full mt-4">
                {loanList.map(loan => (
                    <div key={loan.loanId} className="flex justify-between items-center border-b py-2">
                    <div>
                        <div className="font-semibold">{loan.bookTitle}</div>
                        <div className="text-xs text-gray-500">
                            대출일: {new Date(loan.loanStart).toLocaleString()}
                        </div>
                    </div>
                    <Button className="px-3 py-1" onClick={() => handleReturn(loan.loanId)}>
                        반납
                    </Button>
                    </div>
                ))}
                </div>
            )}
            </div>
        )}
        </div>
    );
};

export default LoanPage;

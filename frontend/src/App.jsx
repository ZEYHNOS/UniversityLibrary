import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Toast from './components/Toast';

import MainPage from './pages/MainPage';
import Signup from './pages/Sign/Signup';
import Signin from './pages/Sign/Signin';
import SearchBookList from './pages/User/BookList/SearchBookList';
import SearchLocation from './pages/User/Location/SearchLocation';
import LoanList from './pages/User/LoanList/LoanList';

import AddCategory from './pages/Admin/Add/AddCategory';
import AddBook from './pages/Admin/Add/AddBook';
import Booklist from './pages/Admin/BookManagement/BookList';
import Loan from './pages/Admin/Loan/Loan';
import Management from './pages/Admin/UserManagement/Management';
import UserManagement from './pages/Admin/UserManagement/UserManagement';
import LoanManagement from './pages/Admin/UserManagement/LoanManagement';

function App() {
  return (
    <Router>
      <Toast />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signin" element={<Signin />} />
        {/* 사용자 페이지 */}
        <Route path="/searchbooklist" element={<SearchBookList />} />
        <Route path="/searchlocation" element={<SearchLocation />} />
        <Route path="/loanlist" element={<LoanList />} />

        {/* 관리자 페이지 */}
        <Route path="/admin/addcategory" element={<AddCategory />} />
        <Route path="/admin/addbook" element={<AddBook />} />
        <Route path="/admin/booklist" element={<Booklist />} />
        <Route path="/admin/loan" element={<Loan />} />
        <Route path="/admin/usermanagement" element={<Management />} />
        <Route path="/admin/usermanagement/signup" element={<Signup />} />
        <Route path="/admin/usermanagement/userlist" element={<UserManagement />} />
        <Route path="/admin/usermanagement/loanlist" element={<LoanManagement />} />
      </Routes>
    </Router>
  );
}

export default App;

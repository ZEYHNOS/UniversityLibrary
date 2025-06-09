import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Toast from './components/Toast';

import MainPage from './pages/MainPage';
import Signup from './pages/Sign/Signup';
import Signin from './pages/Sign/Signin';
import SearchBookList from './pages/User/BookList/SearchBookList';
import SearchLocation from './pages/User/Location/SearchLocation';
import AddCategory from './pages/Admin/add/AddCategory';
import AddBook from './pages/Admin/add/AddBook';
import Booklist from './pages/Admin/bookmanagement/booklist';
import Loan from './pages/Admin/loan/loan';

function App() {
  return (
    <Router>
      <Toast />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        {/* 사용자 페이지지 */}
        <Route path="/searchbooklist" element={<SearchBookList />} />
        <Route path="/searchlocation" element={<SearchLocation />} />
        
        {/* 관리자 페이지 */}
        <Route path="/admin/addcategory" element={<AddCategory />} />
        <Route path="/admin/addbook" element={<AddBook />} />
        <Route path="/admin/booklist" element={<Booklist />} />
        <Route path="/admin/loan" element={<Loan />} />
      </Routes>
    </Router>
  );
}

export default App;

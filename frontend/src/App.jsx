import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Toast from './components/Toast';

import MainPage from './pages/MainPage';
import Signup from './pages/Sign/Signup';
import Signin from './pages/Sign/Signin';
import AddCategory from './pages/Admin/add/AddCategory';
import AddBook from './pages/Admin/add/AddBook';
import Booklist from './pages/Admin/bookmanagement/booklist';

function App() {
  return (
    <Router>
      <Toast />
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />

        <Route path="/admin/addcategory" element={<AddCategory />} />
        <Route path="/admin/addbook" element={<AddBook />} />
        <Route path="/admin/booklist" element={<Booklist />} />
      </Routes>
    </Router>
  );
}

export default App;

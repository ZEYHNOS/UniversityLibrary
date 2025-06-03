import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Toast from './components/Toast';

import MainPage from './pages/MainPage';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import AddCategory from './pages/Admin/AddCategory';
import AddBook from './pages/Admin/AddBook';

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
      </Routes>
    </Router>
  );
}

export default App;

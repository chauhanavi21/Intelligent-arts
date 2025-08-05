import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Books from './pages/Books';
import Authors from './pages/Authors';
import AuthorProfile from './pages/AuthorProfile';
import Contact from './pages/Contact';
import Archives from './pages/Archives';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AdminAuthors from './pages/AdminAuthors';
import AdminTitles from './pages/AdminTitles';
import AdminBanners from './pages/AdminBanners';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/titles" element={<Books />} />
        <Route path="/books" element={<Navigate to="/titles" replace />} />
        <Route path="/authors" element={<Authors />} />
        <Route path="/authors/:authorId" element={<AuthorProfile />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/archives" element={<Archives />} />
        <Route path="/profile/:id" element={<Profile />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/authors" element={<AdminAuthors />} />
        <Route path="/admin/titles" element={<AdminTitles />} />
        <Route path="/admin/banners" element={<AdminBanners />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

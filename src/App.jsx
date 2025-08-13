// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Books from './pages/Books';
import Authors from './pages/Authors';
import AuthorProfile from './pages/AuthorProfile';
import ContactUs from './pages/ContactUs';
import Archives from './pages/Archives';
import About from './pages/About';
import Affiliates from './pages/Affiliates';

import Login from './pages/Login';
import BookDetail from './pages/BookDetail';
import Admin from './pages/Admin';
import AdminAuthors from './pages/AdminAuthors';
import AdminTitles from './pages/AdminTitles';
import AdminBanners from './pages/AdminBanners';

function App() {
  return (
    <AuthProvider>
      <div className="App font-[Lato]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Books />} />
          <Route path="/titles" element={<Navigate to="/books" replace />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/authors/:authorId" element={<AuthorProfile />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/about" element={<About />} />
          <Route path="/affiliates" element={<Affiliates />} />
          <Route path="/book/:bookId" element={<BookDetail />} />

          {/* Auth Routes */}
          <Route path="/admin-login" element={<Login />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin={true}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/authors"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminAuthors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/titles"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminTitles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/banners"
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminBanners />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;

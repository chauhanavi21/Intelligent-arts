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
import Contact from './pages/Contact';
import Archives from './pages/Archives';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import UserProfile from './pages/UserProfile';
import AdminProfile from './pages/AdminProfile';
import BookDetail from './pages/BookDetail';
import Admin from './pages/Admin';
import AdminAuthors from './pages/AdminAuthors';
import AdminTitles from './pages/AdminTitles';
import AdminBanners from './pages/AdminBanners';

function App() {
  return (
    <AuthProvider>
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
          <Route path="/book/:bookId" element={<BookDetail />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          } />
          <Route path="/admin-profile" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminProfile />
            </ProtectedRoute>
          } />
          
          {/* Protected Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute requireAdmin={true}>
              <Admin />
            </ProtectedRoute>
          } />
          <Route path="/admin/authors" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminAuthors />
            </ProtectedRoute>
          } />
          <Route path="/admin/titles" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminTitles />
            </ProtectedRoute>
          } />
          <Route path="/admin/banners" element={
            <ProtectedRoute requireAdmin={true}>
              <AdminBanners />
            </ProtectedRoute>
          } />
        </Routes>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;

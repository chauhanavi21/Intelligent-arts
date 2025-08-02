import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Books from './pages/Books';
import Archives from './pages/Archives';
import Contact from './pages/Contact';
import Authors from './pages/Authors';
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/books" element={<Books />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/authors" element={<Authors />} />
          <Route path="/authors/:authorId" element={<Authors />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;

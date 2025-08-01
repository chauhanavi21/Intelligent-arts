import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2">
        <img src="/logo.webp" alt="Logo" className="h-10 w-auto" />
      </Link>
      <div className="flex gap-6 text-sm md:text-base font-medium">
        <Link to="/">Home</Link>
        <Link to="/authors">Authors</Link>
        <Link to="/archives">Archives</Link>
        <Link to="/contact">Contact Us</Link>
      </div>
    </nav>
  );
};

export default Navbar;

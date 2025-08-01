// src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      <div className="text-2xl font-bold">Intelligent Arts</div>
      <div className="flex gap-6 text-sm md:text-base">
        <a href="#" className="hover:text-blue-600">Home</a>
        <a href="#" className="hover:text-blue-600">Authors</a>
        <a href="#" className="hover:text-blue-600">Archives</a>
        <a href="#" className="hover:text-blue-600">Contact Us</a>
      </div>
    </nav>
  );
};

export default Navbar;

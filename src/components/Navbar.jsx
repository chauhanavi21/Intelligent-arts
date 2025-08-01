// src/components/Navbar.jsx
import React from 'react';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 shadow-md bg-white sticky top-0 z-50">
      <div className="text-xl font-bold">Intelligent Arts</div>
      <div className="flex gap-4">
        <button className="hover:text-blue-600">Home</button>
        <button className="hover:text-blue-600">About</button>
        <button className="hover:text-blue-600">Contact</button>
      </div>
    </nav>
  );
};

export default Navbar;

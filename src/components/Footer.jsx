// src/components/Footer.jsx
import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-16 text-center py-6 text-sm text-gray-500 border-t">
      © {new Date().getFullYear()} Intelligent Arts. All rights reserved.
    </footer>
  );
};

export default Footer;

// src/components/Navbar.jsx
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();

  const scrollToTop = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="flex justify-between items-center px-6 py-6 shadow-md bg-white sticky top-0 z-50 font-[Lato]">
      <Link
        to="/"
        onClick={(e) => scrollToTop(e, '/')}
        className="flex items-center gap-2"
      >
        <img src="/logo.webp" alt="Logo" className="h-12 w-auto" />
      </Link>

      <div className="flex items-center gap-6">
        <div className="flex gap-6 text-base md:text-lg font-semibold">
          <Link to="/" onClick={(e) => scrollToTop(e, '/')}>Home</Link>
          <Link to="/books" onClick={(e) => scrollToTop(e, '/books')}>Books</Link>
          <Link to="/authors" onClick={(e) => scrollToTop(e, '/authors')}>Authors</Link>
          <Link to="/archives" onClick={(e) => scrollToTop(e, '/archives')}>Archives</Link>
          <Link to="/about" onClick={(e) => scrollToTop(e, '/about')}>About</Link>
          <Link to="/affiliates" onClick={(e) => scrollToTop(e, '/affiliates')}>Affiliates</Link>
          <Link to="/contact" onClick={(e) => scrollToTop(e, '/contact')}>Contact</Link>
        </div>

        {isAuthenticated() && (
          <div className="flex items-center gap-4">
            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="text-base md:text-lg font-bold hover:text-blue-600 transition-colors"
              >
                Admin
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {isAuthenticated() && (
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

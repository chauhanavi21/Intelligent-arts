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
    <nav className="flex justify-between items-center px-6 py-6 shadow-md bg-white sticky top-0 z-50">
      <Link
        to="/"
        onClick={(e) => scrollToTop(e, '/')}
        className="flex items-center gap-2"
      >
        <img src="/logo.webp" alt="Logo" className="h-14 w-auto" />
      </Link>

      <div className="flex items-center gap-6">
        <div className="flex gap-6 text-base md:text-lg font-bold">
          <Link to="/" onClick={(e) => scrollToTop(e, '/')}>Home</Link>
          <Link to="/authors" onClick={(e) => scrollToTop(e, '/authors')}>Authors</Link>
          <Link to="/titles" onClick={(e) => scrollToTop(e, '/titles')}>Titles</Link>
          <Link to="/contact" onClick={(e) => scrollToTop(e, '/contact')}>Contact Us</Link>
        </div>

        {/* Auth Buttons */}
        <div className="flex items-center gap-6">
          {isAuthenticated() ? (
            <div className="flex items-center gap-6">
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className="text-base md:text-lg font-bold hover:text-blue-600 transition-colors"
                >
                  Admin
                </Link>
              )}
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="text-base md:text-lg font-bold hover:text-blue-600 transition-colors"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-6">
              <Link
                to="/login"
                className="text-base md:text-lg font-bold hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="text-base md:text-lg font-bold hover:text-blue-600 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Welcome Message - Centered */}
      {isAuthenticated() && (
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
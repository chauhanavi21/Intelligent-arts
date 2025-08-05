import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  const scrollToTop = (e, path) => {
    if (location.pathname === path) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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

      <div className="flex gap-6 text-base md:text-lg font-bold">
        <Link to="/" onClick={(e) => scrollToTop(e, '/')}>Home</Link>
        <Link to="/authors" onClick={(e) => scrollToTop(e, '/authors')}>Authors</Link>
        <Link to="/titles" onClick={(e) => scrollToTop(e, '/titles')}>Titles</Link>
        <Link to="/contact" onClick={(e) => scrollToTop(e, '/contact')}>Contact Us</Link>
      </div>
    </nav>
  );
};
export default Navbar;
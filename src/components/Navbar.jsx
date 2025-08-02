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
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white sticky top-0 z-50">
      <Link
        to="/"
        onClick={(e) => scrollToTop(e, '/')}
        className="flex items-center gap-2"
      >
        <img src="/logo.webp" alt="Logo" className="h-10 w-auto" />
      </Link>

      <div className="flex gap-6 text-sm md:text-base font-medium">
        <Link to="/" onClick={(e) => scrollToTop(e, '/')}>Home</Link>
        <Link to="/authors" onClick={(e) => scrollToTop(e, '/authors')}>Authors</Link>
        <Link to="/books" onClick={(e) => scrollToTop(e, '/books')}>Books</Link>
        <Link to="/archives" onClick={(e) => scrollToTop(e, '/archives')}>Archives</Link>
        <Link to="/contact" onClick={(e) => scrollToTop(e, '/contact')}>Contact Us</Link>
      </div>
    </nav>
  );
};
export default Navbar;
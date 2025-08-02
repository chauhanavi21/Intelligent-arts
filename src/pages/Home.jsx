import HeroCarousel from '../components/HeroCarousel';
import { Link } from 'react-router-dom';

const Home = () => {
  const categories = [
    {
      title: 'Authors',
      description: 'Discover the brilliant minds behind our publications',
      icon: '👥',
      link: '/authors'
    },
    {
      title: 'Books',
      description: 'Explore our collection of music and arts literature',
      icon: '📚',
      link: '/books'
    },
    {
      title: 'Archives',
      description: 'Dive into our historical collections and rare materials',
      icon: '📁',
      link: '/archives'
    },
    {
      title: 'More Coming Soon',
      description: 'Stay tuned for new categories and exciting content',
      icon: '🚀',
      link: '#'
    }
  ];

  return (
    <div className="pt-6">
      <HeroCarousel />

      <div className="mt-10 px-4 sm:px-[30px] max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-8 text-center" style={{ fontFamily: 'Lato, sans-serif' }}>
          Navigate intelligent arts.
        </h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="block bg-white shadow-md hover:shadow-lg transition-all duration-300 rounded-md overflow-hidden cursor-pointer transform hover:-translate-y-1"
            >
              <div className="p-6 text-center">
                <div className="text-4xl mb-4">{category.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

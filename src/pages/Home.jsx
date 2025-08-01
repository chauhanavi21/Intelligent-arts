import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import books from '../data/books.json';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="pt-6">
      <HeroCarousel />

      <div className="mt-10 px-4 sm:px-[30px] max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 text-center">List of Books</h2>

        <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md hover:shadow-lg transition rounded-md overflow-hidden cursor-pointer"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-[300px] object-contain rounded-t-md"
              />
              <div className="p-3">
                <h3 className="font-semibold text-lg">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
                <p className="text-sm mt-2 text-gray-700">
                  {book.description?.slice(0, 90)}...{' '}
                  <Link to={`/profile/${book.id}`} className="text-blue-600 hover:underline">
                    Read more
                  </Link>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

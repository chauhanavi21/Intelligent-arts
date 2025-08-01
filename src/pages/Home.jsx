import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import books from '../data/books.json';

const Home = () => {
  const tabs = ['All', 'Art', 'Lit', 'Music'];

  return (
    <div className="pt-6">
      {/* Carousel */}
      <HeroCarousel />

      {/* Tabs */}
      <div className="mt-10 px-4 sm:px-[30px] max-w-7xl mx-auto">
        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition text-sm sm:text-base"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="bg-white shadow-md hover:shadow-lg transition rounded-md overflow-hidden cursor-pointer"
              onClick={() => console.log(`Book clicked: ${book.id}`)} // Replace with router later
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-[300px] object-contain rounded-t-md"
                />

              <div className="p-3">
                <h3 className="font-semibold text-lg">{book.title}</h3>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

// src/pages/Home.jsx
import React from 'react';
import HeroCarousel from '../components/HeroCarousel';

const Home = () => {
  const tabs = ['All', 'Art', 'Lit', 'Music'];

  return (
    <div className="pt-4 px-4">
      <HeroCarousel />

      <div className="mt-8">
        <div className="flex gap-4 justify-center mb-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              className="px-4 py-2 border rounded hover:bg-gray-100 transition"
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-gray-200 rounded flex items-center justify-center"
            >
              Card {i + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;

// src/components/HeroCarousel.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const HeroCarousel = () => {
  return (
    <div className="w-full max-w-5xl mx-auto mt-6">
      <Swiper spaceBetween={20} slidesPerView={1} loop>
        {[1, 2, 3].map((num) => (
          <SwiperSlide key={num}>
            <div className="h-64 bg-gray-200 rounded-lg flex items-center justify-center text-xl">
              Slide {num}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex justify-center mt-4 space-x-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-4 h-4 bg-gray-400 rounded-full" />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;

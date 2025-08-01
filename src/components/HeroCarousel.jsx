// src/components/HeroCarousel.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const slides = [
  {
    image: 'image1.webp',
    title: 'Preserving Artistic Legacy',
    text: 'Explore our curated collection of audio-visual art and literary archives.',
  },
  {
    image: 'image2.webp',
    title: 'Legacy of Joel Chadabe',
    text: 'Celebrating a pioneer in electronic music through digitized works.',
  },
];

const HeroCarousel = () => {
  return (
    <div className="max-w-7xl mx-auto mt-6 px-[30px]">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 10000 }}
        loop
        slidesPerView={1}
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="flex flex-col md:flex-row items-center gap-6 bg-gray-100 rounded-lg p-4 md:p-8">
                <img
                    src={slide.image}
                    alt="Slide"
                    className="w-full md:w-1/2 h-64 md:h-[340px] object-contain rounded shadow"
                />
                <div className="w-full md:w-1/2 text-left">
                    <h2 className="text-xl md:text-3xl font-bold mb-3">{slide.title}</h2>
                    <p className="text-gray-700">{slide.text}</p>
                </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;

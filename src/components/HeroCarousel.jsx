import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const slides = [
  {
    image: '/image1.webp',
    title: 'Preserving Artistic Legacy',
    text: 'Emergence is a new career-spanning compilation that chronicles some of the vast breadth of musical approaches employed by pioneering composerJoel Chadabe (1938-2021). It’s the ffth in a series of archival releases that began to surface in 2017 with the release of Chadabe & Moog and Electric Sound and subsequently encompassed Dynamic Systems and Intelligent Arts (both from 2020).',
  },
  {
    image: '/image1.webp',
    title: 'Legacy of Joel Chadabe',
    text: 'Celebrating a pioneer in electronic music through digitized works.',
  }
];

const HeroCarousel = () => {
  return (
    <div className="w-full bg-white py-4">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 10000 }}
        loop
        slidesPerView={1}
        className="w-full"
      >
        {slides.map((slide, idx) => (
          <SwiperSlide key={idx}>
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center bg-gray-100 rounded-lg overflow-hidden shadow p-6 md:p-10">
              <div className="w-full md:w-[40%]">
            <img
                src={slide.image}
                alt="Slide"
                className="w-full md:w-[90%] max-h-[280px] object-contain mx-auto"
                />

              </div>
              <div className="w-full md:w-[60%] text-left md:pl-8 mt-6 md:mt-0">
                <h2 className="text-2xl md:text-4xl font-bold mb-4">{slide.title}</h2>
                <p className="text-gray-700 text-sm md:text-base">{slide.text}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;

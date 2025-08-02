import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const slides = [
  {
    image: '/image1.webp',
    title: 'Preserving Artistic Legacy',
    text: 'Emergence is a new career-spanning compilation that chronicles some of the vast breadth of musical approaches employed by pioneering composerJoel Chadabe (1938-2021). It\'s the ffth in a series of archival releases that began to surface in 2017 with the release of Chadabe & Moog and Electric Sound and subsequently encompassed Dynamic Systems and Intelligent Arts (both from 2020).',
  },
  {
    image: '/image2.webp',
    title: 'A Death in Zamora',
    text: 'A gripping story that takes place during the Spanish Civil War through the lens of personal discovery, truth, and hidden family history.',
  },
  {
    image: '/image3.webp',
    title: "It's About Sound",
    text: 'This book explores music\'s role in daily life — sing, play, listen. It\'s about how sound connects us all through emotion and memory.',
  },
  {
    image: '/image4.webp',
    title: 'The Musical World of Paul Winter',
    text: 'Environment and music meet. From the Grand Canyon to New York, Paul Winter\'s sonic journey blends culture and conservation.',
  }
];

const HeroCarousel = () => {
  return (
    <div className="w-full bg-white py-4 relative">
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{ delay: 10000 }}
        loop
        slidesPerView={1}
        pagination={{
          clickable: true,
          el: '.swiper-pagination',
          bulletClass: 'swiper-pagination-bullet',
          bulletActiveClass: 'swiper-pagination-bullet-active',
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
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
        
        {/* Navigation Arrows */}
        <div className="swiper-button-prev !text-gray-400 !bg-white/30 hover:!bg-white/50 !rounded-full !w-8 !h-8 !shadow-sm"></div>
        <div className="swiper-button-next !text-gray-400 !bg-white/30 hover:!bg-white/50 !rounded-full !w-8 !h-8 !shadow-sm"></div>
        
        {/* Pagination Dots */}
        <div className="swiper-pagination !bottom-2"></div>
      </Swiper>
    </div>
  );
};

export default HeroCarousel;

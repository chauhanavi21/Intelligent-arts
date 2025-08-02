import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const Authors = () => {
  const { authorId } = useParams();
  
  // Mock author data - you can replace with real data
  const author = {
    id: authorId || '1',
    name: 'Joel Chadabe',
    image: '/image1.webp',
    intro: 'Joel Chadabe (1938-2021) was a pioneering composer and electronic music innovator. His work spans decades of musical exploration, from early analog synthesizers to digital composition. He founded the Electronic Music Studio at the State University of New York at Albany and was a key figure in the development of interactive computer music.',
    bio: 'A visionary in electronic music, Chadabe\'s contributions to the field are immeasurable. His innovative approaches to composition and performance have influenced generations of musicians and composers.'
  };

  const contentSections = [
    {
      id: 'biography',
      title: 'Biography',
      content: 'Joel Chadabe was born in 1938 and began his musical journey at an early age. He studied composition at Columbia University and later became a professor at the State University of New York at Albany, where he founded the Electronic Music Studio. Throughout his career, he composed over 100 works and was a leading figure in the development of interactive computer music systems.'
    },
    {
      id: 'works',
      title: 'Major Works',
      content: 'Chadabe\'s notable works include "Echoes," "Solo," and "Rhythms." His compositions often explored the relationship between human performers and computer systems, creating unique interactive experiences. His book "Electric Sound: The Past and Promise of Electronic Music" remains a seminal text in the field.'
    },
    {
      id: 'influence',
      title: 'Influence & Legacy',
      content: 'Chadabe\'s influence extends beyond his compositions. He was a founding member of the International Computer Music Association and served as its president. His work with real-time interactive systems paved the way for modern electronic music production and performance techniques.'
    },
    {
      id: 'publications',
      title: 'Publications',
      content: 'In addition to his musical works, Chadabe authored several important books including "Electric Sound: The Past and Promise of Electronic Music" and numerous articles on electronic music composition and performance. His writings continue to be essential reading for students and practitioners of electronic music.'
    }
  ];

  const [activeSection, setActiveSection] = useState('biography');
  const contentRef = useRef(null);
  const sectionRefs = useRef({});

  // Handle scroll-based navigation
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const scrollTop = contentRef.current.scrollTop;
      const containerHeight = contentRef.current.clientHeight;

      // Find which section is currently in view
      let currentSection = 'biography';
      Object.keys(sectionRefs.current).forEach((sectionId) => {
        const element = sectionRefs.current[sectionId];
        if (element) {
          const rect = element.getBoundingClientRect();
          const containerRect = contentRef.current.getBoundingClientRect();
          
          if (rect.top <= containerRect.top + 100 && rect.bottom >= containerRect.top + 100) {
            currentSection = sectionId;
          }
        }
      });

      setActiveSection(currentSection);
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      return () => contentElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToSection = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element && contentRef.current) {
      contentRef.current.scrollTo({
        top: element.offsetTop - 20,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb Bar */}
      <div className="sticky top-16 z-40 bg-gray-50 border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" className="hover:text-gray-900">Home</a>
            <span>/</span>
            <a href="/authors" className="hover:text-gray-900">Authors</a>
            <span>/</span>
            <span className="text-gray-900 font-medium">{author.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Author Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Author Image */}
            <div className="w-full md:w-1/3">
              <img
                src={author.image}
                alt={author.name}
                className="w-full max-w-md mx-auto rounded-lg shadow-md object-cover"
              />
            </div>
            
            {/* Author Intro */}
            <div className="w-full md:w-2/3">
              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ fontFamily: 'Lato, sans-serif' }}>
                {author.name}
              </h1>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                {author.intro}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {author.bio}
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Headings */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-32">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">Contents</h2>
              <nav className="space-y-2">
                {contentSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors duration-200 ${
                      activeSection === section.id
                        ? 'bg-gray-100 text-gray-900 border-l-4 border-gray-400'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content - Scrollable */}
          <div className="w-full lg:w-2/3">
            <div 
              ref={contentRef}
              className="h-[600px] overflow-y-auto pr-4 scroll-smooth"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#d1d5db #f9fafb' }}
            >
              <div className="prose prose-lg max-w-none">
                {contentSections.map((section) => (
                  <div
                    key={section.id}
                    ref={(el) => (sectionRefs.current[section.id] = el)}
                    className="mb-12"
                  >
                    <h2 className="text-2xl font-semibold mb-6 text-gray-900">
                      {section.title}
                    </h2>
                    <div className="text-gray-700 leading-relaxed space-y-4">
                      {section.content.split('.').map((sentence, index) => (
                        <p key={index} className="text-base leading-7">
                          {sentence.trim()}.
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Authors; 
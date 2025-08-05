import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Banner = ({ type = 'all', limit = 1 }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const url = type === 'all' 
          ? `http://localhost:3001/api/banners?limit=${limit}`
          : `http://localhost:3001/api/banners?type=${type}&limit=${limit}`;
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }
        const data = await response.json();
        setBanners(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, [type, limit]);

  useEffect(() => {
    // Add animation delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return null; // Don't show loading state for banners
  }

  if (error || banners.length === 0) {
    return null; // Don't show anything if no banners
  }

  return (
    <div className="w-full">
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={`relative overflow-hidden rounded-xl shadow-2xl mb-8 transform transition-all duration-1000 ease-out ${
            isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'
          } hover:shadow-3xl`}
          style={{
            backgroundColor: banner.backgroundColor,
            color: banner.textColor,
            border: '2px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
            background: `linear-gradient(135deg, ${banner.backgroundColor} 0%, ${banner.backgroundColor}dd 50%, ${banner.backgroundColor} 100%)`
          }}
        >
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse"></div>
          
          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-4 left-4 w-2 h-2 bg-white/20 rounded-full animate-bounce"></div>
            <div className="absolute top-8 right-8 w-1 h-1 bg-white/30 rounded-full animate-ping"></div>
            <div className="absolute bottom-6 left-1/4 w-1.5 h-1.5 bg-white/25 rounded-full animate-pulse"></div>
          </div>

          <div className="flex flex-col md:flex-row items-center relative z-10">
            {/* Image Section with hover effect */}
            {banner.settings?.showImage && (
              <div className="w-full md:w-1/2 lg:w-2/5 relative group">
                <div className="overflow-hidden rounded-l-xl">
                  <img
                    src={banner.image}
                    alt={banner.title}
                    className="w-full h-64 md:h-80 object-cover transform transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                {/* Image overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            )}

            {/* Content Section with enhanced styling */}
            <div className={`flex-1 p-8 md:p-10 ${banner.settings?.layout === 'center' ? 'text-center' : ''}`}>
              <div className="max-w-2xl mx-auto">
                {banner.subtitle && (
                  <p className="text-sm font-medium mb-3 opacity-80 animate-fade-in-up">
                    {banner.subtitle}
                  </p>
                )}
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                  {banner.title}
                </h2>
                
                {banner.description && (
                  <p className="text-lg mb-8 opacity-90 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    {banner.description}
                  </p>
                )}

                {banner.settings?.showButton && (
                  <div className="animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <Link
                      to={banner.buttonLink}
                      className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 hover:scale-105 animate-pulse"
                    >
                      {banner.buttonText}
                      <svg className="ml-3 w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Shimmer effect */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer"></div>
        </div>
      ))}
    </div>
  );
};

export default Banner; 
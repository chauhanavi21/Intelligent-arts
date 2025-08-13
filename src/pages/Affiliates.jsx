import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Banner from '../components/Banner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

// This page now shows authors as affiliate-style cards
// It fetches authors and a primary title cover per author for context

const Affiliates = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [covers, setCovers] = useState([]); // for carousel

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/authors');
        if (!res.ok) throw new Error('Failed to fetch authors');
        const auths = await res.json();

        // Fetch one cover per author (best-effort)
        const withCovers = await Promise.all(
          auths.map(async (a) => {
            try {
              const r = await fetch(`http://localhost:3001/api/titles?authorId=${a._id}&limit=1`);
              if (r.ok) {
                const d = await r.json();
                const primary = d.titles && d.titles.length > 0 ? d.titles[0] : null;
                return { ...a, primaryCover: primary ? primary.image : null, primaryTitle: primary ? primary.title : null };
              }
            } catch (_) {
              // ignore per-author fetch failure
            }
            return { ...a, primaryCover: null, primaryTitle: null };
          })
        );

        setAuthors(withCovers);
        // Build a small covers set for the carousel
        setCovers(withCovers.map((a) => a.primaryCover).filter(Boolean).slice(0, 12));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading authors...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <div className="px-4 sm:px-[30px] max-w-7xl mx-auto">
        <Banner type="all" limit={1} />
      </div>

      <div className="px-4 sm:px-[30px] max-w-7xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold font-[Lato]">Affiliates</h1>
          <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
        Check out our friends! Each of them is doing something interesting. Some have published other forms of our titles, or they have labels that showcase some of our artists, and more!
      </p>
          <p className="mt-2 text-sm text-gray-500 max-w-2xl mx-auto">Some businesses and relationships may change over time.</p>
        </div>

        {/* Highlights carousel (book covers) */}
        {covers.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            slidesPerView={2}
            spaceBetween={16}
            breakpoints={{
              640: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 5, spaceBetween: 24 }
            }}
            pagination={{ clickable: true, el: '.affiliates-pagination' }}
            className="w-full"
          >
            {covers.map((img, idx) => (
              <SwiperSlide key={idx}>
                <div className="h-28 sm:h-32 flex items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md transition transform hover:-translate-y-0.5">
                  <img src={img} alt="Cover" className="max-h-20 object-contain opacity-90" />
                </div>
              </SwiperSlide>
            ))}
            <div className="affiliates-pagination !bottom-1"></div>
          </Swiper>
        </div>
        )}

        {/* Author cards grid */}
        <div className="mt-10 grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((author, index) => (
            <Link
              key={author._id}
              to={`/authors/${author._id}`}
              className="group bg-white rounded-xl border border-gray-100 shadow hover:shadow-lg transition transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-200"
            >
              <div className="p-5 flex items-start gap-4 animate-fade-in-up" style={{ animationDelay: `${0.06 * index}s` }}>
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img src={author.image} alt={author.name} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold group-hover:text-blue-700 transition-colors">{author.name}</h3>
                  {author.primaryTitle ? (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">Featured title</p>
                      <p className="text-sm text-gray-700 line-clamp-2">{author.primaryTitle}</p>
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">View profile to see titles</p>
                  )}
                  <span className="inline-flex items-center text-sm text-blue-700 mt-3">
                    View profile <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Simple affiliate inquiry form */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <div className="bg-white rounded-xl border border-gray-100 shadow p-6">
            <h3 className="text-xl font-semibold">Become an affiliate</h3>
            <p className="mt-2 text-gray-600 text-sm">
              If you would like to collaborate with us or be listed here, send a note and we will
              get back to you.
            </p>
            <form className="mt-5 space-y-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block text-sm mb-1">Organization</label>
                <input type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Company / Label / Project" />
              </div>
              <div>
                <label className="block text-sm mb-1">Message</label>
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-blue-200" placeholder="Tell us a bit about your work" />
              </div>
              <button type="button" className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Send
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              <p className="text-xs text-gray-500">This form is a visual placeholder.</p>
            </form>
          </div>
          <div className="bg-blue-50 rounded-xl p-6 text-blue-900 text-sm animate-fade-in-up" style={{ animationDelay: '0.08s' }}>
            <h4 className="font-semibold">About our affiliates</h4>
            <p className="mt-2">
              We collaborate with organizations doing interesting work. Some publish other forms of
              our titles; others run labels that showcase our artists. This list will grow and
              evolve.
            </p>
            <p className="mt-3 opacity-80">Some businesses and relationships may change over time.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Affiliates;
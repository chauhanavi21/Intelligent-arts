import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const BookDetail = () => {
  const { bookId } = useParams();
  const [book, setBook] = useState(null);
  const [relatedBooks, setRelatedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/titles/${bookId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        const data = await response.json();
        setBook(data);
        
        // Fetch related books
        const relatedResponse = await fetch(`http://localhost:3001/api/titles?limit=6&category=${data.category}`);
        if (relatedResponse.ok) {
          const relatedData = await relatedResponse.json();
          setRelatedBooks(relatedData.titles?.filter(b => b._id !== bookId) || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [bookId]);

  const formatCategory = (category) => {
    const categoryMap = {
      'books': 'Books',
      'digital': 'Digital',
      'cd': 'CD',
      'vinyl': 'Vinyl',
      'articles': 'Articles',
      'papers': 'Papers',
      'magazine': 'Magazine',
      'journal': 'Journal',
      'ebook': 'E-Book',
      'audiobook': 'Audiobook',
      'podcast': 'Podcast',
      'video': 'Video',
      'other': 'Other'
    };
    return categoryMap[category] || category;
  };

  const getCategoryColor = (category) => {
    const colorMap = {
      'books': 'bg-blue-100 text-blue-800',
      'digital': 'bg-green-100 text-green-800',
      'cd': 'bg-purple-100 text-purple-800',
      'vinyl': 'bg-orange-100 text-orange-800',
      'articles': 'bg-indigo-100 text-indigo-800',
      'papers': 'bg-teal-100 text-teal-800',
      'magazine': 'bg-pink-100 text-pink-800',
      'journal': 'bg-yellow-100 text-yellow-800',
      'ebook': 'bg-emerald-100 text-emerald-800',
      'audiobook': 'bg-cyan-100 text-cyan-800',
      'podcast': 'bg-rose-100 text-rose-800',
      'video': 'bg-violet-100 text-violet-800',
      'other': 'bg-gray-100 text-gray-800'
    };
    return colorMap[category] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Book not found</div>
          <Link to="/titles" className="text-blue-600 hover:underline">
            ← Back to Titles
          </Link>
        </div>
      </div>
    );
  }

  // Mock images for carousel (in real app, these would come from the book data)
  const carouselImages = [
    book.image,
    '/image1.webp',
    '/image2.webp',
    '/image3.webp'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Carousel */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          effect="fade"
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          loop={true}
          className="h-full"
        >
          {carouselImages.map((image, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-full">
                <img
                  src={image}
                  alt={`${book.title} - Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">{book.title}</h1>
                    <p className="text-xl md:text-2xl">{book.authorId?.name || 'Unknown Author'}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Main Content (single flow, no tabs) */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-10">
          <div>
            {/* Book Header */}
            <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-shrink-0">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="w-64 h-80 object-cover rounded-lg shadow-md"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(book.category)}`}>
                      {formatCategory(book.category)}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">Published {new Date(book.publishDate || book.createdAt).getFullYear()}</span>
                    {book.format && (
                      <>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600 capitalize">{book.format}</span>
                      </>
                    )}
                    {book.language && (
                      <>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{book.language}</span>
                      </>
                    )}
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">by {book.authorId?.name || 'Unknown Author'}</p>
                  
                  {/* Ratings removed as per requirement */}

                  {book.showSampleButton && book.sampleUrl && (
                    <div className="space-y-4">
                      <a
                        href={book.sampleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Read Sample
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Flow sections */}
            <div className="bg-white rounded-lg shadow-lg p-8 space-y-10">
              {/* Description with author link */}
              <section>
                <h3 className="text-xl font-semibold mb-4">About this book</h3>
                <p className="text-gray-700 leading-relaxed mb-3">{book.description}</p>
                {book.authorId && (
                  <p className="text-sm text-gray-700">
                    By{' '}
                    <a href={`/authors/${book.authorId._id || book.authorId}`} className="text-blue-600 hover:text-blue-800">
                      {book.authorId.name || 'Author'}
                    </a>
                  </p>
                )}
              </section>

              {/* Reviews (optional) */}
              {book.showReviewsSection !== false && (
                <section>
                  <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                  {book.reviews && book.reviews.filter(r => r.isActive !== false).length > 0 ? (
                    <div className="space-y-6">
                      {book.reviews.filter(r => r.isActive !== false).map((rev, idx) => (
                        <div key={idx} className="border-b border-gray-200 pb-4">
                          <blockquote className="text-gray-800 italic">“{rev.quote}”</blockquote>
                          <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                            {rev.source && <span>— {rev.source}</span>}
                            {rev.date && <span>• {new Date(rev.date).toLocaleDateString()}</span>}
                            {rev.url && (
                              <a href={rev.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                Read more
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No reviews yet.</p>
                  )}
                </section>
              )}

              {/* Details */}
              <section>
                <h3 className="text-xl font-semibold mb-4">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-600">Category:</span>
                    <p className="text-gray-900">{formatCategory(book.category)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Published:</span>
                    <p className="text-gray-900">{new Date(book.publishDate || book.createdAt).toLocaleDateString()}</p>
                  </div>
                  {book.isbn && (
                    <div>
                      <span className="font-medium text-gray-600">ISBN:</span>
                      <p className="text-gray-900">{book.isbn}</p>
                    </div>
                  )}
                  {book.pages && (
                    <div>
                      <span className="font-medium text-gray-600">Pages:</span>
                      <p className="text-gray-900">{book.pages}</p>
                    </div>
                  )}
                  {book.language && (
                    <div>
                      <span className="font-medium text-gray-600">Language:</span>
                      <p className="text-gray-900">{book.language}</p>
                    </div>
                  )}
                  {book.format && (
                    <div>
                      <span className="font-medium text-gray-600">Format:</span>
                      <p className="text-gray-900 capitalize">{book.format}</p>
                    </div>
                  )}
                </div>
              </section>

              {/* Where to Buy */}
              <section>
                <h3 className="text-xl font-semibold mb-4">Where to Buy</h3>
                {book.purchaseLinks && book.purchaseLinks.length > 0 ? (
                  <div className="space-y-4">
                    {book.purchaseLinks.filter(link => link.isActive).map((link, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{link.platform}</h4>
                            {book.showPricing && link.price && (
                              <p className="text-lg font-bold text-green-600">{link.price}</p>
                            )}
                          </div>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                          >
                            Buy Now
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No purchase links available at the moment.</p>
                    <p className="text-sm text-gray-400 mt-2">Check back later for availability.</p>
                  </div>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail; 
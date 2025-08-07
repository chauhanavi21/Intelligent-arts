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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Book Info */}
          <div className="lg:col-span-2">
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
                    <span className="text-gray-600">Published {new Date(book.createdAt).getFullYear()}</span>
                  </div>
                  
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                  <p className="text-xl text-gray-600 mb-4">by {book.authorId?.name || 'Unknown Author'}</p>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600">(4.5/5)</span>
                    </div>
                    <span className="text-gray-500">•</span>
                    <span className="text-gray-600">128 reviews</span>
                  </div>

                  <div className="space-y-4">
                    <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold">
                      Read Sample
                    </button>
                    <button className="w-full bg-gray-100 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors font-semibold">
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {['description', 'reviews', 'author', 'details'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-6 py-4 text-sm font-medium capitalize ${
                        activeTab === tab
                          ? 'border-b-2 border-blue-600 text-blue-600'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </nav>
              </div>
              
              <div className="p-8">
                {activeTab === 'description' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">About this book</h3>
                    <p className="text-gray-700 leading-relaxed">{book.description}</p>
                  </div>
                )}
                
                {activeTab === 'reviews' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="border-b border-gray-200 pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, j) => (
                                <svg key={j} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                </svg>
                              ))}
                            </div>
                            <span className="font-medium">John Doe</span>
                            <span className="text-gray-500">• 2 days ago</span>
                          </div>
                          <p className="text-gray-700">Great book! Highly recommended for anyone interested in this topic.</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {activeTab === 'author' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">About the Author</h3>
                    <div className="flex items-start gap-4">
                      <img
                        src={book.authorId?.image || '/default-author.webp'}
                        alt={book.authorId?.name}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-lg">{book.authorId?.name}</h4>
                        <p className="text-gray-600 mb-2">{book.authorId?.intro}</p>
                        <p className="text-gray-700">{book.authorId?.bio}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                {activeTab === 'details' && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Book Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-gray-600">Category:</span>
                        <p className="text-gray-900">{formatCategory(book.category)}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Published:</span>
                        <p className="text-gray-900">{new Date(book.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">ISBN:</span>
                        <p className="text-gray-900">978-0-123456-78-9</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Pages:</span>
                        <p className="text-gray-900">320</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Purchase Options */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Purchase Options</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Hardcover</p>
                    <p className="text-sm text-gray-600">Free shipping</p>
                  </div>
                  <span className="text-lg font-bold">$24.99</span>
                </div>
                <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">Paperback</p>
                    <p className="text-sm text-gray-600">Free shipping</p>
                  </div>
                  <span className="text-lg font-bold">$14.99</span>
                </div>
                <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium">E-Book</p>
                    <p className="text-sm text-gray-600">Instant download</p>
                  </div>
                  <span className="text-lg font-bold">$9.99</span>
                </div>
              </div>
              <button className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold mt-4">
                Buy Now
              </button>
            </div>

            {/* Related Books */}
            {relatedBooks.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Related Books</h3>
                <div className="space-y-4">
                  {relatedBooks.slice(0, 3).map((relatedBook) => (
                    <Link
                      key={relatedBook._id}
                      to={`/book/${relatedBook._id}`}
                      className="flex gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <img
                        src={relatedBook.image}
                        alt={relatedBook.title}
                        className="w-16 h-20 object-cover rounded"
                      />
                      <div>
                        <h4 className="font-medium text-sm line-clamp-2">{relatedBook.title}</h4>
                        <p className="text-xs text-gray-600">{relatedBook.authorId?.name}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail; 
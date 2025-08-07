import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Books = () => {
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Helper function to format category names
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

  // Helper function to get category color
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

  useEffect(() => {
    const fetchTitles = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/titles');
        if (!response.ok) {
          throw new Error('Failed to fetch titles');
        }
        const data = await response.json();
        setTitles(data.titles || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTitles();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading titles...</p>
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
      <div className="mt-10 px-4 sm:px-[30px] max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-semibold" style={{ fontFamily: 'Lato, sans-serif' }}>
            All Titles
          </h2>
        </div>

        <div className="grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {titles.map((book) => (
            <Link
              key={book._id}
              to={`/book/${book._id}`}
              className="bg-white shadow-md hover:shadow-lg transition rounded-md overflow-hidden cursor-pointer block"
            >
              <img
                src={book.image}
                alt={book.title}
                className="w-full h-[300px] object-contain rounded-t-md"
              />
              <div className="p-3">
                <h3 className="font-semibold text-lg">{book.title}</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500">
                    {book.authorId?.name || 'Unknown Author'}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(book.category)}`}>
                    {formatCategory(book.category)}
                  </span>
                </div>
                <p className="text-sm mt-2 text-gray-700">
                  {book.description?.slice(0, 90)}...
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Books;

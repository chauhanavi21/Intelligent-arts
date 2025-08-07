import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const AuthorProfile = () => {
  const { authorId } = useParams();
  const [author, setAuthor] = useState(null);
  const [authorWorks, setAuthorWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        // Fetch author details
        const authorResponse = await fetch(`http://localhost:3001/api/authors/${authorId}`);
        if (!authorResponse.ok) {
          throw new Error('Author not found');
        }
        const authorData = await authorResponse.json();
        setAuthor(authorData);

        // Fetch author's works
        const worksResponse = await fetch(`http://localhost:3001/api/titles?authorId=${authorId}`);
        if (worksResponse.ok) {
          const worksData = await worksResponse.json();
          setAuthorWorks(worksData.titles || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthorData();
  }, [authorId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading author profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !author) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600">Error: {error || 'Author not found'}</p>
            <Link to="/authors" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
              ← Back to Authors
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link to="/" className="text-gray-500 hover:text-gray-700">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link to="/authors" className="ml-4 text-gray-500 hover:text-gray-700">
                    Authors
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="flex-shrink-0 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-4 text-gray-900">{author.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Author Intro */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{author.name}</h1>
              <p className="text-lg text-gray-600 mb-6">{author.intro}</p>
              <p className="text-gray-700 leading-relaxed">{author.bio}</p>
            </div>
            <div className="flex justify-center lg:justify-end">
              <img
                src={author.image}
                alt={author.name}
                className="w-80 h-80 object-contain bg-gray-100 rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        {/* Main Content with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Navigation</h3>
              <nav className="space-y-2">
                {author.sections && author.sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="block text-gray-600 hover:text-blue-600 py-2 px-3 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    {section.title}
                  </a>
                ))}
                {authorWorks.length > 0 && (
                  <a
                    href="#works"
                    className="block text-gray-600 hover:text-blue-600 py-2 px-3 rounded-md hover:bg-gray-50 transition-colors duration-200"
                  >
                    Works & Titles
                  </a>
                )}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="space-y-8">
              {/* Author Sections */}
              {author.sections && author.sections.map((section) => (
                <div key={section.id} id={section.id} className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{section.title}</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              ))}

              {/* Works & Titles Section */}
              {authorWorks.length > 0 && (
                <div id="works" className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Works & Titles</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {authorWorks.map((work) => (
                      <div key={work._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors duration-200">
                        <img
                          src={work.image}
                          alt={work.title}
                          className="w-full h-48 object-cover rounded-md mb-3"
                        />
                        <h3 className="font-semibold text-gray-900 mb-2">{work.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-3">{work.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile; 
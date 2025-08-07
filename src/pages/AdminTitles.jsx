import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import FileUpload from '../components/FileUpload';

const AdminTitles = () => {
  const { token } = useAuth();
  const [titles, setTitles] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTitle, setEditingTitle] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    title: '',
    authorId: '',
    category: 'books',
    image: '',
    imageFile: '',
    description: '',
    isActive: true,
    isFeatured: false,
    priority: 0
  });

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

  const handleImageUploadSuccess = (path, filename) => {
    setFormData({
      ...formData,
      image: path,
      imageFile: filename
    });
  };

  const handleImageUploadError = (error) => {
    setError(error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [titlesRes, authorsRes] = await Promise.all([
        fetch('http://localhost:3001/api/titles'),
        fetch('http://localhost:3001/api/authors')
      ]);

      const titlesData = await titlesRes.json();
      const authorsData = await authorsRes.json();

      setTitles(titlesData.titles || []);
      setAuthors(authorsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingTitle 
        ? `http://localhost:3001/api/titles/${editingTitle._id}`
        : 'http://localhost:3001/api/titles';
      
      const method = editingTitle ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to save title');
      }

      setShowAddForm(false);
      setEditingTitle(null);
      setFormData({
        title: '',
        authorId: '',
        category: 'books',
        image: '',
        imageFile: '',
        description: '',
        isActive: true,
        isFeatured: false,
        priority: 0
      });
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (title) => {
    setEditingTitle(title);
    setFormData({
      title: title.title,
      authorId: title.authorId._id || title.authorId,
      category: title.category || 'books',
      image: title.image,
      imageFile: title.imageFile || '',
      description: title.description,
      isActive: title.isActive,
      isFeatured: title.isFeatured,
      priority: title.priority || 0
    });
    setShowAddForm(true);
  };

  const handleDelete = async (titleId) => {
    if (!window.confirm('Are you sure you want to delete this title?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/titles/${titleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete title');
      }

      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading titles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Titles</h1>
              <p className="text-gray-600">Add, edit, and manage book titles</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Title
              </button>
              <Link
                to="/admin"
                className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">
              {editingTitle ? 'Edit Title' : 'Add New Title'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                  <select
                    value={formData.authorId}
                    onChange={(e) => setFormData({...formData, authorId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select an author</option>
                    {authors.map((author) => (
                      <option key={author._id} value={author._id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="books">Books</option>
                    <option value="digital">Digital</option>
                    <option value="cd">CD</option>
                    <option value="vinyl">Vinyl</option>
                    <option value="articles">Articles</option>
                    <option value="papers">Papers</option>
                    <option value="magazine">Magazine</option>
                    <option value="journal">Journal</option>
                    <option value="ebook">E-Book</option>
                    <option value="audiobook">Audiobook</option>
                    <option value="podcast">Podcast</option>
                    <option value="video">Video</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <FileUpload
                  onUploadSuccess={handleImageUploadSuccess}
                  onUploadError={handleImageUploadError}
                  currentImage={formData.image}
                  label="Title Image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Active</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured</span>
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingTitle ? 'Update Title' : 'Add Title'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingTitle(null);
                    setFormData({
                      title: '',
                      authorId: '',
                      category: 'books',
                      image: '',
                      description: '',
                      isActive: true,
                      isFeatured: false,
                      priority: 0
                    });
                  }}
                  className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Titles List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                All Titles ({titles.filter(title => selectedCategory === 'all' || title.category === selectedCategory).length})
              </h3>
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Filter by Category:</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="books">Books</option>
                  <option value="digital">Digital</option>
                  <option value="cd">CD</option>
                  <option value="vinyl">Vinyl</option>
                  <option value="articles">Articles</option>
                  <option value="papers">Papers</option>
                  <option value="magazine">Magazine</option>
                  <option value="journal">Journal</option>
                  <option value="ebook">E-Book</option>
                  <option value="audiobook">Audiobook</option>
                  <option value="podcast">Podcast</option>
                  <option value="video">Video</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {titles
                  .filter(title => selectedCategory === 'all' || title.category === selectedCategory)
                  .map((title) => (
                  <tr key={title._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={title.image}
                          alt={title.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{title.title}</div>
                          <div className="text-sm text-gray-500">{title.description?.slice(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {title.authorId?.name || 'Unknown Author'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(title.category)}`}>
                        {formatCategory(title.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        {title.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Inactive
                          </span>
                        )}
                        {title.isFeatured && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(title)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(title._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTitles; 
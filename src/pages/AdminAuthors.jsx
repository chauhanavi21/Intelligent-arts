import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FileUpload from '../components/FileUpload';

const AdminAuthors = () => {
  const { token } = useAuth();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    image: '',
    imageFile: '',
    isActive: true,
    intro: '',
    bio: '',
    specialties: '',
    isFeatured: false,
    role: 'author'
  });

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    if (!token) return; // wait for token before fetching admin endpoint
    fetchAuthors();
  }, [token]);

  const fetchAuthors = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/authors/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch authors');
      }
      const data = await response.json();
      setAuthors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const authorData = {
        ...formData,
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(s => s)
      };

      const url = editingAuthor 
        ? `${API_BASE_URL}/authors/${editingAuthor._id}`
        : `${API_BASE_URL}/authors`;
      
      const method = editingAuthor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(authorData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save author');
      }

      setShowAddForm(false);
      setEditingAuthor(null);
      setFormData({
        name: '',
        email: '',
        image: '',
        imageFile: '',
        isActive: true,
        intro: '',
        bio: '',
        specialties: '',
        isFeatured: false,
        role: 'author'
      });
      setError(null); // Clear any previous errors
      fetchAuthors();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      email: author.email,
      image: author.image,
      imageFile: author.imageFile || '',
      isActive: author.isActive !== false,
      intro: author.intro,
      bio: author.bio,
      specialties: author.specialties?.join(', ') || '',
      isFeatured: author.isFeatured,
      role: author.role
    });
    setShowAddForm(true);
  };

  const handleDelete = async (authorId) => {
    if (!window.confirm('Are you sure you want to delete this author?')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/authors/${authorId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete author');
      }

      fetchAuthors();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading authors...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Authors</h1>
              <p className="text-gray-600">Add, edit, and manage author profiles</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Author
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
              {editingAuthor ? 'Edit Author' : 'Add New Author'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <FileUpload
                  onUploadSuccess={handleImageUploadSuccess}
                  onUploadError={handleImageUploadError}
                  currentImage={formData.image}
                  label="Author Image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Intro</label>
                <textarea
                  value={formData.intro}
                  onChange={(e) => setFormData({...formData, intro: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Specialties (comma-separated)</label>
                <input
                  type="text"
                  value={formData.specialties}
                  onChange={(e) => setFormData({...formData, specialties: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Electronic Music, Education"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Featured Author</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Visible on Site</span>
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingAuthor ? 'Update Author' : 'Add Author'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingAuthor(null);
                    setFormData({
                      name: '',
                      email: '',
                      image: '',
                      imageFile: '',
                      isActive: true,
                      intro: '',
                      bio: '',
                      specialties: '',
                      isFeatured: false,
                      role: 'author'
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

        {/* Authors List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Authors ({authors.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialties</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Featured</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {authors.map((author) => (
                  <tr key={author._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={author.image}
                          alt={author.name}
                          className="w-10 h-10 rounded-full object-contain bg-gray-100"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{author.name}</div>
                          <div className="text-sm text-gray-500">{author.intro?.slice(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{author.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {author.specialties?.map((specialty, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {author.isFeatured ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Featured
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Regular
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(author)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(author._id)}
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

export default AdminAuthors; 
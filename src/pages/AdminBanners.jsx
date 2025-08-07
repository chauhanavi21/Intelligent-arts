import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import FileUpload from '../components/FileUpload';

const AdminBanners = () => {
  const { token } = useAuth();
  const [banners, setBanners] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [formData, setFormData] = useState({
    type: 'promotional',
    title: '',
    subtitle: '',
    description: '',
    image: '',
    imageFile: '',
    buttonText: 'Learn More',
    buttonLink: '',
    contentId: '',
    contentModel: '',
    isActive: true,
    priority: 0,
    backgroundColor: '#ffffff',
    textColor: '#000000',
    settings: {
      showImage: true,
      showButton: true,
      layout: 'left'
    }
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bannersRes, authorsRes, titlesRes] = await Promise.all([
        fetch('http://localhost:3001/api/banners'),
        fetch('http://localhost:3001/api/authors'),
        fetch('http://localhost:3001/api/titles')
      ]);

      const bannersData = await bannersRes.json();
      const authorsData = await authorsRes.json();
      const titlesData = await titlesRes.json();

      setBanners(bannersData);
      setAuthors(authorsData);
      setTitles(titlesData.titles || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validate featured author/title banners
      if ((formData.type === 'featured-author' || formData.type === 'featured-title') && !formData.contentId) {
        setError('Please select a ' + (formData.type === 'featured-author' ? 'author' : 'title') + ' for this banner');
        return;
      }

      // Prepare banner data
      const bannerData = { ...formData };
      
      // Set contentModel based on type
      if (formData.type === 'featured-author') {
        bannerData.contentModel = 'Author';
      } else if (formData.type === 'featured-title') {
        bannerData.contentModel = 'Title';
      }

      // Remove contentId and contentModel if not needed
      if (formData.type === 'promotional' || formData.type === 'announcement') {
        delete bannerData.contentId;
        delete bannerData.contentModel;
      }

      const url = editingBanner 
        ? `http://localhost:3001/api/banners/${editingBanner._id}`
        : 'http://localhost:3001/api/banners';
      
      const method = editingBanner ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bannerData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to save banner');
      }

      setShowAddForm(false);
      setEditingBanner(null);
      setFormData({
        type: 'promotional',
        title: '',
        subtitle: '',
        description: '',
        image: '',
        imageFile: '',
        buttonText: 'Learn More',
        buttonLink: '',
        contentId: '',
        contentModel: '',
        isActive: true,
        priority: 0,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        settings: {
          showImage: true,
          showButton: true,
          layout: 'left'
        }
      });
      setError(null); // Clear any previous errors
      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setFormData({
      type: banner.type,
      title: banner.title,
      subtitle: banner.subtitle || '',
      description: banner.description || '',
      image: banner.image,
      imageFile: banner.imageFile || '',
      buttonText: banner.buttonText || 'Learn More',
      buttonLink: banner.buttonLink,
      contentId: banner.contentId || '',
      contentModel: banner.contentModel || '',
      isActive: banner.isActive,
      priority: banner.priority || 0,
      backgroundColor: banner.backgroundColor || '#ffffff',
      textColor: banner.textColor || '#000000',
      settings: {
        showImage: banner.settings?.showImage !== false,
        showButton: banner.settings?.showButton !== false,
        layout: banner.settings?.layout || 'left'
      }
    });
    setShowAddForm(true);
  };

  const handleDelete = async (bannerId) => {
    if (!window.confirm('Are you sure you want to delete this banner?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/banners/${bannerId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete banner');
      }

      fetchData();
    } catch (err) {
      setError(err.message);
    }
  };

  const getTypeLabel = (type) => {
    const typeMap = {
      'featured-author': 'Featured Author',
      'featured-title': 'Featured Title',
      'promotional': 'Promotional',
      'announcement': 'Announcement'
    };
    return typeMap[type] || type;
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading banners...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Manage Banners</h1>
              <p className="text-gray-600">Create and manage promotional banners</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Banner
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
              {editingBanner ? 'Edit Banner' : 'Add New Banner'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Banner Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => {
                      const newType = e.target.value;
                      setFormData({
                        ...formData, 
                        type: newType,
                        // Auto-set button text and link for featured types
                        buttonText: newType === 'featured-author' ? 'Check Titles' : 
                                   newType === 'featured-title' ? 'Learn More' : formData.buttonText,
                        buttonLink: newType === 'featured-author' ? '/authors' : 
                                   newType === 'featured-title' ? '/titles' : formData.buttonLink
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="promotional">Promotional</option>
                    <option value="featured-author">Featured Author</option>
                    <option value="featured-title">Featured Title</option>
                    <option value="announcement">Announcement</option>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <FileUpload
                    onUploadSuccess={handleImageUploadSuccess}
                    onUploadError={handleImageUploadError}
                    currentImage={formData.image}
                    label="Banner Image"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({...formData, buttonText: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Learn More"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Button Link</label>
                <input
                  type="text"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({...formData, buttonLink: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  placeholder="/authors or /titles"
                />
              </div>

              {/* Content Selection for Featured Types */}
              {(formData.type === 'featured-author' || formData.type === 'featured-title') && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <label className="block text-sm font-medium text-blue-800 mb-2">
                    Select {formData.type === 'featured-author' ? 'Author' : 'Title'} *
                  </label>
                  <select
                    value={formData.contentId}
                    onChange={(e) => setFormData({
                      ...formData, 
                      contentId: e.target.value,
                      contentModel: formData.type === 'featured-author' ? 'Author' : 'Title'
                    })}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  >
                    <option value="">Choose {formData.type === 'featured-author' ? 'an author' : 'a title'}...</option>
                    {formData.type === 'featured-author' 
                      ? authors.map((author) => (
                          <option key={author._id} value={author._id}>
                            {author.name}
                          </option>
                        ))
                      : titles.map((title) => (
                          <option key={title._id} value={title._id}>
                            {title.title}
                          </option>
                        ))
                    }
                  </select>
                  <p className="text-xs text-blue-600 mt-1">
                    This {formData.type === 'featured-author' ? 'author' : 'title'} will be featured in the banner
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
                  <input
                    type="color"
                    value={formData.backgroundColor}
                    onChange={(e) => setFormData({...formData, backgroundColor: e.target.value})}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Text Color</label>
                  <input
                    type="color"
                    value={formData.textColor}
                    onChange={(e) => setFormData({...formData, textColor: e.target.value})}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Layout</label>
                  <select
                    value={formData.settings.layout}
                    onChange={(e) => setFormData({
                      ...formData, 
                      settings: {...formData.settings, layout: e.target.value}
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    <option value="center">Center</option>
                  </select>
                </div>
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
                    checked={formData.settings.showImage}
                    onChange={(e) => setFormData({
                      ...formData, 
                      settings: {...formData.settings, showImage: e.target.checked}
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Show Image</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.settings.showButton}
                    onChange={(e) => setFormData({
                      ...formData, 
                      settings: {...formData.settings, showButton: e.target.checked}
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium text-gray-700">Show Button</span>
                </label>
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingBanner ? 'Update Banner' : 'Add Banner'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingBanner(null);
                    setFormData({
                      type: 'promotional',
                      title: '',
                      subtitle: '',
                      description: '',
                      image: '',
                      buttonText: 'Learn More',
                      buttonLink: '',
                      contentId: '',
                      contentModel: '',
                      isActive: true,
                      priority: 0,
                      backgroundColor: '#ffffff',
                      textColor: '#000000',
                      settings: {
                        showImage: true,
                        showButton: true,
                        layout: 'left'
                      }
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

        {/* Banners List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">All Banners ({banners.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Banner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {banners.map((banner) => (
                  <tr key={banner._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{banner.title}</div>
                          <div className="text-sm text-gray-500">{banner.subtitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getTypeLabel(banner.type)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {banner.isActive ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {banner.priority}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(banner)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(banner._id)}
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

export default AdminBanners; 
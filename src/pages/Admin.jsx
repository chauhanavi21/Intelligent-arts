import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Admin = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    authors: 0,
    titles: 0,
    featuredAuthors: 0,
    featuredTitles: 0
  });
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [authorsRes, titlesRes] = await Promise.all([
          fetch(`${API_BASE_URL}/authors/all`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${API_BASE_URL}/titles`)
        ]);

        const authors = await authorsRes.json();
        const titles = await titlesRes.json();

        setStats({
          authors: authors.length,
          titles: titles.titles?.length || 0,
          featuredAuthors: authors.filter(a => a.isFeatured).length,
          featuredTitles: titles.titles?.filter(t => t.isFeatured).length || 0
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const API_BASE = API_BASE_URL;

  const downloadCsv = async (path, filename) => {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        throw new Error('Failed to download');
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      alert('Export failed. Please ensure you are logged in as admin.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage your Intelligent Arts content</p>
            </div>
            <Link
              to="/"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              View Site
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Authors</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.authors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Titles</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.titles}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Featured Authors</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.featuredAuthors}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m-9 0h10m-10 0a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V6a2 2 0 00-2-2" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Featured Titles</p>
                <p className="text-2xl font-semibold text-gray-900">{stats.featuredTitles}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/admin/authors"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-blue-200 transition cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Authors</h3>
                <p className="text-gray-600">Add, edit, and manage author profiles</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/titles"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-blue-200 transition cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Manage Titles</h3>
                <p className="text-gray-600">Add, edit, and manage book titles</p>
              </div>
            </div>
          </Link>

          <Link
            to="/admin/banners"
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-blue-200 transition cursor-pointer"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Banner Management</h3>
                <p className="text-gray-600">Manage promotional banners and featured content</p>
              </div>
            </div>
          </Link>

          <button
            onClick={() => downloadCsv('/exports/authors?format=csv', 'authors.csv')}
            className="text-left bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-blue-200 transition cursor-pointer w-full"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Export Authors (CSV)</h3>
                <p className="text-gray-600">Download all authors for records</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => downloadCsv('/exports/authors-with-titles?format=csv', 'authors_with_titles.csv')}
            className="text-left bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-blue-200 transition cursor-pointer w-full"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Export Authors + Titles (CSV)</h3>
                <p className="text-gray-600">One file linking authors to their titles</p>
              </div>
            </div>
          </button>

          <button
            onClick={() => downloadCsv('/exports/titles?format=csv', 'titles.csv')}
            className="text-left bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md hover:border-blue-200 transition cursor-pointer w-full"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-xl bg-blue-50">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Export Titles (CSV)</h3>
                <p className="text-gray-600">Download all titles for records</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Admin; 
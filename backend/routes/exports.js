const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const Author = require('../models/Author');
const Title = require('../models/Title');

function toCSV(rows, headers) {
  const escape = (v) => {
    if (v === null || v === undefined) return '';
    const s = String(v);
    if (s.includes('"') || s.includes(',') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };
  const headerLine = headers.join(',');
  const dataLines = rows.map((row) => headers.map((h) => escape(row[h])).join(','));
  return [headerLine, ...dataLines].join('\n');
}

// GET /api/exports/authors?format=csv|json
router.get('/authors', adminAuth, async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    const authors = await Author.find().select('-password').lean();

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="authors.json"');
      return res.json({ authors });
    }

    const rows = authors.map((a) => ({
      authorId: a._id,
      name: a.name,
      email: a.email,
      isActive: a.isActive !== false,
      isFeatured: !!a.isFeatured,
      specialties: Array.isArray(a.specialties) ? a.specialties.join('|') : '',
      createdAt: a.createdAt ? new Date(a.createdAt).toISOString() : '',
      updatedAt: a.updatedAt ? new Date(a.updatedAt).toISOString() : ''
    }));
    const headers = ['authorId', 'name', 'email', 'isActive', 'isFeatured', 'specialties', 'createdAt', 'updatedAt'];
    const csv = toCSV(rows, headers);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="authors.csv"');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/exports/titles?format=csv|json
router.get('/titles', adminAuth, async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    const titles = await Title.find().populate('authorId', 'name').lean();

    if (format === 'json') {
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="titles.json"');
      return res.json({ titles });
    }

    const rows = titles.map((t) => ({
      titleId: t._id,
      title: t.title,
      authorName: t.authorId && t.authorId.name ? t.authorId.name : '',
      authorId: t.authorId && t.authorId._id ? t.authorId._id : '',
      category: t.category,
      isActive: t.isActive !== false,
      isFeatured: !!t.isFeatured,
      publishDate: t.publishDate ? new Date(t.publishDate).toISOString().split('T')[0] : '',
      createdAt: t.createdAt ? new Date(t.createdAt).toISOString() : '',
      updatedAt: t.updatedAt ? new Date(t.updatedAt).toISOString() : ''
    }));
    const headers = ['titleId', 'title', 'authorName', 'authorId', 'category', 'isActive', 'isFeatured', 'publishDate', 'createdAt', 'updatedAt'];
    const csv = toCSV(rows, headers);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="titles.csv"');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

// GET /api/exports/authors-with-titles?format=json|csv
router.get('/authors-with-titles', adminAuth, async (req, res) => {
  try {
    const { format = 'json', includeInactive = 'true' } = req.query;
    // Load authors and titles once, then join in-memory
    const [authors, titles] = await Promise.all([
      Author.find().select('-password').lean(),
      Title.find().select('title category isActive authorId publishDate').lean()
    ]);

    const authorIdToTitles = new Map();
    for (const t of titles) {
      if (includeInactive !== 'true' && t.isActive === false) continue;
      const key = (t.authorId && typeof t.authorId.toString === 'function') ? t.authorId.toString() : String(t.authorId);
      if (!authorIdToTitles.has(key)) authorIdToTitles.set(key, []);
      authorIdToTitles.get(key).push({
        titleId: t._id,
        title: t.title,
        category: t.category,
        isActive: t.isActive !== false,
        publishDate: t.publishDate ? new Date(t.publishDate).toISOString().split('T')[0] : ''
      });
    }

    if (format === 'json') {
      const data = authors.map((a) => ({
        authorId: a._id,
        name: a.name,
        email: a.email,
        isActive: a.isActive !== false,
        isFeatured: !!a.isFeatured,
        titles: authorIdToTitles.get((a._id && typeof a._id.toString === 'function') ? a._id.toString() : String(a._id)) || []
      }));
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="authors_with_titles.json"');
      return res.json({ authors: data });
    }

    // CSV: one row per (author, title). Authors without titles get a single row with empty title fields
    const headers = ['authorId', 'authorName', 'authorEmail', 'authorIsActive', 'titleId', 'title', 'category', 'titleIsActive', 'publishDate'];
    const rows = [];
    for (const a of authors) {
      const aKey = (a._id && typeof a._id.toString === 'function') ? a._id.toString() : String(a._id);
      const at = authorIdToTitles.get(aKey) || [];
      if (at.length === 0) {
        rows.push({
          authorId: a._id,
          authorName: a.name,
          authorEmail: a.email || '',
          authorIsActive: a.isActive !== false,
          titleId: '',
          title: '',
          category: '',
          titleIsActive: '',
          publishDate: ''
        });
      } else {
        for (const t of at) {
          rows.push({
            authorId: a._id,
            authorName: a.name,
            authorEmail: a.email || '',
            authorIsActive: a.isActive !== false,
            titleId: t.titleId,
            title: t.title,
            category: t.category,
            titleIsActive: t.isActive !== false,
            publishDate: t.publishDate || ''
          });
        }
      }
    }
    const csv = toCSV(rows, headers);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="authors_with_titles.csv"');
    return res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});


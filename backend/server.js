const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

// Test model imports
const Author = require('./models/Author');
const Title = require('./models/Title');
const HomepageContent = require('./models/HomepageContent');

// Test middleware import
const { auth, adminAuth } = require('./middleware/auth');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Intelligent Arts API is running!' });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/authors', require('./routes/authors'));
app.use('/api/titles', require('./routes/titles'));
app.use('/api/banners', require('./routes/banners'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/exports', require('./routes/exports'));
// app.use('/api/homepage', require('./routes/homepage'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler (must be last)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`MongoDB URI: ${process.env.MONGODB_URI}`);
}); 
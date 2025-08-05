const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Test server is running!' });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
}); 
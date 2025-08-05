const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Author = require('./models/Author');
const Title = require('./models/Title');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/intelligent-arts';

async function seed() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Connected to MongoDB');

  // Load data
  const authorsData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/authors.json'), 'utf-8'));
  const titlesData = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/books.json'), 'utf-8'));

  // Clear existing data
  await Author.deleteMany({});
  await Title.deleteMany({});

  // Insert authors
  const authorIdMap = {};
  for (const author of authorsData) {
    // Use a random password for now (should be reset by admin later)
    const newAuthor = new Author({
      name: author.name,
      email: `${author.name.toLowerCase().replace(/\s+/g, '')}@example.com`,
      password: 'password123',
      image: author.image,
      intro: author.intro,
      bio: author.bio,
      specialties: author.specialties,
      sections: author.sections,
      role: 'author',
      isFeatured: false,
      priority: 0
    });
    const saved = await newAuthor.save();
    authorIdMap[author.id] = saved._id;
  }

  // Insert titles
  for (const title of titlesData) {
    const newTitle = new Title({
      title: title.title,
      authorId: authorIdMap[title.authorId],
      image: title.image,
      description: title.description,
      isActive: true,
      isFeatured: false,
      priority: 0
    });
    await newTitle.save();
  }

  console.log('Database seeded successfully!');
  await mongoose.disconnect();
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
}); 
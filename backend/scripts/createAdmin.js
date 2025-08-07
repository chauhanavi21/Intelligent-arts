const mongoose = require('mongoose');
const Author = require('../models/Author');
require('dotenv').config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Author.findOne({ email: 'admin@intelligentarts.com' });
    
    if (existingAdmin) {
      console.log('Admin account already exists');
      console.log('Email: admin@intelligentarts.com');
      console.log('Password: admin123');
      console.log('Role:', existingAdmin.role);
      process.exit(0);
    }

    // Create admin account
    const admin = new Author({
      name: 'Admin',
      email: 'admin@intelligentarts.com',
      password: 'admin123',
      intro: 'System Administrator',
      bio: 'Administrator of Intelligent Arts platform with full access to manage authors, titles, and banners.',
      role: 'admin',
      specialties: ['Administration', 'Content Management', 'User Management']
    });

    await admin.save();
    
    console.log('✅ Admin account created successfully!');
    console.log('📧 Email: admin@intelligentarts.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('🎯 You can now login to access the admin panel');

  } catch (error) {
    console.error('❌ Error creating admin account:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin(); 
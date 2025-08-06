# Authentication System Setup Guide

## Overview
The Intelligent Arts project now includes a complete authentication system with both backend and frontend components.

## Backend Setup

### 1. Environment Variables
Create a `.env` file in the `backend` directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/intelligent-arts

# JWT Secret (change this to a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Environment
NODE_ENV=development

# Server Port
PORT=3001
```

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Start Backend Server
```bash
npm run dev
```

The backend will run on `http://localhost:3001`

## Frontend Setup

### 1. Install Dependencies
```bash
cd intelligent-arts
npm install
```

### 2. Start Frontend Development Server
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Authentication Features

### ✅ Backend Features
- JWT-based authentication
- Password hashing with bcrypt
- User registration and login
- Profile management
- Role-based access control (author/admin)
- Input validation
- Protected routes middleware

### ✅ Frontend Features
- Global authentication context
- Login and registration forms
- Protected route components
- User profile management
- Admin dashboard access
- Responsive UI with Tailwind CSS

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Protected Routes
- All admin routes require admin role
- User profile requires authentication

## User Roles

### Author Role
- Can register and login
- Can view and edit their profile
- Can access public content

### Admin Role
- All author permissions
- Access to admin dashboard
- Manage authors, titles, and banners

## Testing the System

1. **Register a new user:**
   - Go to `/register`
   - Fill out the form with required information
   - Submit to create account

2. **Login:**
   - Go to `/login`
   - Enter email and password
   - Access protected content

3. **View Profile:**
   - After login, click "Profile" in navbar
   - View and edit profile information

4. **Admin Access:**
   - Create an admin user in the database
   - Access `/admin` dashboard

## Security Features

- JWT tokens with 7-day expiration
- Password hashing with bcrypt
- Input validation and sanitization
- Protected route middleware
- CORS configuration
- Environment variable protection

## File Structure

```
src/
├── contexts/
│   └── AuthContext.jsx          # Global auth state management
├── components/
│   ├── ProtectedRoute.jsx       # Route protection component
│   └── Navbar.jsx              # Updated with auth buttons
├── pages/
│   ├── Login.jsx               # Login form
│   ├── Register.jsx            # Registration form
│   └── UserProfile.jsx         # User profile management
└── App.jsx                     # Updated with auth routes

backend/
├── routes/
│   └── auth.js                 # Authentication endpoints
├── middleware/
│   └── auth.js                 # JWT verification middleware
├── models/
│   └── Author.js               # User model with auth methods
└── server.js                   # Main server file
```

## Troubleshooting

### Common Issues

1. **CORS Errors:**
   - Ensure backend is running on port 3001
   - Check CORS configuration in server.js

2. **JWT Errors:**
   - Verify JWT_SECRET is set in .env
   - Check token expiration

3. **Database Connection:**
   - Ensure MongoDB is running
   - Verify MONGODB_URI in .env

4. **Frontend Not Loading:**
   - Check if Vite dev server is running
   - Verify all dependencies are installed

### Development Tips

- Use browser dev tools to check network requests
- Monitor backend console for errors
- Check localStorage for JWT token storage
- Use React DevTools to inspect auth context state 
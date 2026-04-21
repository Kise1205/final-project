// ============================================================================
// CORE DEPENDENCIES
// ============================================================================
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Initialize environment variables from .env file
dotenv.config();

const app = express();

// Middleware to parse incoming JSON payloads (replaces body-parser)
app.use(express.json());

// ==========================================
// NEW: Anti-Caching Middleware
// ==========================================
// Forces the browser to always fetch fresh API data
app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

// ============================================================================
// STATIC FILE SERVING (MONOLITHIC ARCHITECTURE)
// ============================================================================
// Since we are using ES Modules (type: "module"), __dirname is not available by default.
// We reconstruct it using fileURLToPath and path.dirname.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve all static files (HTML, CSS, JS) from the 'public' directory.
// When a user hits '/', Express automatically serves 'public/index.html'.
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// DATABASE CONNECTION & MODELS (MONGOOSE)
// ============================================================================
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/calorie-tracker')
  .then(() => console.log('✅ MongoDB Connected Successfully'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// User Schema: Defines the structure of the user document in the database
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Will store the bcrypt hash, NEVER plain text
  role: { type: String, enum: ['user', 'admin'], default: 'user' } // Role-based Access Control (RBAC)
});
const User = mongoose.model('User', userSchema);

// FoodEntry Schema: Defines individual meal/food entries
const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  category: { type: String, enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], required: true },
  date: { type: Date, default: Date.now },
  // Relationship linking the food entry to the specific user who created it
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});
const FoodEntry = mongoose.model('FoodEntry', foodSchema);

// ============================================================================
// CUSTOM MIDDLEWARE
// ============================================================================

/**
 * 🐛 DEBUG CASE: JWT Not Working (Always returns 401 Unauthorized)
 * * CAUSE: The client sends the token in the Authorization header as "Bearer eyJhbGci...".
 * A common beginner mistake is passing the ENTIRE header string to jwt.verify().
 * * BROKEN CODE:
 * const token = req.headers.authorization;
 * jwt.verify(token, process.env.JWT_SECRET); // Crash! Signature invalid.
 * * FIX: Split the string by the space character and grab the second element (index 1).
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // 1. Check if header exists and is formatted correctly
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No valid token provided.' });
  }
  
  // 2. Extract the actual token (The Fix)
  const token = authHeader.split(' ')[1]; 
  
  try {
    // 3. Verify the token using our server's secret key
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    // 4. Attach the decoded payload (containing user ID and role) to the request object
    req.user = verified; 
    next(); // Move to the next middleware or route handler
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired token.' });
  }
};

/**
 * Role-Based Middleware: Ensures only users with the 'admin' role can proceed.
 * MUST be placed after verifyToken in the route chain, as it relies on req.user existing.
 */
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden. Admin privileges required.' });
  }
  next();
};

// Global Logging Middleware for server monitoring
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ============================================================================
// API ROUTES: AUTHENTICATION
// ============================================================================

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    
    // Hash the password securely using bcrypt before saving to DB
    // Salt rounds (10) determine the computational cost of the hash
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({ email, password: hashedPassword, role });
    await user.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 1. Verify user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials.' });

    // 2. Verify password matches the hash in the DB
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Invalid credentials.' });

    // 3. Generate JWT Token
    // Payload includes _id and role so we don't have to query the DB for role checks later
    const token = jwt.sign(
        { _id: user._id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' } // Token expires in 24 hours for security
    );
    
    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// API ROUTES: USER DATA (PROTECTED)
// ============================================================================

// GET all foods for the logged-in user (includes search & filter logic)
app.get('/api/foods', verifyToken, async (req, res) => {
  try {
    const { search, category, date } = req.query;
    
    // Base query: strictly limit to the user making the request (Security!)
    let query = { userId: req.user._id };

    // Apply optional filters if they exist in the request query string
    if (search) query.name = { $regex: search, $options: 'i' }; // Case-insensitive regex search
    if (category) query.category = category;
    if (date) {
      // Find entries within the specific 24-hour period of the selected date
      const startDate = new Date(date);
      const endDate = new Date(date);
      endDate.setDate(endDate.getDate() + 1);
      query.date = { $gte: startDate, $lt: endDate };
    }

    const foods = await FoodEntry.find(query).sort({ date: -1 }); // Newest first
    res.json(foods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT (Update) an existing food entry
app.put('/api/foods/:id', verifyToken, async (req, res) => {
  try {
    // Find the entry by ID AND ensure the logged-in user owns it
    const updatedFood = await FoodEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { 
        name: req.body.name, 
        calories: req.body.calories, 
        category: req.body.category 
      },
      { new: true } // Returns the updated document instead of the old one
    );
    
    if (!updatedFood) return res.status(404).json({ error: 'Entry not found' });
    res.json(updatedFood);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new food entry
app.post('/api/foods', verifyToken, async (req, res) => {
  try {
    // Merge request body with the authenticated user's ID
    const food = new FoodEntry({ ...req.body, userId: req.user._id });
    await food.save();
    res.status(201).json(food);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a specific food entry
app.delete('/api/foods/:id', verifyToken, async (req, res) => {
  try {
    // Ensure the user deleting the entry actually owns the entry
    const result = await FoodEntry.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!result) return res.status(404).json({ error: 'Entry not found or unauthorized' });
    res.json({ message: 'Food deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================================================================
// API ROUTES: ADMIN (PROTECTED + ROLE RESTRICTED)
// ============================================================================

// GET all users (Excluding passwords)
app.get('/api/admin/users', verifyToken, isAdmin, async (req, res) => {
  const users = await User.find({}, '-password'); // The '-' excludes the field
  res.json(users);
});

// GET all food entries across the entire app
app.get('/api/admin/foods', verifyToken, isAdmin, async (req, res) => {
  // Populate replaces the 'userId' ObjectId with the actual user document (specifically the email field)
  const foods = await FoodEntry.find().populate('userId', 'email');
  res.json(foods);
});

// DELETE any food entry globally (Admin Power)
app.delete('/api/admin/foods/:id', verifyToken, isAdmin, async (req, res, next) => {
  try {
    const result = await FoodEntry.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ error: 'Entry not found' });
    res.json({ message: 'Record permanently deleted by Admin' });
  } catch (err) {
    next(err); // Passes the error to the Global Error Handler
  }
});

// ============================================================================
// GLOBAL ERROR HANDLER
// ============================================================================
app.use((err, req, res, next) => {
  console.error('🔥 Global Error Caught:', err.message);
  res.status(err.status || 500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// SERVER INITIALIZATION
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`));
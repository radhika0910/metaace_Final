// server.js
import express from 'express';
import mongoose from 'mongoose';
import session from 'express-session';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import User from './models/user.js';
import Session from './models/sesssion.js';
import uploadSchema from './models/schema.js';
import fileRouter from './routes/filerouter.js';
import path from 'path';
import hbs from 'express-handlebars';


// Connect to MongoDB
mongoose.connect('mongodb+srv://demo:Radhika123456@3dviewer.fs33ycy.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Create Express app
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use(express.json());


// Set up sessions
app.use(
  session({
    secret: 'your-session-secret',
    resave: true,
    saveUninitialized: false,
  })
);

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8080'); // Replace with your login page URL
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});



// Routes

app.use('/fileUpload', fileRouter);


app.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
    });
    await newUser.save();

    return res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error during signup:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Create a new session
    const sessionToken = generateSessionToken();
    const sessionExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const newSession = new Session({
      token: sessionToken,
      expiration: sessionExpiration,
    });
    await newSession.save();

    // Associate the session with the user
    user.session = newSession._id;
    await user.save();

    // Set the session token as a cookie
    req.session.token = sessionToken;

    return res.status(200).json({ message: 'Logged in successfully' });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/logout', async (req, res) => {
  try {
    // Clear the session token cookie
    req.session.token = null;

    // Remove the associated session from the user
    const userId = req.session.userId;
    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.session = null;
        await user.save();
      }
    }

    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Generate a random session token
function generateSessionToken() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 32; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
}

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

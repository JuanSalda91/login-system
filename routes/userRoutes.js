const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Test route
// router.get('/test', (req, res) => {
//     res.json({ message: "user routes working!!!" });
// });

// POST/api/users/register
router.post('/register', async (req, res) => {
    try {
      const { username, email, password } = req.body;
  
      // Basic validation
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Please provide username, email, and password.' });
      }
  
      // Check if user already exists
      const existingUser = await User.findOne({ email });
  
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }
  
      // Create new user (password will be hashed by pre-save hook)
      const newUser = new User({
        username,
        email,
        password,
      });
  
      const savedUser = await newUser.save();
  
      // Remove password before sending response
      const userResponse = {
        _id: savedUser._id,
        username: savedUser.username,
        email: savedUser.email,
        createdAt: savedUser.createdAt,
      };
  
      return res.status(201).json(userResponse);
    } catch (err) {
      console.error('Error in /register:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });

// POST/api/users/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        //basic validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password.' });
        }

        //find user by email
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({ message: 'Incorrect email or password.' });
        }

        //check password using instance method
        const isMatch = await user.isCorrectPassword(password);

        if(!isMatch) {
            return res.status(400).json({ message: 'Incorrect email or password' });
        }

        // create JWT payload
        const payload = {
            _id: user._id,
            username: user.username,
            email: user.email,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        //prepare user data withput password
        const userResponse = {
            _id: user._id,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        };

        return res.json({ token, user: userResponse });
    } catch (err) {
        console.error('Error in /login:', err);
        return res.status(500).json({ message: 'server error' });
    }
});

module.exports = router;

const express = require('express');
const User = require('../models/User')

const router = express.Router();

// Test route
// router.get('/test', (req, res) => {
//     res.json({ message: "user routes working!!!" });
// });

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

module.exports = router;

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user_model')

const deactivated_jwt = []
// Sign up an account
router.post('/signup', async (req, res) => {
    const {
        username,
        password,
        email,
        first_name,
        last_name
    } = req.body;  // TODO: implement input validation

    try {
        // Check for existing user with the same email or username
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'Email already in use' });
            }
            if (existingUser.username === username) {
                return res.status(400).json({ message: 'Username already in use' });
            }
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            first_name,
            last_name
        });

        console.log(newUser)

        // Save the user
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

// Log in using account credentials (email and password)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;  // Todo: input validation

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {  // TODO: combat timing attack
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, message: 'Login successful' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Log out the current account credentials
router.post('/logout', async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user_id = decoded.user_id;

        const {deactivate_jwt} = require('../middleware/jwt_auth');
        deactivate_jwt(token);
        res.status(200).json({ token, message: 'Logout successful' });
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
});

module.exports = router;
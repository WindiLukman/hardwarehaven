
const express = require('express');
const router = express.Router();
const client = require('../components/db');

// Route handler for user registration
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists in the database
        const userExists = await client.query('SELECT * FROM users WHERE username = $1', [username]);

        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Insert the new user into the database
        await client.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, password]);

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

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

// Route handler for user login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Query the database to retrieve user information
        const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);

        // Check if user exists
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Compare raw password
        const storedPassword = result.rows[0].password;

        if (password !== storedPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Return success message and optionally return username or token for frontend session management
        res.status(200).json({ message: 'Login successful', username: username });
    } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Route handler for saving a build
router.post('/save-build', async (req, res) => {
    const { buildName, selectedComponents, username} = req.body;

    try {
        // Insert into PostgreSQL database
        const query = `
            INSERT INTO builds (build_name, username, motherboard, cpu, cpu_cooler, memory, video_card, power_supply, case_type, case_fan, internal_hard_drive, sound_card)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING *;
        `;
        const values = [
            buildName,
            username, // Ensure username is correctly passed here
            selectedComponents.motherboard || null,
            selectedComponents.cpu || null,
            selectedComponents['cpu-cooler'] || null,
            selectedComponents.memory || null,
            selectedComponents['video-card'] || null,
            selectedComponents['power-supply'] || null,
            selectedComponents.case || null,
            selectedComponents['case-fan'] || null,
            selectedComponents['internal-hard-drive'] || null,
            selectedComponents['sound-card'] || null,
        ];

        const result = await client.query(query, values);

        res.status(201).json({ message: 'Build saved successfully', build: result.rows[0] });
    } catch (error) {
        console.error('Error saving build:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

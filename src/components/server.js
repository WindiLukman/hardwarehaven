const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors middleware
const routes = require('../components/routes');

const app = express();

app.use(cors()); // Use cors middleware
app.use(bodyParser.json());

// Use routes defined in routes.js
app.use('/api', routes);

const PORT = process.env.PORT || 5000; // NOTE: PLEASE RUN THIS FILE USING NODE IN THIS DIRECTORY
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

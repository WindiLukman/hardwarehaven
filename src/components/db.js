const { Client } = require('pg');

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'hardwarehaven',
    password: 'h3ll0w0rld',
    port: 5432,
});

// Connect to the database
client.connect()
    .then(() => console.log('Connected to PostgreSQL database'))
    .catch(error => console.error('Error connecting to PostgreSQL database:', error));

module.exports = client;

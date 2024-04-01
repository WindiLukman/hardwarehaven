import React, { useState } from 'react';
import {Link} from 'react-router-dom'
import '../../src/styles/Login.css'; // Importing CSS file for styling

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogin = () => {
        // Here you can implement your authentication logic
        // For simplicity, let's just check if both fields are filled
        if (username && password) {
            setLoggedIn(true);
        } else {
            alert('Please enter both username and password');
        }
    };

    return (
        <div className="login-container">
            {loggedIn ? (
                <div className="welcome-container">
                    <h1>Welcome, {username}!</h1>
                    <button onClick={() => setLoggedIn(false)}>Logout</button>
                </div>
            ) : (
                <div className="form-container">
                    <h1>Log in</h1>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(es) => setUsername(e.target.value)}
                    />
                    <br />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    <button onClick={handleLogin}>Login</button>
                    <br />
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            )}
        </div>
    );
};

export default Login;
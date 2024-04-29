import React, { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import '../styles/UserAuth.css';
import { loginUser } from './api';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await loginUser(username, password);
            console.log(response);
            setLoggedIn(true);
        } catch (error) {
            console.error('Login error:', error); // Log the full error message

            if (error.response.status === 401) {
                setError('Invalid username or password');
            } else {
                setError(error.response.data.error || 'An error occurred');
            }
        }
    };

    // Redirect to Homepage if loggedIn is true
    if (loggedIn) {
        return <Navigate to="/homepage" />; // Use Navigate component
    }

    return (
        <div className="auth-container">
            <div className="left-side"></div>
            <div className="right-side">
                <div className="auth-area">
                    <div className="form-container">
                        <h1>Login</h1>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        {error && <p className="error-message">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

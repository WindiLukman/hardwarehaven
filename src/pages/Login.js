import React, { useState, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import '../styles/UserAuth.css';
import { loginUser as loginUserApi } from './api'; // Assuming you have an API function for login
import { UserContext } from '../context/UserContext';

const Login = () => {
    const { user, loginUser } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await loginUserApi(username, password);
            console.log(response);

            // Log the user in
            loginUser({ username });

        } catch (error) {
            console.error('Login error:', error);

            if (error.response.status === 401) {
                setError('Invalid username or password');
            } else {
                setError(error.response.data.error || 'An error occurred');
            }
        }
    };

    if (user) {
        return <Navigate to="/homepage" />;
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

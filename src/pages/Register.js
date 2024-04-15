import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserAuth.css';
import { registerUser } from "./api";

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registered, setRegistered] = useState(false);
    const [error, setError] = useState('');

    const handleRegister = async () => {
        try {
            const response = await registerUser(username, password);
            console.log(response);
            setRegistered(true);
        } catch (error) {
            setError('Error registering user: ' + error.message); // Set error message
            console.error('Error registering user:', error);
        }
    };

    return (
        <div className="auth-container">
            <div className="left-side"></div>
            <div className="right-side">
                {registered ? (
                    <div className="success-container">
                        <h1>Registration Successful!</h1>
                        <p>You have successfully registered with username: {username}</p>
                        <Link to="/login">Login</Link>
                    </div>
                ) : (
                    <div className={"auth-area"}>
                        <div className="form-container">
                            <h1>Register</h1>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            <br/>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <br/>
                            <button onClick={handleRegister}>Register</button>
                            {error && <p className="error-message">{error}</p>} {/* Display error message */}
                            <br/>
                            <p>Already have an account? <Link to="/login">Login</Link></p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Register;

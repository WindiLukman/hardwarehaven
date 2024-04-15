import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserAuth.css'; // Importing combined CSS file for styling

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [registered, setRegistered] = useState(false);

    const handleRegister = () => {
        // Here you can implement your registration logic
        // For simplicity, let's just set registered to true if both fields are filled
        if (username && password) {
            setRegistered(true);
        } else {
            alert('Please enter both username and password');
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

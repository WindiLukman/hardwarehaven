import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from './pages/Homepage';
import Build from './pages/Build';

const App = () => {
    return (
        <UserProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/homepage" element={<Homepage />} />
                    <Route path="/build" element={<Build />} />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </Router>
        </UserProvider>
    );
};

export default App;

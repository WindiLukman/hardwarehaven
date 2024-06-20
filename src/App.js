import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Homepage from "./pages/Homepage";
import Build from "./pages/Build";
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/homepage" element={<ProtectedRoute element={<Homepage />} />} />
                <Route path="/build" element={<ProtectedRoute element={<Build />} />} />
                <Route path="/" element={<Navigate to="/login" />} />
                {/* Add more routes for other pages if needed */}
            </Routes>
        </Router>
    );
};

export default App;

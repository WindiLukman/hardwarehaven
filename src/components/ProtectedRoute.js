import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const ProtectedRoute = ({ element }) => {
    const { user } = useContext(UserContext);

    if (!user) {
        // If no user is logged in, redirect to the login page
        return <Navigate to="/login" />;
    }

    // If user is logged in, render the requested element
    return element;
};

export default ProtectedRoute;

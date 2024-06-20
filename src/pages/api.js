import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const registerUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/register`, {
            username: username,
            password: password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (username, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, {
            username: username,
            password: password
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const saveBuild = async (buildName, selectedComponents, username) => {
    try {
        const response = await axios.post(`${API_URL}/save-build`, {
            buildName: buildName,
            selectedComponents: selectedComponents,
            username: username
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

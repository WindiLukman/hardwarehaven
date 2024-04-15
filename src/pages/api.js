import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Update with your server URL

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

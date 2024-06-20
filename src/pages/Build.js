import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { UserContext } from '../context/UserContext';

const hardwareTypes = ['motherboard', 'cpu', 'cpu-cooler', 'memory', 'video-card', 'power-supply', 'case', 'case-fan', 'internal-hard-drive', 'sound-card'];

const Build = () => {
    const { user, logoutUser } = useContext(UserContext);
    const [selectedComponents, setSelectedComponents] = useState({});
    const [currentType, setCurrentType] = useState(null);
    const [buildName, setBuildName] = useState('');
    const [componentList, setComponentList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        if (currentType) {
            fetch(`/database/${currentType}.json`)
                .then(response => response.json())
                .then(data => setComponentList(data))
                .catch(error => console.error('Error fetching components:', error));
        }
    }, [currentType]);

    const handleSelectComponent = (componentType, componentValue) => {
        setSelectedComponents(prevState => ({
            ...prevState,
            [componentType]: componentValue
        }));
    };

    const handleSaveBuild = async () => {
        try {
            console.log('Saving build...', buildName, selectedComponents, user.username);

            const response = await fetch('http://localhost:5000/api/save-build', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    buildName,
                    selectedComponents,
                    username: user.username
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Build saved:', data.build);
                // Optionally, redirect or show success message
            } else {
                console.error('Failed to save build:', data.error);
            }
        } catch (error) {
            console.error('Error saving build:', error);
        }
    };



    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
    };

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const filteredList = componentList.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const pageCount = Math.ceil(filteredList.length / itemsPerPage);

    return (
        <div>
            <h1>Build Your Computer</h1>
            {user && <h2>Welcome, {user.username}!</h2>}
            <div>
                <select onChange={(e) => setCurrentType(e.target.value)}>
                    <option value="">Select a component</option>
                    {hardwareTypes.map(type => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
            {currentType && (
                <div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul>
                        {filteredList.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((item, index) => (
                            <li key={index} onClick={() => handleSelectComponent(currentType, item.name)}>
                                {item.name}
                            </li>
                        ))}
                    </ul>
                    <ReactPaginate
                        previousLabel={'previous'}
                        nextLabel={'next'}
                        breakLabel={'...'}
                        breakClassName={'break-me'}
                        pageCount={pageCount}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={5}
                        onPageChange={handlePageClick}
                        containerClassName={'pagination'}
                        subContainerClassName={'pages pagination'}
                        activeClassName={'active'}
                    />
                </div>
            )}
            <div>
                <table>
                    <tbody>
                    {hardwareTypes.map(type => (
                        <tr key={type}>
                            <td><strong>{type}</strong></td>
                            <td>{selectedComponents[type]}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <input
                    type="text"
                    placeholder="Enter build name..."
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                />
                <button onClick={handleSaveBuild}>
                    Save Build
                </button>
            </div>
            <div>
                <button onClick={() => navigate('/homepage')}>
                    Back to Homepage
                </button>
                <button onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Build;

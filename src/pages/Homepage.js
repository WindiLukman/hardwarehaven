import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Homepage.css';
import ReactPaginate from 'react-paginate';
import { UserContext } from '../context/UserContext';

const Homepage = () => {
    const { user } = useContext(UserContext);
    const [hardwareItems, setHardwareItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [minimizedItems, setMinimizedItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10); // Number of items to display per page
    const navigate = useNavigate(); // Initialize the useNavigate hook

    const hardwareTypes = ['case', 'case-accessory', 'case-fan', 'cpu', 'cpu-cooler', 'external-hard-drive', 'fan-controller', 'headphones', 'internal-hard-drive', 'keyboard', 'memory', 'monitor', 'motherboard', 'mouse', 'optical-drive', 'os', 'power-supply', 'sound-card', 'speakers', 'thermal-paste', 'ups', 'video-card', 'webcam', 'wired-network-card', 'wireless-network-card'];

    useEffect(() => {
        Promise.all(hardwareTypes.map(type =>
            fetch(`/database/${type}.json`)
                .then(response => response.json())
                .then(data => data.map(item => ({ ...item, type }))) // Add type property here
        ))
            .then(dataArrays => {
                const combinedData = [].concat(...dataArrays);
                setHardwareItems(combinedData);
                setMinimizedItems(Array(combinedData.length).fill(true)); // Initialize all items as minimized
            })
            .catch(error => console.error('Error fetching hardware items:', error));
    }, []);

    const filteredItems = hardwareItems.filter(item => {
        const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilterType = filterType === 'all' || item.type === filterType;
        return matchesSearchTerm && matchesFilterType;
    });

    const pageCount = Math.ceil(filteredItems.length / itemsPerPage);

    const handlePageClick = (data) => {
        let selected = data.selected;
        setCurrentPage(selected + 1);
    };

    const toggleMinimized = (index) => {
        setMinimizedItems(prevMinimizedItems => {
            const newMinimizedItems = [...prevMinimizedItems];
            newMinimizedItems[index] = !newMinimizedItems[index];
            return newMinimizedItems;
        });
    };

    const handleBuildButtonClick = () => {
        navigate('/build'); // Navigate to the build page
    };

    return (
        <div className="image-container">
            <div className="container">
                {user && <h2>Welcome, {user.username}!</h2>}
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">All</option>
                        {hardwareTypes.map(type => (
                            <option key={type} value={type}>{type.replace(/-/g, ' ')}</option>
                        ))}
                    </select>
                </div>
                <div className="list-container">
                    <ul className="hardware-list">
                        {filteredItems.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((item, index) => (
                            <li key={index}>
                                <div onClick={() => toggleMinimized(index)} className="item-header">
                                    <strong>{item.name}</strong>
                                </div>
                                {!minimizedItems[index] && (
                                    <div className="item-details">
                                        {Object.keys(item).map((key, i) => (
                                            <div key={i}>
                                                <strong>{key.replace(/_/g, ' ')}</strong>: {item[key]}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="pagination-container">
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
                <div className="build-button-container">
                    <button onClick={handleBuildButtonClick} className="build-button">
                        Go to Build Page
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Homepage;

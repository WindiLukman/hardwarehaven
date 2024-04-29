import React, { useState, useEffect } from 'react';
import '../styles/Homepage.css'; // Import the CSS file

const Homepage = () => {
    const [hardwareItems, setHardwareItems] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [minimizedItems, setMinimizedItems] = useState([]);

    // List of hardware types
    const hardwareTypes = ['case', 'case-accessory', 'case-fan', 'cpu', 'cpu-cooler', 'external-hard-drive', 'fan-controller', 'headphones', 'internal-hard-drive', 'keyboard', 'memory', 'monitor', 'motherboard', 'mouse', 'optical-drive', 'os', 'power-supply', 'sound-card', 'speakers', 'thermal-paste', 'ups', 'video-card', 'webcam', 'wired-network-card', 'wireless-network-card'];

    useEffect(() => {
        // Fetch each hardware type separately
        Promise.all(hardwareTypes.map(type =>
            fetch(`/database/${type}.json`)
                .then(response => response.json())
                .then(data => data.map(item => ({ ...item, type }))) // Add type property here
        ))
            .then(dataArrays => {
                // Combine all the data into one array
                const combinedData = [].concat(...dataArrays);
                setHardwareItems(combinedData);
                setMinimizedItems(Array(combinedData.length).fill(true)); // Initialize all items as minimized
            })
            .catch(error => console.error('Error fetching hardware items:', error));
    }, []);

    // Filter hardware items by search term and type
    const filteredItems = hardwareItems.filter(item => {
        const matchesSearchTerm = item.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilterType = filterType === 'all' || item.type === filterType;
        return matchesSearchTerm && matchesFilterType;
    });

    const toggleMinimized = (index) => {
        setMinimizedItems(prevMinimizedItems => {
            const newMinimizedItems = [...prevMinimizedItems];
            newMinimizedItems[index] = !newMinimizedItems[index];
            return newMinimizedItems;
        });
    };

    return (
        <div className={"image-container"}>
            <div className="container">
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
                        {filteredItems.map((item, index) => (
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
            </div>
        </div>
    );
};

export default Homepage;

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import { UserContext } from '../context/UserContext';
import '../styles/Build.css';

const hardwareTypes = [
    { key: 'motherboard', label: 'Motherboard' },
    { key: 'cpu', label: 'CPU' },
    { key: 'cpu_cooler', label: 'CPU Cooler' },
    { key: 'memory', label: 'Memory' },
    { key: 'video_card', label: 'Video Card' },
    { key: 'power_supply', label: 'Power Supply' },
    { key: 'case_type', label: 'Case' },
    { key: 'case_fan', label: 'Case Fan' },
    { key: 'internal_hard_drive', label: 'Internal Hard Drive' },
    { key: 'sound_card', label: 'Sound Card' }
];

// Mapping from component key to JSON filename
const componentKeyToFilename = {
    'case_type': 'case',
    'cpu_cooler': 'cpu-cooler',
    'internal_hard_drive': 'internal-hard-drive',
    'video_card': 'video-card',
    'power_supply': 'power-supply',
    'case_fan': 'case-fan',
    'sound_card': 'sound-card',
    'motherboard': 'motherboard',
    'cpu': 'cpu',
    'memory': 'memory'
};

const Build = () => {
    const { user, logoutUser } = useContext(UserContext);
    const [selectedComponents, setSelectedComponents] = useState({});
    const [currentType, setCurrentType] = useState(null);
    const [buildName, setBuildName] = useState('');
    const [componentList, setComponentList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [builds, setBuilds] = useState([]);
    const [selectedBuild, setSelectedBuild] = useState(null); // To store details of selected build
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        if (currentType) {
            // Convert key from underscores to dashes and handle special case for 'case_type'
            const apiType = componentKeyToFilename[currentType] || currentType;
            fetch(`/database/${apiType}.json`)
                .then(response => response.json())
                .then(data => setComponentList(data))
                .catch(error => console.error('Error fetching components:', error));
        }
    }, [currentType]);

    useEffect(() => {
        // Fetch builds for the current user
        fetchBuilds();
    }, []);

    const fetchBuilds = async () => {
        try {
            const response = await fetch(`http://localhost:5000/api/builds?username=${user.username}`);
            if (response.ok) {
                const data = await response.json();
                setBuilds(data);
            } else {
                console.error('Failed to fetch builds:', response.statusText);
            }
        } catch (error) {
            console.error('Error fetching builds:', error);
        }
    };

    const handleSelectComponent = (componentType, componentValue) => {
        setSelectedComponents(prevState => ({
            ...prevState,
            [componentType]: componentValue
        }));
    };

    const handleSaveBuild = async () => {
        try {
            // Map selected components to match server expectations
            const mappedComponents = {};
            Object.keys(selectedComponents).forEach(key => {
                if (componentKeyToFilename[key]) {
                    mappedComponents[componentKeyToFilename[key]] = selectedComponents[key];
                } else {
                    mappedComponents[key] = selectedComponents[key];
                }
            });

            const response = await fetch('http://localhost:5000/api/save-build', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    buildName,
                    selectedComponents: mappedComponents,
                    username: user.username
                })
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Build saved:', data.build);
                fetchBuilds();
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

    const handleBuildClick = (build) => {
        setSelectedBuild(build);

        const updatedSelectedComponents = {};

        // Loop through hardwareTypes to set selected components
        hardwareTypes.forEach(type => {
            const key = type.key;

            // Check if the build object has the component key
            if (build.hasOwnProperty(key)) {
                updatedSelectedComponents[key] = build[key];
            } else {
                // Check if the build object has the filename key
                const filenameKey = componentKeyToFilename[key];
                if (build.hasOwnProperty(filenameKey)) {
                    updatedSelectedComponents[key] = build[filenameKey];
                } else {
                    updatedSelectedComponents[key] = null; // Set to null if not found
                }
            }
        });

        setSelectedComponents(updatedSelectedComponents);
        setBuildName(build.build_name); // Set build name for editing
    };

    const filteredList = componentList.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    const pageCount = Math.ceil(filteredList.length / itemsPerPage);

    return (
        <div className={'image-container2'}>
            <div className="container">
                <h1 className="header">Build Your Computer</h1>
                <div className="select-container">
                    <select onChange={(e) => setCurrentType(e.target.value)} className="select">
                        <option value="">Select a component</option>
                        {hardwareTypes.map(type => (
                            <option key={type.key} value={type.key}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>
                {currentType && (
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="input"
                        />
                    </div>
                )}
                <div className="list-container">
                    <ul className="list">
                        {filteredList.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage).map((item, index) => (
                            <li key={index} onClick={() => handleSelectComponent(currentType, item.name)}
                                className="item-header">
                                {item.name}
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
                        className="pagination"
                    />
                </div>
                <div className="details">
                    <table>
                        <tbody>
                        {hardwareTypes.map(type => (
                            <tr key={type.key}>
                                <td><strong>{type.label}</strong></td>
                                <td>{selectedComponents[type.key]}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <input
                        type="text"
                        placeholder="Enter build name..."
                        value={buildName}
                        onChange={(e) => setBuildName(e.target.value)}
                        className="input"
                    />
                    <button onClick={handleSaveBuild} className="button">
                        Save Build
                    </button>
                </div>
                <div className="my-builds">
                    <h2 className="sub-header">My Builds</h2>
                    <ul className="list">
                        {builds.map(build => (
                            <li key={build.build_id} onClick={() => handleBuildClick(build)} className="item-header">
                                <strong>{build.build_name}</strong>
                            </li>
                        ))}
                    </ul>
                </div>
                {selectedBuild && (
                    <div className="selected-build">
                        <h2 className="sub-header">Selected Build Details</h2>
                        <p><strong>Build Name:</strong> {selectedBuild.build_name}</p>
                        <p><strong>Created by:</strong> {selectedBuild.username}</p>
                        {hardwareTypes.map(type => (
                            <p key={type.key}><strong>{type.label}:</strong> {selectedBuild[type.key]}</p>
                        ))}
                    </div>
                )}
                <div className="buttons">
                    <button onClick={() => navigate('/homepage')} className="button">
                        Back to Homepage
                    </button>
                    <button onClick={handleLogout} className="button">
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Build;


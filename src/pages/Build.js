import React, { useState, useEffect, useContext } from 'react';
import ReactPaginate from 'react-paginate';
import { UserContext } from '../context/UserContext';

const hardwareTypes = ['motherboard', 'cpu', 'cpu-cooler', 'memory', 'video-card', 'power-supply', 'case', 'case-fan', 'internal-hard-drive', 'sound-card'];

const Build = () => {
    const { user } = useContext(UserContext);
    const [selectedComponents, setSelectedComponents] = useState({});
    const [currentType, setCurrentType] = useState(null);
    const [buildName, setBuildName] = useState('');
    const [componentList, setComponentList] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

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

    const handleSaveBuild = () => {
        // Save the build here
        console.log('Build saved:', buildName, selectedComponents);
    };

    const handlePageClick = ({ selected }) => {
        setCurrentPage(selected);
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
                <input
                    type="text"
                    placeholder="Enter build name..."
                    value={buildName}
                    onChange={(e) => setBuildName(e.target.value)}
                />
                <button onClick={handleSaveBuild}>
                    Save Build
                </button>
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
            </div>
        </div>
    );
};

export default Build;

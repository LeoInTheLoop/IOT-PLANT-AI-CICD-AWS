import React from 'react';
import '../styles/FilterTabs.css';

interface FilterTabsProps {
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ activeFilter, setActiveFilter }) => {
    return (
        <div className="filter-tabs">
            <button
                className={`filter-tab ${activeFilter === 'All' ? 'active' : ''}`}
                onClick={() => setActiveFilter('All')}
            >
                All Devices
            </button>
            <button
                className={`filter-tab ${activeFilter === 'On' ? 'active' : ''}`}
                onClick={() => setActiveFilter('On')}
            >
                Online
            </button>
            <button
                className={`filter-tab ${activeFilter === 'Off' ? 'active' : ''}`}
                onClick={() => setActiveFilter('Off')}
            >
                Fault
            </button>
        </div>
    );
};

export default FilterTabs;
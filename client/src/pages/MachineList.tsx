import React, { useState } from 'react';
import Machine from "../components/Machine";
import Navigation from '../components/Navigation';
import FilterTabs from '../components/FilterTabs';
import '../styles/MachineList.css';

const machines = [
  {
    Machinename: "machinename 1",
    id: "1",
    ProductType: "Type A",
    airtemp: 25.5,
    processtemp: 30,
    Rotationalspeed: 1500,
    torque: 20.5,
    toolwearinmins: 50,
    status: "On",
    temp: 75,
  },
  {
    Machinename: "machinename 2",
    id: "2",
    ProductType: "M",
    airtemp: 25.5,
    processtemp: 500,
    Rotationalspeed: 1500,
    torque: 20.5,
    toolwearinmins: 50,
    status: "Off",
    temp: 75,
  },
  {
    Machinename: "machinename 3",
    id: "3",
    ProductType: "L",
    airtemp: 20,
    processtemp: 25,
    Rotationalspeed: 1800,
    torque: 30,
    toolwearinmins: 60,
    status: "On",
    temp: 65,
  },
];

const MachineList: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredMachines = machines.filter(machine => {
    if (activeFilter === 'All') return true;
    return machine.status === activeFilter;
  });

  return (
    <div className="content-wrapper">
      <Navigation />
      <div className="main-content">
        <FilterTabs
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        <div className="machine-grid">
          <h2 className='card-title'>Machine List</h2>
          {filteredMachines.map(machine => (
            <Machine
              key={machine.id}
              {...machine}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MachineList;
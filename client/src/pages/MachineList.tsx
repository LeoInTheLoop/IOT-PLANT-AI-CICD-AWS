import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import FilterTabs from '../components/FilterTabs';
import MachineCard from '../components/Machine';

interface Machine {
  id: number;
  machine_id: string;
  type: string;
  airtemp: number;
  processtemp: number;
  rotationalspeed: number;
  torque: number;
  toolwearinmins: number;
  status?: string;
}

const MachineList: React.FC = () => {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await fetch('http://localhost:5001/machines/latest');
        const data = await response.json();
        console.log('Fetched machines:', data);
        setMachines(data);
      } catch (error) {
        console.error('Error fetching machine data:', error);
      }
    };

    fetchMachines();
  }, []);

  const handlePredict = async (machine: Machine): Promise<string> => {
    const payload = {
      type: machine.type, 
      airtemp: machine.airtemp,
      processtemp: machine.processtemp,
      rotationalspeed: machine.rotationalspeed,
      torque: machine.torque,
      toolwearinmins: machine.toolwearinmins,
    };
    
  
    try {
      const response = await fetch('http://localhost:5001/fakepredict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const info = await response.json();
      console.log("geting predict")
      console.log(info.status)
      return info.status || 'Prediction complete';
    } catch (error) {
      console.error('Error sending prediction request:', error);
      return 'Error fetching prediction';
    }
  };

  const filteredMachines = machines.filter(machine => {
    if (activeFilter === 'All') return true;
    return machine.status === activeFilter || activeFilter === 'Unknown';
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
          {filteredMachines.length > 0 ? (
            filteredMachines.map(machine => (
              <MachineCard
                key={machine.id}
                id={machine.id}
                machine_id={machine.machine_id}
                type={machine.type}
                airtemp={machine.airtemp}
                processtemp={machine.processtemp}
                rotationalspeed={machine.rotationalspeed}
                torque={machine.torque}
                toolwearinmins={machine.toolwearinmins}
                status={machine.status || 'Unknown'}
                onPredict={() => handlePredict(machine)}
              />
            ))
          ) : (
            <p>No machines available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MachineList;
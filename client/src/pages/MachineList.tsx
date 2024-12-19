import React, { useState, useEffect } from 'react';
import Navigation from '../components/Navigation';
import FilterTabs from '../components/FilterTabs';
import Machine from '../components/Machine';

interface Machine {
  id: number; // 数据结构改为数字，确保与后端匹配
  machine_id: string;
  ProductType: string;
  airtemp: number;
  processtemp: number;
  Rotationalspeed: number;
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
        const response = await fetch('http://localhost:5001/machinelist/');
        const data = await response.json();
        console.log('Fetched machines:', data); // 调试输出
        setMachines(data);
      } catch (error) {
        console.error('Error fetching machine data:', error);
      }
    };

    fetchMachines();
  }, []);

  const handlePredict = async (machine: Machine): Promise<string> => {
    try {
      const response = await fetch('/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(machine),
      });
      const info = await response.json();
      return info.message || 'Prediction complete';
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
              <Machine
                key={machine.id}
                id={machine.id.toString()}
                Machinename={machine.machine_id}
                ProductType={machine.ProductType}
                airtemp={machine.airtemp}
                processtemp={machine.processtemp}
                Rotationalspeed={machine.Rotationalspeed}
                torque={machine.torque}
                toolwearinmins={machine.toolwearinmins}
                status={machine.status || 'Unknown'}
                onPredict={async () => {
                  const result = await handlePredict(machine);
                  return result;
                }}
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

import React, { useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/MachineCard.css';  // Import the MachineCard component styles

// Define a type for the component props
interface MachineCardProps {
  id: string;
  Machinename: string;
  ProductType?: string; // Optional
  airtemp?: number; // Optional
  processtemp?: number; // Optional
  Rotationalspeed?: number; // Optional
  torque?: number; // Optional
  toolwearinmins?: number; // Optional
  status?: string; // Optional
  temp?: number; // Optional
  actions?: React.ReactNode; // Optional, could be a button or JSX element
  info?: string; // Optional
  conversionRate?: number; // Optional
}

const MachineCard: React.FC<MachineCardProps> = ({
  id,
  Machinename,
  ProductType,
  airtemp,
  processtemp,
  Rotationalspeed,
  torque,
  toolwearinmins,
  status,
  temp,
  actions,
  info,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (

    <div className={`card-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="card-main">
        <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
          <p>{Machinename}</p>
        </div>

        <div className="card-footer">
          <Link to={`/${id}/detail`} className="card-info">
            {info || <p>More Info</p>}
          </Link>
          <Link to={`/${id}/linechart`} className="card-chart">
            View LineChart
          </Link>
        </div>

        <div className="card-status">
          {actions || <p className={`status-indicator ${status === "On" ? "on" : "off"}`}>
            {status === "On" ? (
              <p>working</p>
            ) : (
              <p>!</p>
            )}
          </p>}
        </div>
      </div>

      {/* Dropdown content */}
      <div className={`card-dropdown ${isExpanded ? 'expanded' : ''}`}>
        <div className="card-body">
          <p><strong>Product Type:</strong> {ProductType || "N/A"}</p>
          <p>
            <strong>Air Temp:</strong> {airtemp || "N/A"}
          </p>
          <p>
            <strong>Process Temp:</strong> {processtemp || "N/A"}
          </p>
          <p>
            <strong>Rotational Speed:</strong> {Rotationalspeed || "N/A"} RPM
          </p>
          <p>
            <strong>Torque:</strong> {torque || "N/A"} Nm
          </p>
          <p>
            <strong>Tool Wear:</strong> {toolwearinmins || "N/A"} mins
          </p>
          <p>
            <strong>Temp:</strong> {temp || "N/A"}
          </p>
        </div>
      </div>
    </div >
  );
}

export default MachineCard;

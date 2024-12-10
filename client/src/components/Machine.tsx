import React from "react";
import "../styles/MachineCard.css"; // Import the CSS file for styling
import {  Link } from "react-router-dom";

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

function MachineCard({
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
  conversionRate,
}: MachineCardProps) {
  return (
    <div className="card-container">
      {/* Header */}
      <div className="card-header">
        <div>
          <h3 className="card-title">{Machinename}</h3>
          <p className="card-subtitle">Product Type: {ProductType || "N/A"}</p>
        </div>
        <p className={`status-indicator ${status === "On" ? "on" : "off"}`}>
          {status || "Unknown"}
        </p>
      </div>

      {/* Main Details */}
      <div className="card-details">
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

      {/* Conversion Rate */}
      <div className="card-footer">
        <div>
          <span className="conversion-rate-label">Conversion Rate</span>
          <span
            className={`conversion-rate ${
              conversionRate && conversionRate > 0 ? "positive" : "negative"
            }`}
          >
            {conversionRate !== undefined && conversionRate > 0
              ? `+${conversionRate}%`
              : `${conversionRate || 0}%`}
          </span>
        </div>
        <div className="progress-bar">
          <div
            className="progress"
            style={{ width: `${Math.abs(conversionRate || 0)}%` }}
          ></div>
        </div>
      </div>

      {/* Actions */}
      <div className="card-actions">
        {actions || <p>No actions available</p>}
      </div>

      {/* Additional Info */}
      <p className="card-info">{info || "No additional info"}</p>

      {/* addbutton to path id/linechart */}
      {/* Add Button */}
      <Link to={`/${id}/linechart`} className="navigate-button">
        View Line Chart
      </Link>
    </div>
  );
}

export default MachineCard;

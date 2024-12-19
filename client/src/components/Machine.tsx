import React, { useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/MachineCard.css';

interface MachineCardProps {
  id: string;
  Machinename: string;
  ProductType?: string; 
  airtemp?: number; 
  processtemp?: number; 
  Rotationalspeed?: number; 
  torque?: number; 
  toolwearinmins?: number; 
  status?: string; 
  temp?: number; 
  actions?: React.ReactNode;
  onPredict?: () => Promise<string>; 
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
  onPredict,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState<string | null>(null);

  const handlePredict = async () => {
    if (!onPredict) return;
    setIsLoading(true);
    try {
      const result = await onPredict();
      setPredictionResult(result);
    } catch (error) {
      console.error('Prediction error:', error);
      setPredictionResult('Error fetching prediction.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`card-container ${isExpanded ? 'expanded' : ''}`}>
      <div className="card-main">
        <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
          <p>{Machinename}</p>
        </div>

        <div className="card-footer">
          <Link to={`/${id}/detail`} className="card-info">
            <p>More Info</p>
          </Link>

        </div>

        <div className="card-status">
          {actions || (
            <p className={`status-indicator ${status === "On" ? "on" : "off"}`}>
              {status || "Unknown"}
            </p>
          )}
        </div>
      </div>

      {/* Dropdown content */}
      <div className={`card-dropdown ${isExpanded ? 'expanded' : ''}`}>
        <div className="card-body">
          <p><strong>Product Type:</strong> {ProductType || "N/A"}</p>
          <p><strong>Air Temp:</strong> {airtemp || "N/A"}</p>
          <p><strong>Process Temp:</strong> {processtemp || "N/A"}</p>
          <p><strong>Rotational Speed:</strong> {Rotationalspeed || "N/A"} RPM</p>
          <p><strong>Torque:</strong> {torque || "N/A"} Nm</p>
          <p><strong>Tool Wear:</strong> {toolwearinmins || "N/A"} mins</p>
          <p><strong>Temp:</strong> {temp || "N/A"}</p>
        </div>
        <div className="card-actions">
          <button onClick={handlePredict} disabled={isLoading} className="predict-btn">
            {isLoading ? 'Predicting...' : 'Predict'}
          </button>
          {predictionResult && (
            <p className="prediction-result">{predictionResult}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MachineCard;

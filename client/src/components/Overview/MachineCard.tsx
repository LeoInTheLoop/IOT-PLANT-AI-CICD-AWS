import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../../styles/MachineCard.css";
// import { on } from "events";

interface MachineCardProps {
  id: number;
  machine_id: string;
  type: string;
  airtemp: number;
  processtemp: number;
  rotationalspeed: number;
  torque: number;
  toolwearinmins: number;
  predictionResult?: string | undefined;
  onPredict?: () => Promise<string>;
}

const MachineCard: React.FC<MachineCardProps> = ({
  machine_id,
  type,
  airtemp,
  processtemp,
  rotationalspeed,
  torque,
  toolwearinmins,
  predictionResult,
  onPredict,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [predictionResult, setPredictionResult] = useState<string | null>(null);
  // console.log("MachineCard predictionResult:", predictionResult);

  useEffect(() => {
    const fetchPrediction = async () => {
      if (onPredict) {
        setIsLoading(true);
        try {
          const result = await onPredict();
          console.log("Prediction result:", result); // Debug log
          // setPredictionResult(result);
        } catch (error) {
          console.error("Prediction failed:", error);
          // setPredictionResult("Prediction failed");
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPrediction();
  }, [onPredict]);

  return (
    <div className={`card-container ${isExpanded ? "expanded" : ""}`}>
      <div className="card-main">
        <div className="card-header" onClick={() => setIsExpanded(!isExpanded)}>
          <p>{machine_id}</p>
        </div>
        <div className="card-footer">
          <Link to={`/${machine_id}/detail`} className="card-info">
            More Information
          </Link>
        </div>

        <div className="card-status">
          {isLoading ? (
            predictionResult && (
              <p
                className={`status-indicator ${
                  predictionResult === "normal" ? "on" : "off"
                }`}
              >
                {predictionResult}
              </p>
            )
          ) : (
            <p className="status-indicator predicting">Predicting</p>
          )}

          {/* {isLoading ? (
              <p className="status-indicator predicting">Predicting</p>
            ) : (
              predictionResult && (
                <p
                  className={`status-indicator ${
                    predictionResult === "normal" ? "on" : "off"
                  }`}
                >
                  {predictionResult}
                </p>
              )
            )} */}
        </div>
      </div>

      <div className={`card-dropdown ${isExpanded ? "expanded" : ""}`}>
        <div className="card-body">
          {type && <p>Type: {type}</p>}
          {airtemp !== undefined && <p>Air Temperature: {airtemp} °C</p>}
          {processtemp !== undefined && (
            <p>Process Temperature: {processtemp} °C</p>
          )}
          {rotationalspeed !== undefined && (
            <p>Rotational Speed: {rotationalspeed} RPM</p>
          )}
          {torque !== undefined && <p>Torque: {torque} Nm</p>}
          {toolwearinmins !== undefined && (
            <p>Tool Wear: {toolwearinmins} min</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MachineCard;

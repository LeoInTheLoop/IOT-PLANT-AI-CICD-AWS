# model.py
import numpy as np
from pydantic import BaseModel

# Define input data model
class SensorData(BaseModel):
    air_temperature: float
    process_temperature: float
    rotational_speed: float
    torque: float
    tool_wear: float
    type: str

# Maintenance recommendation logic
def get_maintenance_recommendation(status: str, data: SensorData) -> str:
    if status == "Critical":
        return "Immediate maintenance required. Schedule downtime within 24 hours."
    elif status == "Warning":
        return "Plan maintenance within the next week. Monitor closely."
    return "Regular maintenance schedule. No immediate action required."

# Feature engineering for input data
def prepare_features(data: SensorData):
    return np.array([
        data.air_temperature,
        data.process_temperature,
        data.rotational_speed,
        data.torque,
        data.tool_wear,
        1 if data.type == 'H' else (0.5 if data.type == 'M' else 0),  # Type encoding
        data.process_temperature - data.air_temperature,  # temp_difference
        data.rotational_speed * data.torque,  # power_estimate
        data.tool_wear / 100  # normalized wear_rate
    ]).reshape(1, -1)

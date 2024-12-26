# model.py
import numpy as np
from pydantic import BaseModel

class MachineData(BaseModel):
    airtemp: float
    processtemp: float
    rotationalspeed: float
    torque: float
    toolwearinmins: float
    type: str

# Maintenance recommendation logic
def get_maintenance_recommendation(status: str, data: MachineData) -> str:
    if status == "Critical":
        return "Immediate maintenance required. Schedule downtime within 24 hours."
    elif status == "Warning":
        return "Plan maintenance within the next week. Monitor closely."
    return "Regular maintenance schedule. No immediate action required."

# Feature engineering for input data
def prepare_features(data: MachineData):
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

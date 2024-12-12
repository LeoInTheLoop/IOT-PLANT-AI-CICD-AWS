

# BASE_DIR = Path(__file__).resolve().parent

# # Model
# tensorflow_nn_model = load_model(
#     join(BASE_DIR, "trained_models", "tensorflow_nn_model.keras")
# )

# # FastAPI
# app = FastAPI(docs_url=None, redoc_url=None)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.get("/health")
# def health_check():
#     return {"status": "healthy"}


# @app.post("/predict")
# def predict_mnist_image(file: UploadFile = File(...)):
#     try:
#         contents = file.file.read()
#         image_array = preprocess_image(contents)
#         prediction = tensorflow_nn_model.predict(image_array)

#         return {
#             "message": "Prediction successful",
#             "prediction": int(np.argmax(prediction)),
#             "probabilities": prediction.tolist()[0],
#         }
#     except Exception as e:
#         return {"message": "An error occurred"}


from tensorflow.keras.models import load_model
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from os.path import join
import numpy as np
from pydantic import BaseModel
import joblib

from typing import Annotated

from sqlmodel import Field, Session, SQLModel, create_engine, select
from datetime import datetime
# 定义输入数据模型
class SensorData(BaseModel):
    air_temperature: float
    process_temperature: float
    rotational_speed: float
    torque: float
    tool_wear: float
    type: str

BASE_DIR = Path(__file__).resolve().parent

# 加载所有模型
try:
    # 神经网络模型
    tensorflow_nn_model = load_model(
        join(BASE_DIR, "trained_models", "tensorflow_nn_model.keras")
    )
    # 决策树模型
    decision_tree_model = joblib.load(
        join(BASE_DIR, "trained_models", "decision_tree_model.joblib")
    )
    # 随机森林模型
    random_forest_model = joblib.load(
        join(BASE_DIR, "trained_models", "random_forest_model_optimized.joblib")
    )
except Exception as e:
    print(f"Model loading error: {e}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

def get_maintenance_recommendation(status: str, data: SensorData) -> str:
    if status == "Critical":
        return "Immediate maintenance required. Schedule downtime within 24 hours."
    elif status == "Warning":
        return "Plan maintenance within the next week. Monitor closely."
    return "Regular maintenance schedule. No immediate action required."

def prepare_features(data: SensorData):
    # 特征工程
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

@app.post("/predict")
async def predict_maintenance(data: SensorData):
    try:
        features = prepare_features(data)
        
        # 获取所有模型的预测结果
        nn_prediction = float(tensorflow_nn_model.predict(features)[0][0])
        dt_prediction = float(decision_tree_model.predict_proba(features)[0][1])
        rf_prediction = float(random_forest_model.predict_proba(features)[0][1])
        
        # 集成预测结果（简单平均）
        ensemble_prediction = (nn_prediction + dt_prediction + rf_prediction) / 3
        
        # 确定状态
        status = "Critical" if ensemble_prediction > 0.7 else "Warning" if ensemble_prediction > 0.3 else "Normal"
        
        return {
            "status": status,
            "ensemble_probability": ensemble_prediction,
            "individual_predictions": {
                "neural_network": nn_prediction,
                "decision_tree": dt_prediction,
                "random_forest": rf_prediction
            },
            "maintenance_needed": ensemble_prediction > 0.5,
            "recommendation": get_maintenance_recommendation(status, data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
 


class Sensor(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    machine_id: str
    ProductType: str
    airtemp: float
    processtemp: float
    Rotationalspeed: int
    torque: float
    toolwearinmins: int
    status: str
    temp: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)  # 默认接收
    

# Define another table, if necessary
class Machine(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    MachineName: str

# Database connection setup
sqlite_file_name = "database.db"


DATABASE_URL = "postgresql://postgres:postgres@db:5432/sensor_data"
engine = create_engine(DATABASE_URL, echo=True)




def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]



@app.on_event("startup")
def on_startup():
    create_db_and_tables()

# Create a new sensor entry
@app.post("/sensors/")
def create_sensor(sensor: Sensor, session: SessionDep) -> Sensor:
    try:
        session.add(sensor)
        session.commit()
        session.refresh(sensor)
        return sensor
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Read multiple sensor entries
@app.get("/sensors/")
def read_sensors(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Sensor]:
    sensors = session.exec(select(Sensor).offset(offset).limit(limit)).all()
    return sensors

# Read a single sensor entry by ID
@app.get("/sensors/{sensor_id}")
def read_sensor(sensor_id: int, session: SessionDep) -> Sensor:
    sensor = session.get(Sensor, sensor_id)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")
    return sensor

# Update a sensor entry
@app.put("/sensors/{sensor_id}")
def update_sensor(sensor_id: int, updated_sensor: Sensor, session: SessionDep) -> Sensor:
    sensor = session.get(Sensor, sensor_id)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")
    for key, value in updated_sensor.dict(exclude_unset=True).items():
        setattr(sensor, key, value)
    session.add(sensor)
    session.commit()
    session.refresh(sensor)
    return sensor

# Delete a sensor entry
@app.delete("/sensors/{sensor_id}")
def delete_sensor(sensor_id: int, session: SessionDep):
    sensor = session.get(Sensor, sensor_id)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")
    session.delete(sensor)
    session.commit()
    return {"ok": True}

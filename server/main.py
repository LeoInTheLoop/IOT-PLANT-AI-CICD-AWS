# main.py
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

import numpy as np
from typing import Annotated
from db import get_session, create_db_and_tables, SessionDep, Sensor
from model import SensorData, get_maintenance_recommendation, prepare_features
from ai import predict_ensemble

from sqlmodel import Session, select
from sqlalchemy import func
from sqlalchemy.sql import text
from mqttReceive import start_mqtt_client


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    start_mqtt_client()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict")
async def predict_maintenance(data: SensorData):
    try:
        # 预处理输入数据
        features = prepare_features(data)

        # 调用 ai.py 中的预测函数
        ensemble_result = predict_ensemble(features)
        status = ensemble_result["status"]

        # 构建返回结果
        return {
            "status": status,
            "ensemble_probability": ensemble_result["ensemble_probability"],
            "individual_predictions": ensemble_result["individual_predictions"],
            "maintenance_needed": ensemble_result["maintenance_needed"],
            "recommendation": get_maintenance_recommendation(status, data),
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# Sensor CRUD endpoints
@app.post("/sensors/")
def create_sensor(sensor: Sensor, session: SessionDep) -> Sensor:
    try:
        session.add(sensor)
        session.commit()
        session.refresh(sensor)
        return sensor
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/sensors/")
def read_sensors(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Sensor]:
    sensors = session.exec(select(Sensor).offset(offset).limit(limit)).all()
    return sensors

@app.get("/machinelist/")
def get_latest_machine(session: SessionDep) -> list[Sensor]:
    latest_machines = (
        session.exec(
            select(Sensor)
            .where(Sensor.timestamp.in_(
                # Subquery to get the latest timestamp for each machine_id
                select(func.max(Sensor.timestamp)).group_by(Sensor.machine_id)
            ))
        ).all()
    )
    return latest_machines

@app.get("/machine/{machine_id}")
def get_machine_latest_sensors(
    machine_id: str, 
    session: SessionDep, 
    limit: int = 10  
    ) -> list[Sensor]:
    # 查询特定 machine_id 
    sensors = (
        session.exec(
            select(Sensor)
            .where(Sensor.machine_id == machine_id)
            .order_by(Sensor.timestamp.desc())
            .limit(limit)
        ).all()
    )
    if not sensors:
        raise HTTPException(status_code=404, detail=f"No sensors found for machine_id {machine_id}")
    return sensors

@app.get("/sensors/{sensor_id}")
def read_sensor(sensor_id: int, session: SessionDep) -> Sensor:
    sensor = session.get(Sensor, sensor_id)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")
    return sensor

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

@app.delete("/sensors/{sensor_id}")
def delete_sensor(sensor_id: int, session: SessionDep):
    sensor = session.get(Sensor, sensor_id)
    if not sensor:
        raise HTTPException(status_code=404, detail="Sensor not found")
    session.delete(sensor)
    session.commit()
    return {"ok": True}

@app.get("/test-db")
async def test_db(session: Session = Depends(get_session)):
    try:
        result = session.execute('SELECT 1').scalar()
        return {"status": "success", "result": result}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

@app.get("/machine/{machine_id}")
def get_machine_latest_sensors(
    machine_id: str, 
    session: SessionDep, 
    limit: int = 10  
) -> list[Sensor]:
    # 查询特定 machine_id 
    sensors = (
        session.exec(
            select(Sensor)
            .where(Sensor.machine_id == machine_id)
            .order_by(Sensor.timestamp.desc())
            .limit(limit)
        ).all()
    )
    if not sensors:
        raise HTTPException(status_code=404, detail=f"No sensors found for machine_id {machine_id}")
    return sensors
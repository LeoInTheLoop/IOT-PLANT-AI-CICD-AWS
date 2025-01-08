# main.py
from fastapi import Depends, FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

import numpy as np
from typing import Annotated
from db import get_session, create_db_and_tables, SessionDep, Machine
from model import MachineData, get_maintenance_recommendation, prepare_features
from ai import predict_ensemble

from sqlmodel import Session, select
from sqlalchemy import func, and_
from sqlalchemy.sql import text
from mqttReceive import start_mqtt_client
from init_dbData import init_db  # 添加导入





app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    try:
        # 1. 首先创建数据库表
        create_db_and_tables()
        print("Database tables created successfully")
        
        # 2. 初始化随机数据
        if not init_db():
            raise Exception("Database initialization failed")
        print("Database initialized with sample data")
        
        # 3. 启动 MQTT 客户端
        start_mqtt_client()
        print("MQTT client started")
        
    except Exception as e:
        print(f"Startup error: {str(e)}")
        raise Exception(f"Application startup failed: {str(e)}")

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/predict")
async def predict_maintenance(data: MachineData):
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
    
# ---------------------------------ye
@app.post("/predict/test")
async def predict_maintenance_test(data: MachineData):
    """
    基于传感器数据进行预测的测试接口
    
    Args:
        data: 包含传感器数据的MachineData对象
    """
    try:
        # 预处理输入数据
        features = prepare_features(data)
        
        # 进行预测
        ensemble_result = predict_ensemble(features)
        status = ensemble_result["status"]
        
        # 返回预测结果
        return {
            "status": status,
            "ensemble_probability": ensemble_result["ensemble_probability"],
            "individual_predictions": ensemble_result["individual_predictions"],
            "maintenance_needed": ensemble_result["maintenance_needed"],
            "recommendation": get_maintenance_recommendation(status, data)
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction error: {str(e)}"
        )
    

# ---------------------ye.3
# -------------ye.2
@app.post("/Machines/predict-historical")
async def predict_historical(data: MachineData):
    try:
        # 使用传入的具体数据进行预测
        features = prepare_features(data)
        ensemble_result = predict_ensemble(features)
        return ensemble_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/fakepredict")
async def predict_maintenance(data: MachineData):
    """
    Performs a fake prediction based on data completeness and random chance.
    """
    print(data.dict()) 
    try:
        # Validate data completeness
        required_fields = ["type","airtemp", "processtemp", "rotationalspeed", "torque", "toolwearinmins"]
        missing_fields = [field for field in required_fields if not hasattr(data, field)]
        if missing_fields:
            raise HTTPException(
                status_code=400,
                detail=f"Missing required sensor data fields: {', '.join(missing_fields)}",
            )
        
        print("Fake prediction running...")  # Replace console.log with Python's print
        
        # Simulate processing time (e.g., 5 seconds delay)
        import time
        time.sleep(2)

    
        # Randomly simulate prediction (replace with actual prediction logic)
        status = np.random.choice(["normal", "warning"], p=[0.8, 0.2])

        # Return the fake prediction result
        return {"status": status}
    except Exception as e:
        # Catch any exceptions and raise an HTTPException with details
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}")

@app.get("/machines/latest")
def get_latest_machine_data(session: SessionDep) -> list[Machine]:
    """获取所有机器的最新数据

    Args:
        session: 数据库会话

    Returns:
        List[Machine]: 所有机器的最新数据列表
    """

    # 使用 subquery 获取每个机器的最新 timestamp
    subquery = (
        session.query(
            Machine.machine_id,
            func.max(Machine.timestamp).label("latest_timestamp"),
        )
        .group_by(Machine.machine_id)
        .subquery()
    )

    # 使用 join 获取对应的数据
    latest_machines = (
        session.query(Machine)
        .join(
            subquery,
            and_(
                Machine.machine_id == subquery.c.machine_id,
                Machine.timestamp == subquery.c.latest_timestamp,
            ),
        )
        .all()
    )

    return latest_machines

# Machine CRUD endpoints
@app.post("/Machine/")
def create_Machine(Machine: Machine, session: SessionDep) -> Machine:
    try:
        session.add(Machine)
        session.commit()
        session.refresh(Machine)
        return Machine
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/Machines/")
def read_Machines(
    session: SessionDep,
    offset: int = 0,
    limit: Annotated[int, Query(le=100)] = 100,
) -> list[Machine]:
    Machines = session.exec(select(Machine).offset(offset).limit(limit)).all()
    return Machines


@app.get("/Machines/{machine_id}", response_model=list[Machine])
def read_machine(machine_id: str, session: SessionDep) -> list[Machine]:
    machines = session.query(Machine).filter(Machine.machine_id == machine_id).order_by(Machine.timestamp.asc()).limit(10).all()
    if not machines:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machines


@app.put("/Machines/{machine_id}")
def update_machine(machine_id: str, updated_machine: Machine, session: SessionDep) -> Machine:
    machine = session.exec(
        session.query(Machine).filter(Machine.machine_id == machine_id).first()
    )
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    for key, value in updated_machine.dict(exclude_unset=True).items():
        setattr(machine, key, value)
    session.add(machine)
    session.commit()
    session.refresh(machine)
    return machine

@app.delete("/Machines/{machine_id}")
def delete_machine(machine_id: str, session: SessionDep):
    machine = session.exec(
        session.query(Machine).filter(Machine.machine_id == machine_id).first()
    )
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    session.delete(machine)
    session.commit()
    return {"ok": True}


@app.get("/Machines/by-id/{id}")
def read_machine_by_id(id: int, session: SessionDep) -> Machine:
    machine = session.get(Machine, id)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    return machine

@app.delete("/Machines/by-id/{id}")
def delete_machine_by_id(id: int, session: SessionDep):
    machine = session.get(Machine, id)
    if not machine:
        raise HTTPException(status_code=404, detail="Machine not found")
    session.delete(machine)
    session.commit()
    return {"ok": True}


@app.get("/test-db")
async def test_db(session: Session = Depends(get_session)):
    try:
        result = session.execute('SELECT 1').scalar()
        return {"status": "success", "result": result}
    except Exception as e:
        return {"status": "error", "detail": str(e)}




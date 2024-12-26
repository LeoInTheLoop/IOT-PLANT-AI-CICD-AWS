from sqlmodel import Field, Session, SQLModel, create_engine
from fastapi import Depends, FastAPI, HTTPException
from typing import Annotated
from datetime import datetime
import random
from datetime import timedelta
import pandas as pd

# Database connection setup
sqlite_file_name = "database.db"
DATABASE_URL = "postgresql://postgres:postgres@db:5432/Machine_data"
engine = create_engine(DATABASE_URL, echo=True)

# Define table
class Machine(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    machine_id: str = Field(default="unknown")
    type: str
    airtemp: float
    processtemp: float
    rotationalspeed: int
    torque: float
    toolwearinmins: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    mqtt_message_id: str = Field(default=None)

# # Create tables
# def create_db_and_tables():
#     SQLModel.metadata.create_all(engine)

# Dependency for database session
# def get_session():
#     with Session(engine) as session:
#         yield session

# SessionDep = Annotated[Session, Depends(get_session)]



# Initialize database with sample data
config = {
    "db_url": DATABASE_URL,
    "initial_data_count": 100,
    "time_interval": 5  # seconds
}

def generate_random_machine_data(num_machines):
    """Generate random machine data."""
    machines = []
    start_time = datetime.now()
    for i in range(num_machines):
        machine = Machine(
            machine_id=f"M-{random.randint(1, 7)}",
            type=random.choice(["A", "B", "C"]),
            airtemp=round(random.uniform(290, 310),2),
            processtemp=round(random.uniform(300, 320)),
            rotationalspeed=round(random.randint(1000, 2000)),
            torque=round(random.uniform(20, 60)),
            toolwearinmins=round(random.randint(0, 200)),
            timestamp=start_time + timedelta(seconds=i * config["time_interval"])
        )
        machines.append(machine)
    return machines

def recreate_db(engine):
    """Drop and recreate database tables."""
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

def initialize_data(config):
    """Initialize database with sample data."""
    engine = create_engine(config["db_url"], echo=True)
    recreate_db(engine)

    initial_machines = generate_random_machine_data(config["initial_data_count"])

    with Session(engine) as session:
        session.add_all(initial_machines)
        session.commit()

    print("Initial data inserted successfully.")

# ---------------------ye
def import_realtime_data(csv_path):
    """导入实时数据从CSV文件"""
    try:
        # 读取CSV文件
        df = pd.read_csv(csv_path)
        
        # 创建Machine对象列表
        machines = []
        for _, row in df.iterrows():
            machine = Machine(
                machine_id=str(row['UDI']),  # 转换为字符串
                type=row['Type'],
                airtemp=float(row['Air temperature [K]']),
                processtemp=float(row['Process temperature [K]']),
                rotationalspeed=int(row['Rotational speed [rpm]']),
                torque=float(row['Torque [Nm]']),
                toolwearinmins=int(row['Tool wear [min]']),
                timestamp=datetime.now()  # 使用当前时间
            )
            machines.append(machine)
        
        # 保存到数据库
        with Session(engine) as session:
            session.add_all(machines)
            session.commit()
            
        print(f"成功导入 {len(machines)} 条实时数据")
        
    except Exception as e:
        print(f"导入失败: {str(e)}")

if __name__ == "__main__":
    initialize_data(config)
    # --------------ye
    csv_path = "../Data/realtime_data.csv"  
    import_realtime_data(csv_path)

from sqlmodel import Field, Session, SQLModel, create_engine
from fastapi import Depends, FastAPI, HTTPException

from datetime import datetime, timedelta
#import random
import pandas as pd
from db import Machine, DATABASE_URL

DATABASE_URL = "postgresql://postgres:postgres@db:5432/Realtime_data"
engine = create_engine(DATABASE_URL, echo=True)

def recreate_db(engine):
    """Drop and recreate database tables."""
    SQLModel.metadata.drop_all(engine)
    SQLModel.metadata.create_all(engine)

# Initialize database with sample data
# config = {
#     "db_url": DATABASE_URL,
#     "initial_data_count": 100,
#     "time_interval": 5  # seconds
# }

# Comment out random data generation functions
'''
def generate_random_machine_data(num_machines):
    """Generate random machine data."""
    machines = []
    start_time = datetime.now()
    for i in range(num_machines):
        machine_type = random.choice(["H", "M", "L"])
        machine_id = machine_type + str(random.randint(1, 2))

        machine = Machine(
           
            type=machine_type,
            machine_id = machine_id,
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
'''

def import_realtime_data(csv_path):
    try:
        # 读取CSV文件
        df = pd.read_csv(csv_path)
        
        # 创建用于跟踪每种类型机器数量的字典
        type_counters = {'L': 1, 'M': 1, 'H': 1}
        start_time = datetime.now()
        
        # 创建Machine对象列表
        realtime_machines = []
        for i, row in df.iterrows():
            machine_type = row['Type']
            machine_id = f"{machine_type}{type_counters[machine_type]}"
            
            machine = Machine(
                machine_id=machine_id,
                type=machine_type,
                airtemp=float(row['Air temperature [K]']),
                processtemp=float(row['Process temperature [K]']),
                rotationalspeed=int(row['Rotational speed [rpm]']),
                torque=float(row['Torque [Nm]']),
                toolwearinmins=int(row['Tool wear [min]']),
                timestamp=start_time + timedelta(seconds=i * 10)
            )
            realtime_machines.append(machine)
            
        
        # 保存到数据库
        with Session(engine) as session:
            session.add_all(realtime_machines)
            session.commit()
            
        print(f"Successfully imported {len(realtime_machines)} records of realtime data")
        
    except Exception as e:
        print(f"Import failed: {str(e)}")

def init_db():
    try:
        recreate_db(engine)  # Reset database tables
        csv_path = "Data/realtime_data.csv"
        import_realtime_data(csv_path)
        return True
    except Exception as e:
        print(f"Database initialization failed: {str(e)}")
        return False

if __name__ == "__main__":
    init_db()

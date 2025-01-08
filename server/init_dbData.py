from sqlmodel import Field, Session, SQLModel, create_engine
from fastapi import Depends, FastAPI, HTTPException

from datetime import datetime, timedelta
import random
import pandas as pd
from db import Machine, DATABASE_URL  # Import Machine model from db.py



DATABASE_URL = "postgresql://postgres:postgres@db:5432/Realtime_data"



engine = create_engine(DATABASE_URL, echo=True)




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

# def generate_testmachine_data(num_machines, machine_id="m-test", machine_type="M"):
#     """生成特定测试机器的随机数据

  
#     """
#     machines = []
#     start_time = datetime.now()
#     for i in range(num_machines):
#         machine = Machine(
#             machine_id=machine_id,
#             type=machine_type,
#             airtemp=round(random.uniform(290, 310), 2),
#             processtemp=round(random.uniform(300, 320), 2),
#             rotationalspeed=round(random.randint(1000, 2000)),
#             torque=round(random.uniform(20, 60), 2),
#             toolwearinmins=round(random.randint(0, 200)),
#             timestamp=start_time + timedelta(seconds=i * 5),
#         )
#         machines.append(machine)
#     return machines





def insert_data(data):
 
    with Session(engine) as session:
        session.add_all(data)
        session.commit()
        print(f"Successfully inserted {len(data)} rows of data.")

# ---------------------ye
# def import_realtime_data(csv_path):
 
#     try:
#         # 读取CSV文件
#         df = pd.read_csv(csv_path)
        
#         # 创建Machine对象列表
#         realtime_machines = []
#         for _, row in df.iterrows():
#             realtime_machines = Machine(
#                 machine_id=str(row['UDI']),  # 转换为字符串
#                 type=row['Type'],
#                 airtemp=float(row['Air temperature [K]']),
#                 processtemp=float(row['Process temperature [K]']),
#                 rotationalspeed=int(row['Rotational speed [rpm]']),
#                 torque=float(row['Torque [Nm]']),
#                 toolwearinmins=int(row['Tool wear [min]']),
#                 timestamp=datetime.now()  # 使用当前时间
#             )
#             realtime_machines.append(realtime_machines)
        
#         # 保存到数据库
#         with Session(engine) as session:
#             session.add_all(realtime_machines)
#             session.commit()
            
#         print(f"成功导入 {len(realtime_machines)} 条实时数据")
        
#     except Exception as e:
#         print(f"导入失败: {str(e)}")

# 修改主函数，使其可以被其他文件调用
def init_db():
    try:
        initialize_data(config)
        # test_machine_data = generate_testmachine_data(10)
        # insert_data(test_machine_data)
        # csv_path = "../Data/realtime_data.csv"  
        # import_realtime_data(csv_path)
        return True
    except Exception as e:
        print(f"Database initialization failed: {str(e)}")
        return False

if __name__ == "__main__":
    init_db()

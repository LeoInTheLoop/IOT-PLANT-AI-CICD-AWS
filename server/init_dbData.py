from sqlmodel import Session, create_engine, SQLModel
from db import Sensor, create_db_and_tables  

# 数据库连接设置
sqlite_file_name = "database.db"
DATABASE_URL = "postgresql://postgres:postgres@db:5432/sensor_data"
engine = create_engine(DATABASE_URL, echo=True)

# 初始化数据

def recreate_db():
    # 删除现有表结构
    SQLModel.metadata.drop_all(engine)
    # 创建新的表结构
    SQLModel.metadata.create_all(engine)

    
def initialize_data():
    recreate_db()  

    initial_sensors = [

        Sensor(
            machine_id="M",
            ProductType="M",
            airtemp=301.4,
            processtemp=310.6,
            Rotationalspeed=1459,
            torque=46.9,
            toolwearinmins=27,
            timestamp="2023-12-14T00:00:00"
        ),
        Sensor(
            machine_id="M",
            ProductType="M",
            airtemp=301.4,
            processtemp=310.7,
            Rotationalspeed=1692,
            torque=32.3,
            toolwearinmins=5,
            timestamp="2023-12-14T00:00:05"
        ),
        Sensor(
            machine_id="M",
            ProductType="M",
            airtemp=301.4,
            processtemp=310.6,
            Rotationalspeed=1630,
            torque=30.3,
            toolwearinmins=2,
            timestamp="2023-12-14T00:00:10"
        ),
        Sensor(
            machine_id="M",
            ProductType="M",
            airtemp=301.3,
            processtemp=310.7,
            Rotationalspeed=1532,
            torque=40.7,
            toolwearinmins=178,
            timestamp="2023-12-14T00:00:15"
        ),
        Sensor(
            machine_id="M",
            ProductType="M",
            airtemp=301.5,
            processtemp=310.8,
            Rotationalspeed=1628,
            torque=36.4,
            toolwearinmins=167,
            timestamp="2023-12-14T00:00:20"
        ),
        Sensor(
            machine_id="M",
            ProductType="M",
            airtemp=295.6,
            processtemp=306.1,
            Rotationalspeed=1669,
            torque=29,
            toolwearinmins=161,
            timestamp="2023-12-14T00:00:25"
        ),
        # ... 继续添加剩余的 Sensor 对象 ...
        Sensor(
            machine_id="H",
            ProductType="H",
            airtemp=298.8,
            processtemp=308.8,
            Rotationalspeed=1306,
            torque=54.5,
            toolwearinmins=50,
            timestamp="2023-12-14T00:00:25"
        ),
        Sensor(
            machine_id="H",
            ProductType="H",
            airtemp=298.9,
            processtemp=309.3,
            Rotationalspeed=1375,
            torque=42.7,
            toolwearinmins=58,
            timestamp="2023-12-14T00:00:30"
        ),
        # ... 继续添加剩余的 Sensor 对象 ...
    ]




    with Session(engine) as session:
        # 插入数据
        session.add_all(initial_sensors)
        
        session.commit()

    print("Initial data inserted successfully.")

if __name__ == "__main__":
    initialize_data()

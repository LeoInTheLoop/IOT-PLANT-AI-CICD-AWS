from sqlmodel import Field, Session, SQLModel, create_engine
from fastapi import Depends
from typing import Annotated
from datetime import datetime

# Database connection setup
sqlite_file_name = "database.db"
DATABASE_URL = "postgresql://postgres:postgres@db:5432/sensor_data"
engine = create_engine(DATABASE_URL, echo=True)

# Define Sensor table
class Sensor(SQLModel, table=True):
    id: int = Field(default=None, primary_key=True)
    machine_id: str
    ProductType: str
    airtemp: float
    processtemp: float
    Rotationalspeed: int
    torque: float
    toolwearinmins: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)



# Create tables
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Dependency for database session
def get_session():
    with Session(engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

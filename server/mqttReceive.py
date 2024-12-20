import paho.mqtt.client as mqtt
import json
from db import get_session, Sensor, engine
from sqlmodel import Session

# MQTT 回调函数
def on_message(client, userdata, msg):
    try:
        # 解码接收到的消息
        payload = json.loads(msg.payload.decode('utf-8'))
        
        # 创建一个 Sensor 实例
        new_sensor_data = Sensor(
            machine_id=payload.get("machine_id"),
            ProductType=payload.get("ProductType"),
            airtemp=payload.get("airtemp"),
            processtemp=payload.get("processtemp"),
            Rotationalspeed=payload.get("Rotationalspeed"),
            torque=payload.get("torque"),
            toolwearinmins=payload.get("toolwearinmins"),
            mqtt_message_id=msg.topic  # 记录 MQTT 主题
        )
        
        # 将数据存储到数据库
        with Session(engine) as session:
            session.add(new_sensor_data)
            session.commit()
            print("New data inserted:", new_sensor_data)
    
    except Exception as e:
        print(f"Error processing MQTT message: {e}")

    # MQTT 连接成功的回调函数
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker successfully.")
    else:
        print("Failed to connect to MQTT Broker, return code %d\n", rc)

# MQTT 客户端设置
def start_mqtt_client():
    client = mqtt.Client()
    client.on_message = on_message
    
    # 配置 MQTT Broker 地址和端口
    client.connect("broker.emqx.io", 1883, 60)
    client.on_connect = on_connect 
    # 订阅主题
    client.subscribe("sensor/data")
    
    # 开始 MQTT 客户端循环
    client.loop_start()


'''
# test method

mosquitto_pub -h test.mosquitto.org -t "sensor/data" -m '{
    "machine_id": "M1",
    "ProductType": "A",
    "airtemp": 25.0,
    "processtemp": 30.5,
    "Rotationalspeed": 1000,
    "torque": 45.0,
    "toolwearinmins": 50
}'

'''
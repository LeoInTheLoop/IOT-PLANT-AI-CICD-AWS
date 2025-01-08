import paho.mqtt.client as mqtt
import json
from db import get_session, Machine, engine
from sqlmodel import Session


def on_message(client, userdata, msg):
    try:
    
        payload = json.loads(msg.payload.decode('utf-8'))
        
       
        new_Machine_data = Machine(
            machine_id=payload.get("machine_id"),
            type=payload.get("ProductType"),
            airtemp=payload.get("airtemp"),
            processtemp=payload.get("processtemp"),
            rotationalspeed=payload.get("Rotationalspeed"),
            torque=payload.get("torque"),
            toolwearinmins=payload.get("toolwearinmins"),
            mqtt_message_id=msg.topic  # 记录 MQTT 主题
        )
        
        # save data to database
        # 保存数据到数据库
        with Session(engine) as session:
            session.add(new_Machine_data)
            session.commit()
            print("New data inserted:", new_Machine_data)
    
    except Exception as e:
        print(f"Error processing MQTT message: {e}")

    # show connect status
def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT Broker successfully.")
    else:
        print("Failed to connect to MQTT Broker, return code %d\n", rc)

# MQTT client setup
def start_mqtt_client():
    client = mqtt.Client()
    client.on_message = on_message
    
    # configure mqtt broker address and port
    client.connect("broker.hivemq.com", 1883, 60)
    client.on_connect = on_connect 
    # subscribe topic
    client.subscribe("Machine/data")
    
    client.loop_start()


'''
# test method

mosquitto_pub -h broker.hivemq.com -t "Machine/data" -m '{
    "machine_id": "lll",
    "ProductType": "A",
    "airtemp": 25.0,
    "processtemp": 30.5,
    "Rotationalspeed": 1000,
    "torque": 45.0,
    "toolwearinmins": 50
}'

可用测试mqtt网站
broker.hivemq.com  
broker.emqx.io
test.mosquitto.org

'''
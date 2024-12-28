# test_predict.py
import requests
import pandas as pd

def test_prediction():
    # 读取CSV文件中的一行数据
    df = pd.read_csv("../Data/realtime_data.csv")
    row = df.iloc[0]  # 获取第一行数据
    
    # 构造请求数据
    test_data = {
        "airtemp": float(row['Air temperature [K]']),
        "processtemp": float(row['Process temperature [K]']),
        "rotationalspeed": float(row['Rotational speed [rpm]']),
        "torque": float(row['Torque [Nm]']),
        "toolwearinmins": float(row['Tool wear [min]']),
        "type": row['Type']
    }
    
    # 发送POST请求
    url = "http://localhost:5001/predict/test"
    response = requests.post(url, json=test_data)
    
    # 打印结果
    print("Status Code:", response.status_code)
    print("Prediction Result:", response.json())

if __name__ == "__main__":
    test_prediction()
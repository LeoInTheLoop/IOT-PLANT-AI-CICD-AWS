# from tensorflow.keras.models import load_model
# from os.path import join
# from io import BytesIO
# import numpy as np
# import PIL.Image as Image
# import PIL.ImageOps as ImageOps
# from fastapi import FastAPI, File, UploadFile
# from fastapi.middleware.cors import CORSMiddleware
# from pathlib import Path

# BASE_DIR = Path(__file__).resolve().parent

# # Model
# tensorflow_nn_model = load_model(
#     join(BASE_DIR, "trained_models", "tensorflow_nn_model.keras")
# )


# def preprocess_image(contents: bytes) -> np.ndarray:
#     pil_image = Image.open(BytesIO(contents))
#     pil_image = pil_image.convert("L")
#     pil_image = ImageOps.invert(pil_image)
#     pil_image = pil_image.resize((20, 20), Image.Resampling.LANCZOS)

#     image_array = np.array(pil_image).astype(np.float32)
#     image_array = np.pad(image_array, 4, mode="constant", constant_values=0)
#     image_array = image_array.reshape(1, -1) / 255.0

#     return image_array


# # FastAPI
# app = FastAPI(docs_url=None, redoc_url=None)

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


# @app.get("/health")
# def health_check():
#     return {"status": "healthy"}


# @app.post("/predict")
# def predict_mnist_image(file: UploadFile = File(...)):
#     try:
#         contents = file.file.read()
#         image_array = preprocess_image(contents)
#         prediction = tensorflow_nn_model.predict(image_array)

#         return {
#             "message": "Prediction successful",
#             "prediction": int(np.argmax(prediction)),
#             "probabilities": prediction.tolist()[0],
#         }
#     except Exception as e:
#         return {"message": "An error occurred"}


from tensorflow.keras.models import load_model
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from os.path import join
import numpy as np
from pydantic import BaseModel
import joblib

# 定义输入数据模型
class SensorData(BaseModel):
    air_temperature: float
    process_temperature: float
    rotational_speed: float
    torque: float
    tool_wear: float
    type: str

BASE_DIR = Path(__file__).resolve().parent

# 加载所有模型
try:
    # 神经网络模型
    tensorflow_nn_model = load_model(
        join(BASE_DIR, "trained_models", "tensorflow_nn_model.keras")
    )
    # 决策树模型
    decision_tree_model = joblib.load(
        join(BASE_DIR, "trained_models", "decision_tree_model.joblib")
    )
    # 随机森林模型
    random_forest_model = joblib.load(
        join(BASE_DIR, "trained_models", "random_forest_model_optimized.joblib")
    )
except Exception as e:
    print(f"Model loading error: {e}")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "healthy"}

def get_maintenance_recommendation(status: str, data: SensorData) -> str:
    if status == "Critical":
        return "Immediate maintenance required. Schedule downtime within 24 hours."
    elif status == "Warning":
        return "Plan maintenance within the next week. Monitor closely."
    return "Regular maintenance schedule. No immediate action required."

def prepare_features(data: SensorData):
    # 特征工程
    return np.array([
        data.air_temperature,
        data.process_temperature,
        data.rotational_speed,
        data.torque,
        data.tool_wear,
        1 if data.type == 'H' else (0.5 if data.type == 'M' else 0),  # Type encoding
        data.process_temperature - data.air_temperature,  # temp_difference
        data.rotational_speed * data.torque,  # power_estimate
        data.tool_wear / 100  # normalized wear_rate
    ]).reshape(1, -1)

@app.post("/predict")
async def predict_maintenance(data: SensorData):
    try:
        features = prepare_features(data)
        
        # 获取所有模型的预测结果
        nn_prediction = float(tensorflow_nn_model.predict(features)[0][0])
        dt_prediction = float(decision_tree_model.predict_proba(features)[0][1])
        rf_prediction = float(random_forest_model.predict_proba(features)[0][1])
        
        # 集成预测结果（简单平均）
        ensemble_prediction = (nn_prediction + dt_prediction + rf_prediction) / 3
        
        # 确定状态
        status = "Critical" if ensemble_prediction > 0.7 else "Warning" if ensemble_prediction > 0.3 else "Normal"
        
        return {
            "status": status,
            "ensemble_probability": ensemble_prediction,
            "individual_predictions": {
                "neural_network": nn_prediction,
                "decision_tree": dt_prediction,
                "random_forest": rf_prediction
            },
            "maintenance_needed": ensemble_prediction > 0.5,
            "recommendation": get_maintenance_recommendation(status, data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
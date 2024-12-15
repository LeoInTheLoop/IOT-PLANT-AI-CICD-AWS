# ai.py
from tensorflow.keras.models import load_model
import joblib
import numpy as np
from pathlib import Path
from os.path import join

BASE_DIR = Path(__file__).resolve().parent

# Load all models
try:
    tensorflow_nn_model = load_model(join(BASE_DIR, "trained_models", "tensorflow_nn_model.keras"))
    decision_tree_model = joblib.load(join(BASE_DIR, "trained_models", "decision_tree_model.joblib"))
    random_forest_model = joblib.load(join(BASE_DIR, "trained_models", "random_forest_model_optimized.joblib"))
except Exception as e:
    print(f"Model loading error: {e}")

# Predict function for all models
def predict_ensemble(features: np.ndarray):
    try:
        nn_prediction = float(tensorflow_nn_model.predict(features)[0][0])
        dt_prediction = float(decision_tree_model.predict_proba(features)[0][1])
        rf_prediction = float(random_forest_model.predict_proba(features)[0][1])
        
        ensemble_prediction = (nn_prediction + dt_prediction + rf_prediction) / 3
        status = "Critical" if ensemble_prediction > 0.7 else "Warning" if ensemble_prediction > 0.3 else "Normal"
        
        return {
            "status": status,
            "ensemble_probability": ensemble_prediction,
            "individual_predictions": {
                "neural_network": nn_prediction,
                "decision_tree": dt_prediction,
                "random_forest": rf_prediction
            },
            "maintenance_needed": ensemble_prediction > 0.5
        }
    except Exception as e:
        raise ValueError(f"Prediction error: {str(e)}")

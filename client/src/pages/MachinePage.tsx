import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// import { useParams } from 'react-router-dom';

interface SensorData {
  air_temperature: number;
  process_temperature: number;
  rotational_speed: number;
  torque: number;
  tool_wear: number;
  type: string;
}

interface PredictionResult {
  status: string;
  ensemble_probability: number;
  individual_predictions: {
    neural_network: number;
    decision_tree: number;
    random_forest: number;
  };
  maintenance_needed: boolean;
  recommendation: string;
}

const MachinePage: React.FC = () => {
  // const { id } = useParams();
  const [sensorData, setSensorData] = useState<SensorData | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [historicalData, setHistoricalData] = useState<SensorData[]>([]);

  // 模拟获取传感器数据
  useEffect(() => {
    const fetchData = async () => {
      // TODO: 替换为实际的API调用
      const mockData: SensorData = {
        air_temperature: 295 + Math.random() * 10,
        process_temperature: 310 + Math.random() * 10,
        rotational_speed: 1500 + Math.random() * 500,
        torque: 40 + Math.random() * 20,
        tool_wear: 100 + Math.random() * 50,
        type: 'M'
      };

      setSensorData(mockData);
      setHistoricalData(prev => [...prev, mockData].slice(-20));

      // 调用预测API
      try {
        const response = await fetch('http://localhost:5001/predict', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockData),
        });
        const predictionData = await response.json();
        setPrediction(predictionData);
      } catch (error) {
        console.error('Prediction error:', error);
      }
    };

    const interval = setInterval(fetchData, 5000); // 每5秒更新一次
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'normal': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* <h1 className="text-2xl font-bold mb-6">设备监控仪表盘</h1> */}
      <h1 className="text-2xl font-bold mb-6">Equipment Monitoring Dashboard</h1>


      {/* 状态概览 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Device Status</h2>
          {prediction && (
            <div className={`p-4 rounded-lg ${getStatusColor(prediction.status)}`}>
              {prediction.status}
            </div>
          )}
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Maintenance recommendations</h2>
          {prediction?.recommendation && (
            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg">
              {prediction.recommendation}
            </div>
          )}
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Predictive Probability</h2>
          {prediction?.individual_predictions && (
            <div className="space-y-2">
              <div>Neural Network: {(prediction.individual_predictions.neural_network * 100).toFixed(1)}%</div>
              <div>Decision Tree: {(prediction.individual_predictions.decision_tree * 100).toFixed(1)}%</div>
              <div>Random Forest: {(prediction.individual_predictions.random_forest * 100).toFixed(1)}%</div>
              <div className="font-bold mt-2">
                Comprehensive Prediction: {(prediction.ensemble_probability * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 传感器数据图表 */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <h2 className="text-lg font-semibold mb-4">Sensor Data Trends</h2>
        <div className="w-full overflow-x-auto">
          <LineChart width={800} height={400} data={historicalData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="air_temperature" stroke="#8884d8" name="air_temperature" />
            <Line type="monotone" dataKey="process_temperature" stroke="#82ca9d" name="process_temperature" />
            <Line type="monotone" dataKey="rotational_speed" stroke="#ffc658" name="rotational_speed" />
          </LineChart>
        </div>
      </div>

      {/* 实时传感器数据 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-4">Real-Time Sensor Data</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {sensorData && Object.entries(sensorData).map(([key, value]) => (
            <div key={key} className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">{key}</div>
              <div className="text-lg font-semibold">{typeof value === 'number' ? value.toFixed(2) : value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MachinePage;
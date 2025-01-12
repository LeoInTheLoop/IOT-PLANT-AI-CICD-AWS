import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";

function MachineChart() {
  const { machine_id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [machineType, setMachineType] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [machineData, setMachineData] = useState<any>({ data: [] });

  useEffect(() => {
    const fetchData = async () => {
      // Initialize loading state
      setIsLoading(true);
      // Clear any existing errors
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:5001/Machines/${machine_id}`
        );

        // Sort data by timestamp in ascending order
        const formattedData = response.data
          .sort(
            (a: any, b: any) =>
              new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
          .map((item: any) => ({
            ...item,
            timestamp: new Date(item.timestamp).toLocaleString(),
          }));

        // Update machine data state
        setMachineData({ data: formattedData });
        if (response.data.length > 0) {
          setMachineType(response.data[0].type); // Update machine type state
        }

        // Predict data
        const predictionPromises = formattedData.map(async (item: any) => {
          try {
            const predictionData = {
              type: item.type,
              airtemp: item.airtemp,
              processtemp: item.processtemp,
              rotationalspeed: item.rotationalspeed,
              torque: item.torque,
              toolwearinmins: item.toolwearinmins,
            };

            const predResponse = await axios.post(
              "http://localhost:5001/Machines/predict-historical",
              predictionData
            );

            return {
              timestamp: item.timestamp,
              prediction: predResponse.data,
            };
          } catch (predError) {
            console.error("预测请求失败:", predError);
            return {
              timestamp: item.timestamp,
              prediction: {
                status: "error",
                ensemble_probability: 0,
                recommendation: "获取预测失败",
              },
            };
          }
        });

        const predictionResults = await Promise.all(predictionPromises);
        setPredictions(predictionResults);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [machine_id]);

  // Get the latest prediction (last item in the sorted array)
  const latestPrediction = predictions[predictions.length - 1];

  return (
    <div>
      {isLoading ? (
        <p className="text-xl text-center p-4 text-[#173F51]">
          Loading data...
        </p>
      ) : error ? (
        <p className="text-xl text-center p-4 text-[#173F51]">
          Load data failed: {error.message}
        </p>
      ) : (
        <div className="m-4 space-y-12 p-8 w-[70%] mx-auto">
          <div className="text-center p-4">
            <p className="text-left text-lg font-bold p-1 text-[#173F51] ">
              Machine Type: {machineType || "Unknown"}
            </p>
          </div>

          <div className="p-2 m-0 rounded-lg text-[#173F51] bg-[#d4eaf7] shadow-lg">
            <p className="text-left text-lg font-bold block p-2">
              Latest prediction status
            </p>
            {latestPrediction && (
              <div className="p-4">
                <p>Status: {latestPrediction.prediction.status}</p>
                <p>
                  Possibility of failure:{" "}
                  {(
                    latestPrediction.prediction.ensemble_probability * 100
                  ).toFixed(2)}
                  %
                </p>
                <p>Advice: {latestPrediction.prediction.recommendation}</p>
              </div>
            )}
          </div>

          {/* Rest of the charts remain unchanged */}
          <div className="w-full col-span-10 rounded bg-[#f5f4f1] shadow-md">
            <ResponsiveContainer width="100%" height={500} className="p-4">
              <LineChart data={machineData.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  type="category"
                  tick={{ fontSize: 12 }}
                />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="airtemp"
                  stroke="#ff7f50"
                  name="Air Temperature (°C)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="processtemp"
                  stroke="#4682b4"
                  name="Process Temperature (°C)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full col-span-10 rounded bg-[#f5f4f1] shadow-md">
            <ResponsiveContainer width="100%" height={500} className="p-4">
              <LineChart data={machineData.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  type="category"
                  tick={{ fontSize: 12 }}
                />
                <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="rotationalspeed"
                  stroke="#bc6c25"
                  name="Rotational Speed (RPM)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="torque"
                  stroke="#00668c"
                  name="Torque (Nm)"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full col-span-10 rounded bg-[#f5f4f1] shadow-md">
            <ResponsiveContainer width="100%" height={400} className="p-4">
              <BarChart data={machineData.data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="timestamp"
                  type="category"
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="toolwearinmins"
                  fill="#658864"
                  name="Tool Wear (Minutes)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full col-span-10 rounded bg-[#f5f4f1] shadow-md">
            <ResponsiveContainer width="100%" height={300} className="p-4">
              <BarChart data={predictions}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" type="category" />
                <YAxis domain={[0, 1]} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="prediction.ensemble_probability"
                  fill="#8884d8"
                  name="Predict probability of failure"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default MachineChart;

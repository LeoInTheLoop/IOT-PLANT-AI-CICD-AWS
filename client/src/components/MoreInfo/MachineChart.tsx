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
  const [machineData, setMachineData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:5001/Machines/${machine_id}`
        );
        const formattedData = response.data.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp).toLocaleString(), // 格式化时间戳
        }));
        setMachineData({ data: formattedData });
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [machine_id]);

  return (
    <div>
      {isLoading ? (
        <p className="text-xl text-center p-4">Loading data...</p>
      ) : error ? (
        <p className="text-xl text-center p-4">
          Load data failed: {error.message}
        </p>
      ) : (
        <div className="m-4 space-y-12  p-8">
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
                  name="rotationalspeed (rpm)"
                  strokeWidth={2}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="torque"
                  stroke="#00668c"
                  name="torque (Nm)"
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
                  name="toolwearinmins (分钟)"
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

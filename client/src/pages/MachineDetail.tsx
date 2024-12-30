import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from 'recharts';

function MachineDetail() { // 修改为 MachineDetail
  const { machine_id } = useParams();
  const [machineData, setMachineData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`http://localhost:5001/Machines/${machine_id}`);
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
        <p>正在加载数据...</p>
      ) : error ? (
        <p>加载数据失败: {error.message}</p>
      ) : (
        <div>
          <h2>机器 ID: {machine_id}</h2>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={machineData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" type="category" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="rotationalspeed" stroke="#8884d8" name="旋转速度 (rpm)" />
              <Line yAxisId="right" type="monotone" dataKey="torque" stroke="#82ca9d" name="扭矩 (Nm)" />
            </LineChart>
          </ResponsiveContainer>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={machineData.data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="timestamp" type="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="toolwearinmins" fill="#82ca9d" name="工具磨损 (分钟)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default MachineDetail; 

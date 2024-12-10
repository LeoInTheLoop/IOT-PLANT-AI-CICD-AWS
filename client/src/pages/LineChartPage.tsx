
import { useParams } from "react-router-dom";
import { Line } from "react-chartjs-2";

// Example Chart.js imports
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChartPage = () => {
  const { id } = useParams<{ id: string }>(); // Extract dynamic `id` from the route

  // Mock data for the chart
  const data = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Performance",
        data: [10, 20, 30, 40, 50, 60],
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `Line Chart for Machine ID: ${id}`,
      },
    },
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Line Chart</h2>
      <p>Displaying data for Machine ID: {id}</p>
      <div style={{ width: "80%", margin: "auto" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default LineChartPage;

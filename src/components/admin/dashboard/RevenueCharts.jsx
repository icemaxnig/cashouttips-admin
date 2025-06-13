import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

// ✅ Register Chart.js components (required for Chart.js v3+)
ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const RevenueCharts = ({ revenueHistory }) => {
  const chartData = {
    labels: revenueHistory.map((r) => r.date),
    datasets: [
      {
        label: "Booking Revenue",
        data: revenueHistory.map((r) => r.bookingTotal),
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Rollover Revenue",
        data: revenueHistory.map((r) => r.rolloverTotal),
        borderColor: "rgba(34,197,94,1)",
        backgroundColor: "rgba(34,197,94,0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h4 className="text-lg font-bold mb-2">Revenue Over Time</h4>
      <Line data={chartData} />
    </div>
  );
};

export default RevenueCharts;

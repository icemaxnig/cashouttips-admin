import React from "react";
import { Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const PerformanceCharts = ({ performance, bookingPerformance, bookingSuccess }) => {
  const pieData = {
    labels: ["WON", "LOST", "Pending"],
    datasets: [
      {
        label: "Rollover Tips",
        data: [
          performance.WON || 0,
          performance.LOST || 0,
          performance.Pending || 0,
        ],
        backgroundColor: [
          "rgba(34,197,94,0.7)",
          "rgba(239,68,68,0.7)",
          "rgba(234,179,8,0.7)",
        ],
      },
    ],
  };

  const oddsData = {
    labels: Object.keys(bookingPerformance),
    datasets: [
      {
        label: "Codes by Odds Range",
        data: Object.values(bookingPerformance),
        backgroundColor: "rgba(59,130,246,0.7)",
      },
    ],
  };

  const successRateData = {
    labels: Object.keys(bookingSuccess),
    datasets: [
      {
        label: "WON",
        data: Object.values(bookingSuccess).map((v) => v.won),
        backgroundColor: "rgba(34,197,94,0.7)",
      },
      {
        label: "LOST",
        data: Object.values(bookingSuccess).map((v) => v.lost),
        backgroundColor: "rgba(239,68,68,0.7)",
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 shadow rounded">
        <h4 className="text-lg font-bold mb-2">Rollover Performance</h4>
        <Pie data={pieData} />
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h4 className="text-lg font-bold mb-2">Booking Code Odds Distribution</h4>
        <Bar data={oddsData} options={{ responsive: true, scales: { y: { beginAtZero: true } } }} />
      </div>

      <div className="bg-white p-4 shadow rounded">
        <h4 className="text-lg font-bold mb-2">Booking Success Rate</h4>
        <Bar
          data={successRateData}
          options={{
            responsive: true,
            plugins: { legend: { position: "top" } },
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>
    </div>
  );
};

export default PerformanceCharts;

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BookingChart = ({ won, lost, pending }) => {
  const allZero = [won, lost, pending].every((val) => val === 0);

  if (allZero) {
    return (
      <div className="text-center text-gray-500 py-6">
        📭 No booking data available to display.
      </div>
    );
  }

  const chartData = {
    labels: ["WON", "LOST", "PENDING"],
    datasets: [
      {
        label: "Bookings",
        data: [won, lost, pending],
        backgroundColor: ["#16a34a", "#dc2626", "#6b7280"],
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default BookingChart;

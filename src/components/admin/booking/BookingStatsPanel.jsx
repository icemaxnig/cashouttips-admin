import React from "react";

const BookingStatsPanel = ({ total, won, lost, pending }) => {
  const successRate =
    total > 0 ? ((won / total) * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
      <div className="p-3 border rounded bg-green-50">Total: {total}</div>
      <div className="p-3 border rounded bg-green-100">WON: {won}</div>
      <div className="p-3 border rounded bg-red-100">LOST: {lost}</div>
      <div className="p-3 border rounded bg-gray-100">Success Rate: {successRate}%</div>
    </div>
  );
};

export default BookingStatsPanel;

import React from "react";

const DashboardFilterBar = ({ filter, setFilter, refresh }) => (
  <div className="flex justify-between items-center">
    <h2 className="text-2xl font-bold text-blue-800">Admin Dashboard</h2>
    <div className="flex items-center gap-2">
      <select
        className="border p-2 rounded"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All Time</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>
      <button
        onClick={refresh}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        ⟳ Refresh Stats
      </button>
    </div>
  </div>
);

export default DashboardFilterBar;

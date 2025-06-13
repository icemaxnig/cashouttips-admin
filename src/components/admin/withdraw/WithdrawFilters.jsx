import React from "react";

const WithdrawFilters = ({ filter, setFilter, dateRange, setDateRange }) => (
  <div className="flex flex-wrap gap-4 mb-4">
    <select
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="All">All</option>
      <option value="Pending">Pending</option>
      <option value="Paid">Paid</option>
      <option value="Rejected">Rejected</option>
    </select>

    <input
      type="date"
      value={dateRange.start}
      onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
      className="border p-2 rounded"
    />
    <input
      type="date"
      value={dateRange.end}
      onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
      className="border p-2 rounded"
    />
  </div>
);

export default WithdrawFilters;

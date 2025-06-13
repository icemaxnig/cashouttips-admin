import React from "react";

const BookingFilters = ({
  statusFilter,
  setStatusFilter,
  searchQuery,
  setSearchQuery,
  oddsRange,
  setOddsRange,
  dateRange,
  setDateRange,
  resetFilters,
}) => {
  const oddsOptions = [
    { label: "All", value: "" },
    { label: "2–4.99", value: "2-4.99" },
    { label: "5–10.99", value: "5-10.99" },
    { label: "11–20.99", value: "11-20.99" },
    { label: "21–30.99", value: "21-30.99" },
    { label: "31+", value: "31-1000" },
  ];

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        <option value="All">All Status</option>
        <option value="WON">WON</option>
        <option value="LOST">LOST</option>
        <option value="Pending">Pending</option>
      </select>

      <select
        value={oddsRange}
        onChange={(e) => setOddsRange(e.target.value)}
        className="border px-2 py-1 rounded"
      >
        {oddsOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            Odds: {opt.label}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={dateRange.start}
        onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
        className="border px-2 py-1 rounded"
      />
      <input
        type="date"
        value={dateRange.end}
        onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
        className="border px-2 py-1 rounded"
      />

      <input
        type="text"
        placeholder="Search by code or email"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="border px-2 py-1 rounded flex-1"
      />

      <button
        onClick={resetFilters}
        className="bg-gray-600 text-white px-3 py-1 rounded"
      >
        Reset
      </button>
    </div>
  );
};

export default BookingFilters;

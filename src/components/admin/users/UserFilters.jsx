import React from "react";

const UserFilters = ({ search, setSearch, status, setStatus }) => (
  <div className="flex flex-wrap gap-4 mb-4">
    <input
      type="text"
      placeholder="Search by email..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border p-2 rounded"
    />
    <select
      value={status}
      onChange={(e) => setStatus(e.target.value)}
      className="border p-2 rounded"
    >
      <option value="all">All</option>
      <option value="active">Active</option>
      <option value="blocked">Blocked</option>
    </select>
  </div>
);

export default UserFilters;

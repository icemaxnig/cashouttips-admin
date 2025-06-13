// src/pages/RolloverList.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { notifySuccess, notifyError } from "../components/Toast";

const RolloverList = () => {
  const [rollovers, setRollovers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  const fetchRollovers = async () => {
    try {
      const res = await api.get("/rollover");
      setRollovers(res.data);
    } catch (err) {
      notifyError("Failed to load rollovers");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/rollover/${id}`, { status });
      setRollovers((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
      notifySuccess("Status updated");
    } catch (err) {
      notifyError("Failed to update status");
    }
  };

  const deleteRollover = async (id) => {
    if (!window.confirm("Are you sure you want to delete this rollover?")) return;
    try {
      await api.delete(`/rollover/${id}`);
      setRollovers((prev) => prev.filter((r) => r._id !== id));
      notifySuccess("Rollover deleted");
    } catch (err) {
      notifyError("Delete failed");
    }
  };

  useEffect(() => {
    fetchRollovers();
  }, []);

  const filtered = filter === "All" ? rollovers : rollovers.filter((r) => r.status === filter);

  const today = new Date().toISOString().split("T")[0];
  const statusCount = {
    WON: rollovers.filter((r) => r.status === "WON").length,
    LOST: rollovers.filter((r) => r.status === "LOST").length,
    Pending: rollovers.filter((r) => r.status === "Pending").length
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Rollover Tips</h2>

      <div className="mb-4 flex items-center gap-6 flex-wrap">
        <div>
          <label className="mr-2 font-medium">Filter by Status:</label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border p-2 rounded">
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="WON">WON</option>
            <option value="LOST">LOST</option>
          </select>
        </div>
        <div className="text-sm text-gray-700">
          <span className="mr-3">✅ WON: {statusCount.WON}</span>
          <span className="mr-3">❌ LOST: {statusCount.LOST}</span>
          <span>🕒 Pending: {statusCount.Pending}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Plan</th>
              <th className="p-2 border">Odds</th>
              <th className="p-2 border">Days</th>
              <th className="p-2 border">Code</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r._id} className={r.date === today ? "bg-green-50" : ""}>
                <td className="p-2 border font-mono">{r.planType}</td>
                <td className="p-2 border">{r.odds}</td>
                <td className="p-2 border">{r.days}</td>
                <td className="p-2 border font-mono">{r.bookingCode}</td>
                <td className="p-2 border">{r.date}</td>
                <td className="p-2 border">
                  <span className={`px-2 py-1 rounded text-white ${r.status === "WON" ? "bg-green-600" : r.status === "LOST" ? "bg-red-600" : "bg-yellow-500"}`}>
                    {r.status}
                  </span>
                </td>
                <td className="p-2 border space-x-1">
                  <button onClick={() => updateStatus(r._id, "WON")} className="px-2 py-1 bg-green-600 text-white rounded">WON</button>
                  <button onClick={() => updateStatus(r._id, "LOST")} className="px-2 py-1 bg-red-600 text-white rounded">LOST</button>
                  <button onClick={() => updateStatus(r._id, "Pending")} className="px-2 py-1 bg-yellow-600 text-white rounded">Undo</button>
                  <button onClick={() => deleteRollover(r._id)} className="px-2 py-1 bg-gray-600 text-white rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolloverList;

import React, { useEffect, useState } from "react";
import api from "../api";
import WithdrawTable from "../components/admin/withdraw/WithdrawTable";
import WithdrawFilters from "../components/admin/withdraw/WithdrawFilters";

const WithdrawManager = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filter, setFilter] = useState("Pending");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get("/api/admin/withdrawals");
      setWithdrawals(res.data);
    } catch {
      alert("Failed to load withdrawals");
    }
  };

  const updateStatus = async (id, status, note) => {
    try {
      await api.post(`/api/admin/withdrawals/${id}/status`, { status, note });
      fetchWithdrawals();
    } catch {
      alert("Failed to update status");
    }
  };

  const filtered = withdrawals.filter((w) => {
    const matchStatus = filter === "All" || w.status === filter;
    const created = new Date(w.createdAt);
    const afterStart = !dateRange.start || created >= new Date(dateRange.start);
    const beforeEnd = !dateRange.end || created <= new Date(dateRange.end + "T23:59:59");
    return matchStatus && afterStart && beforeEnd;
  });

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Withdrawals Manager</h2>
      <WithdrawFilters
        filter={filter}
        setFilter={setFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />
      <WithdrawTable data={filtered} onUpdateStatus={updateStatus} />
    </div>
  );
};

export default WithdrawManager;

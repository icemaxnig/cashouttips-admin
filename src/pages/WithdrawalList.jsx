
// src/pages/WithdrawalList.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

const WithdrawalList = () => {
  const [withdrawals, setWithdrawals] = useState([]);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get("/api/withdrawals");
      setWithdrawals(res.data);
    } catch {
        console.error('Data load failed');
    }
  };

  const markPaid = async (id) => {
    try {
      await api.patch(`/withdrawals/${id}/mark-paid`);
      fetchWithdrawals();
    } catch {
      alert("Failed to mark as paid");
    }
  };

  const rejectWithdrawal = async (id) => {
    const reason = prompt("Enter reason for rejection:");
    if (!reason) return;

    try {
      await api.post(`/withdrawals/${id}/reject`, { reason });
      fetchWithdrawals();
    } catch {
      alert("Failed to reject withdrawal");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Withdrawal Requests</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Amount</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {withdrawals.map((w) => (
              <tr key={w._id}>
                <td className="p-2 border">{w.email}</td>
                <td className="p-2 border">₦{w.amount}</td>
                <td className="p-2 border">{w.status}</td>
                <td className="p-2 border">{new Date(w.createdAt).toLocaleString()}</td>
                <td className="p-2 border space-x-2">
                  {w.status === "Pending" && (
                    <>
                      <button
                        onClick={() => markPaid(w._id)}
                        className="bg-green-600 text-white px-2 py-1 rounded"
                      >
                        Mark as PAID
                      </button>
                      <button
                        onClick={() => rejectWithdrawal(w._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WithdrawalList;
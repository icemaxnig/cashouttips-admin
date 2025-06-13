
// src/pages/ReferralLeaderboard.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

const ReferralLeaderboard = () => {
  const [leaders, setLeaders] = useState([]);
  const [sortBy, setSortBy] = useState("count");

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await api.get("/admin/referral-leaderboard");
      setLeaders(res.data);
    } catch {
        console.error('Data load failed');
    }
  };

  const sorted = [...leaders].sort((a, b) => {
    return sortBy === "count"
      ? b.count - a.count
      : b.earnings - a.earnings;
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Referral Leaderboard</h2>

      <div className="flex gap-4 mb-4">
        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="count">By Referral Count</option>
          <option value="earnings">By Earnings</option>
        </select>
      </div>

      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Referrals</th>
            <th className="p-2 border">Earnings (₦)</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((u, idx) => (
            <tr key={u.email}>
              <td className="p-2 border font-medium">{u.email}</td>
              <td className="p-2 border text-center">{u.count}</td>
              <td className="p-2 border text-center">₦{u.earnings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReferralLeaderboard;
// src/pages/RolloverSubscriptionList.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";

const RolloverSubscriptionList = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subsRes, usersRes] = await Promise.all([
          api.get("/api/rollover-subscribe"),
          api.get("/api/users"),
        ]);
        const userMap = {};
        usersRes.data.forEach((u) => (userMap[u._id] = u.email));
        setUsers(userMap);
        setSubscriptions(subsRes.data);
      } catch (err) {
        console.error('Data load failed');
      }
    };
    fetchData();
  }, []);

  const downloadCSV = () => {
    const csv = unparse(
      subscriptions.map((s) => ({
        user: users[s.userId] || s.userId,
        plan: s.planType,
        amount: s.amount,
        referral: s.referralEarning,
        startDate: new Date(s.startDate).toLocaleDateString(),
        created: new Date(s.createdAt).toLocaleString(),
      }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "rollover_subscriptions.csv");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Rollover Subscription History</h2>
      <button
        onClick={downloadCSV}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download CSV
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Plan</th>
              <th className="p-2 border">Amount (₦)</th>
              <th className="p-2 border">Referral Earning</th>
              <th className="p-2 border">Start Date</th>
              <th className="p-2 border">Created</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((s) => (
              <tr key={s._id}>
                <td className="p-2 border font-mono">{users[s.userId] || s.userId}</td>
                <td className="p-2 border">{s.planType}</td>
                <td className="p-2 border">₦{s.amount}</td>
                <td className="p-2 border">₦{s.referralEarning}</td>
                <td className="p-2 border">
                  {new Date(s.startDate).toLocaleDateString()}
                </td>
                <td className="p-2 border">
                  {new Date(s.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RolloverSubscriptionList;
import React from "react";

const DashboardStats = ({ stats }) => {
  if (!stats) return null;

  const {
    totalUsers,
    activeCount,
    expiredCount,
    byPlan,
    expiringSoon
  } = stats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Totals */}
      <div className="bg-white/10 p-4 rounded-xl shadow text-white">
        <h3 className="text-lg font-bold mb-1">👥 Total Users</h3>
        <p className="text-2xl font-semibold text-yellow-400">{totalUsers}</p>
      </div>

      <div className="bg-green-600/20 p-4 rounded-xl text-white">
        <h3 className="text-lg font-bold mb-1">🟢 Active Subscribers</h3>
        <p className="text-2xl font-semibold text-green-400">{activeCount}</p>
      </div>

      <div className="bg-red-600/20 p-4 rounded-xl text-white">
        <h3 className="text-lg font-bold mb-1">🔴 Expired</h3>
        <p className="text-2xl font-semibold text-red-400">{expiredCount}</p>
      </div>

      {/* By Plan */}
      <div className="col-span-1 md:col-span-2 bg-white/10 p-4 rounded-xl text-white">
        <h3 className="text-lg font-bold mb-2">📈 Plan Breakdown</h3>
        <ul className="space-y-1 text-sm">
          {Object.entries(byPlan || {}).map(([odds, count]) => (
            <li key={odds}>
              <span className="text-yellow-300 font-semibold">{odds} odds:</span> {count}
            </li>
          ))}
        </ul>
      </div>

      {/* Expiring Soon */}
      <div className="bg-white/10 p-4 rounded-xl text-white">
        <h3 className="text-lg font-bold mb-2">⏳ Expiring Soon (2 days)</h3>
        <ul className="space-y-1 text-sm max-h-32 overflow-y-auto pr-2">
          {(expiringSoon || []).length ? expiringSoon.map((u, i) => (
            <li key={i}>
              {u.name} - <span className="text-yellow-300 font-semibold">{u.daysLeft} days</span>
            </li>
          )) : <li>No users expiring soon.</li>}
        </ul>
      </div>
    </div>
  );
};

export default DashboardStats;
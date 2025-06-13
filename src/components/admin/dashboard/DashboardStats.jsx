import React from "react";

const StatCard = ({ title, value, bg }) => (
  <div className={`p-4 shadow text-center rounded ${bg}`}>
    <h4 className="text-sm text-gray-500">{title}</h4>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

const DashboardStats = ({ stats }) => (
  <div className="grid md:grid-cols-4 gap-4">
    <StatCard title="Total Users" value={stats.totalUsers || 0} bg="bg-white" />
    <StatCard title="Pending Withdrawals" value={stats.pendingWithdrawals || 0} bg="bg-white" />
    <StatCard title="Total Bookings" value={stats.totalBookings || 0} bg="bg-white" />
    <StatCard title="Rollover Subscriptions" value={stats.totalRolloverSubs || 0} bg="bg-white" />
    <StatCard title="Referral Earnings" value={`₦${stats.referralEarnings || 0}`} bg="bg-white" />
    <StatCard title="Top Rollover Plan" value={stats.topRolloverPlan || 'N/A'} bg="bg-white" />
    <StatCard title="Top Product" value={stats.topProduct || 'N/A'} bg="bg-white" />
  </div>
);

export default DashboardStats;

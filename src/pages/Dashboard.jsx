import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get('/api/admin/stats');
        setStats(data);
      } catch (err) {
        console.error("❌ Failed to load dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10 text-lg">
        ⏳ Loading dashboard...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Total Users</p>
          <p className="text-xl font-bold">{stats.users || 0}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Total Rollover Tips</p>
          <p className="text-xl font-bold">{stats.rollovers || 0}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Total Booking Codes</p>
          <p className="text-xl font-bold">{stats.codes || 0}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Wallet Balance (₦)</p>
          <p className="text-xl font-bold">₦{stats.wallet || 0}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Total Subscriptions</p>
          <p className="text-xl font-bold">{stats.subscriptions || 0}</p>
        </div>
        <div className="bg-white p-4 shadow rounded">
          <p className="text-gray-500">Total Revenue (₦)</p>
          <p className="text-xl font-bold">₦{stats.revenue || 0}</p>
        </div>
        <div className="bg-white p-4 shadow rounded col-span-2">
          <p className="text-gray-500">Most Popular Plan</p>
          <p className="text-xl font-bold">{stats.popularPlan || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}

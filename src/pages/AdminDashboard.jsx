import { useEffect, useState } from "react";
import axios from "axios";
import DashboardStats from "../components/admin/dashboard/DashboardStats";
import DashboardFilterBar from "../components/admin/dashboard/DashboardFilterBar";
import RevenueCharts from "../components/admin/dashboard/RevenueCharts";
import PerformanceCharts from "../components/admin/dashboard/PerformanceCharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [revenueHistory, setRevenueHistory] = useState([]);
  const [performance, setPerformance] = useState({});
  const [bookingPerformance, setBookingPerformance] = useState({});
  const [bookingSuccess, setBookingSuccess] = useState({});
  const [filter, setFilter] = useState("all");

  const fetchDashboardData = async () => {
    try {
      const [
        statsRes,
        revenueRes,
        performanceRes,
        bookingRes,
        successRes
      ] = await Promise.all([
        axios.get(`/api/admin/stats?range=${filter}`),
        axios.get("/api/admin/revenue-history"),
        axios.get("/api/admin/rollover-performance"),
        axios.get("/api/admin/booking-performance"),
        axios.get("/api/admin/booking-success-stats")
      ]);

      setStats(statsRes.data);
      setRevenueHistory(revenueRes.data);
      setPerformance(performanceRes.data);
      setBookingPerformance(bookingRes.data);
      setBookingSuccess(successRes.data);
    } catch (err) {
      console.error("Dashboard load error", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 180000);
    return () => clearInterval(interval);
  }, [filter]);

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      <DashboardFilterBar filter={filter} setFilter={setFilter} refresh={fetchDashboardData} />
      <DashboardStats stats={stats} />
      <RevenueCharts revenueHistory={revenueHistory} />
      <PerformanceCharts
        performance={performance}
        bookingPerformance={bookingPerformance}
        bookingSuccess={bookingSuccess}
      />
    </div>
  );
};

export default AdminDashboard;

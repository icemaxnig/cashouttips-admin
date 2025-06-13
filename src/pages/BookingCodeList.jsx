
import React, { useEffect, useState } from "react";
import api from "../api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const BookingCodeList = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState("createdAt");
  const [sortAsc, setSortAsc] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/booking");
      setCodes(res.data);
    } catch (err) {
      console.error("Data load failed", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (ids, status) => {
    const prev = codes.filter((c) => ids.includes(c._id)).map((c) => ({ id: c._id, prevStatus: c.status || "Pending" }));
    if (!window.confirm(`Are you sure you want to mark selected as ${status}?`)) return;

    try {
      for (let id of ids) {
        await api.put(`/api/booking/${id}/status`, { status });
      }
      setLastAction({ ids, prev });
      setSelected([]);
      fetchCodes();
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const undoLast = async () => {
    if (!lastAction) return;
    for (let entry of lastAction.prev) {
      await api.put(`/api/booking/${entry.id}/status`, { status: entry.prevStatus });
    }
    setLastAction(null);
    fetchCodes();
  };

  const formatDateTime = (isoString) => new Date(isoString).toLocaleString();

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded text-white text-xs font-semibold";
    switch (status) {
      case "WON":
        return <span className={`${base} bg-green-600`}>WON</span>;
      case "LOST":
        return <span className={`${base} bg-red-600`}>LOST</span>;
      default:
        return <span className={`${base} bg-gray-500`}>PENDING</span>;
    }
  };

  const filteredCodes = codes
    .filter((c) => {
      const status = c.status || "Pending";
      const matchStatus = statusFilter === "All" || status === statusFilter;
      const matchSearch =
        c.bookingCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchSearch;
    })
    .sort((a, b) => {
      const aVal = sortField === "user" ? a.user?.email : a[sortField];
      const bVal = sortField === "user" ? b.user?.email : b[sortField];
      if (sortField === "status") {
        return sortAsc
          ? (a.status || "").localeCompare(b.status || "")
          : (b.status || "").localeCompare(a.status || "");
      }
      if (aVal < bVal) return sortAsc ? -1 : 1;
      if (aVal > bVal) return sortAsc ? 1 : -1;
      return 0;
    });

  const totalPages = Math.ceil(filteredCodes.length / itemsPerPage);
  const paginatedCodes = filteredCodes.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusCounts = {
    WON: filteredCodes.filter((c) => c.status === "WON").length,
    LOST: filteredCodes.filter((c) => c.status === "LOST").length,
    Pending: filteredCodes.filter((c) => !c.status || c.status === "Pending").length,
  };

  const successRate =
    statusCounts.WON + statusCounts.LOST + statusCounts.Pending > 0
      ? ((statusCounts.WON / filteredCodes.length) * 100).toFixed(1)
      : 0;

  const chartData = {
    labels: ["WON", "LOST", "PENDING"],
    datasets: [
      {
        label: "Bookings",
        data: [statusCounts.WON, statusCounts.LOST, statusCounts.Pending],
        backgroundColor: ["#16a34a", "#dc2626", "#6b7280"],
      },
    ],
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h2 className="text-xl font-bold">Booking Code List</h2>
        <div className="flex gap-2">
          <select
            className="border px-2 py-1 rounded"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All</option>
            <option value="WON">WON</option>
            <option value="LOST">LOST</option>
            <option value="Pending">Pending</option>
          </select>
          <input
            type="text"
            placeholder="Search code or email"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="border px-2 py-1 rounded"
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div className="p-3 border rounded bg-green-50">Total: {filteredCodes.length}</div>
        <div className="p-3 border rounded bg-green-100">WON: {statusCounts.WON}</div>
        <div className="p-3 border rounded bg-red-100">LOST: {statusCounts.LOST}</div>
        <div className="p-3 border rounded bg-gray-100">Success Rate: {successRate}%</div>
      </div>

      <Bar data={chartData} />

      {lastAction && (
        <button onClick={undoLast} className="bg-yellow-500 text-white px-4 py-1 rounded mt-2">
          Undo Last Update
        </button>
      )}

      {loading ? (
        <p className="text-center">Loading...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100 sticky top-0">
              <tr>
                <th className="p-2 border">
                  <input
                    type="checkbox"
                    checked={selected.length === paginatedCodes.length}
                    onChange={(e) =>
                      setSelected(e.target.checked ? paginatedCodes.map((c) => c._id) : [])
                    }
                  />
                </th>
                <th className="p-2 border">Odds</th>
                <th className="p-2 border">Code</th>
                <th className="p-2 border">Buyer</th>
                <th className="p-2 border">Purchased</th>
                <th className="p-2 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCodes.map((c) => (
                <tr key={c._id}>
                  <td className="p-2 border text-center">
                    <input
                      type="checkbox"
                      checked={selected.includes(c._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelected([...selected, c._id]);
                        } else {
                          setSelected(selected.filter((id) => id !== c._id));
                        }
                      }}
                    />
                  </td>
                  <td className="p-2 border">{c.totalOdds}</td>
                  <td className="p-2 border font-mono">{c.bookingCode}</td>
                  <td className="p-2 border">{c.user?.email || "N/A"}</td>
                  <td className="p-2 border">{formatDateTime(c.createdAt)}</td>
                  <td className="p-2 border text-center">{getStatusBadge(c.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => updateStatus(selected, "WON")}
              className="bg-green-600 text-white px-3 py-1 rounded"
              disabled={selected.length === 0}
            >
              Mark Selected as WON
            </button>
            <button
              onClick={() => updateStatus(selected, "LOST")}
              className="bg-red-600 text-white px-3 py-1 rounded"
              disabled={selected.length === 0}
            >
              Mark Selected as LOST
            </button>
          </div>

          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded border ${
                  currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-white text-gray-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingCodeList;

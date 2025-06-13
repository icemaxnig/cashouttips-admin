
import React, { useEffect, useState } from "react";
import api from "../api";
import BookingStatsPanel from "../components/admin/booking/BookingStatsPanel";
import BookingChart from "../components/admin/booking/BookingChart";
import BookingTableRow from "../components/admin/booking/BookingTableRow";
import BookingFilters from "../components/admin/booking/BookingFilters";

const BookingCodeList = () => {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [oddsRange, setOddsRange] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [selected, setSelected] = useState([]);
  const [lastAction, setLastAction] = useState(null);
  const [filterUser, setFilterUser] = useState(null);

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

  const toggleSelect = (id) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const resetFilters = () => {
    setStatusFilter("All");
    setSearchQuery("");
    setOddsRange("");
    setDateRange({ start: "", end: "" });
    setFilterUser(null);
  };

  const filterAndSort = (list) => {
    return list
      .filter((c) => {
        const status = c.status || "Pending";
        const matchStatus = statusFilter === "All" || status === statusFilter;
        const matchSearch = c.bookingCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            c.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchUser = !filterUser || c.user?.email === filterUser;
        const matchOdds = (() => {
          if (!oddsRange) return true;
          const [min, max] = oddsRange.split("-").map(Number);
          return c.totalOdds >= min && c.totalOdds <= max;
        })();
        const matchDate = (() => {
          if (!dateRange.start && !dateRange.end) return true;
          const created = new Date(c.createdAt);
          const afterStart = !dateRange.start || created >= new Date(dateRange.start);
          const beforeEnd = !dateRange.end || created <= new Date(dateRange.end + "T23:59:59");
          return afterStart && beforeEnd;
        })();
        return matchStatus && matchSearch && matchUser && matchOdds && matchDate;
      });
  };

  const filtered = filterAndSort(codes);
  const won = filtered.filter((c) => c.status === "WON").length;
  const lost = filtered.filter((c) => c.status === "LOST").length;
  const pending = filtered.filter((c) => !c.status || c.status === "Pending").length;

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Booking Code List</h2>
        {filterUser && (
          <button
            onClick={() => setFilterUser(null)}
            className="bg-yellow-500 text-white px-3 py-1 rounded"
          >
            Viewing {filterUser} – Click to clear
          </button>
        )}
      </div>

      <BookingFilters
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        oddsRange={oddsRange}
        setOddsRange={setOddsRange}
        dateRange={dateRange}
        setDateRange={setDateRange}
        resetFilters={resetFilters}
      />

      <BookingStatsPanel total={filtered.length} won={won} lost={lost} pending={pending} />
      <BookingChart won={won} lost={lost} pending={pending} />

      {lastAction && (
        <button onClick={undoLast} className="bg-yellow-600 text-white px-4 py-1 rounded">
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
                    checked={selected.length === filtered.length}
                    onChange={(e) =>
                      setSelected(e.target.checked ? filtered.map((c) => c._id) : [])
                    }
                  />
                </th>
                <th className="p-2 border">Odds</th>
                <th className="p-2 border">Code</th>
                <th className="p-2 border">Buyer</th>
                <th className="p-2 border">Purchased</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((code) => (
                <BookingTableRow
                  key={code._id}
                  code={code}
                  isSelected={selected.includes(code._id)}
                  onSelect={toggleSelect}
                  onUpdateStatus={(id, status) => updateStatus([id], status)}
                  onUserClick={setFilterUser}
                />
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
        </div>
      )}
    </div>
  );
};

export default BookingCodeList;

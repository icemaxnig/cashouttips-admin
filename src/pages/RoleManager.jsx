
// src/pages/RoleManager.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

const RoleManager = () => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/api/users");
      setUsers(res.data);
    } catch {
        console.error('Data load failed');
    }
  };

  const changeRole = async (userId, newRole) => {
    try {
      setUpdating((prev) => ({ ...prev, [userId]: true }));
      await api.put(`/admin/user-role/${userId}`, { role: newRole });
      fetchUsers();
    } catch {
      alert("Failed to update role");
    } finally {
      setUpdating((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const filtered = users.filter((u) =>
    u.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Tipster / Sub-admin Manager</h2>

      <input
        type="text"
        placeholder="Search by email..."
        className="border p-2 rounded mb-4 w-full max-w-md"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <table className="min-w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Current Role</th>
            <th className="p-2 border">Change Role</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((user) => (
            <tr key={user._id}>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">{user.role || "viewer"}</td>
              <td className="p-2 border">
                <select
                  defaultValue={user.role || "viewer"}
                  onChange={(e) => changeRole(user._id, e.target.value)}
                  disabled={updating[user._id]}
                  className="border p-1 rounded"
                >
                  <option value="viewer">Viewer</option>
                  <option value="tipster">Tipster</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-2 border">
                {updating[user._id] && <span className="text-xs">Updating...</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RoleManager;
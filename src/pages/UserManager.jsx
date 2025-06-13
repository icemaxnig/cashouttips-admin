import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api";

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPasswords, setNewPasswords] = useState({});
  const [user, setUser] = useState({});

  useEffect(() => {
    api.get("/user/list")
      .then((res) => {
        console.log("✅ Users loaded:", res.data);
        setUsers(res.data);
      })
      .catch((err) => {
        console.error("❌ Failed to load users:", err);
      })
      .finally(() => setLoading(false));

    api.get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {});
  }, []);

  const handleResetPassword = async (userId) => {
    const newPassword = newPasswords[userId];
    if (!newPassword || newPassword.trim().length < 4) {
      return toast.error("❌ Password must be at least 4 characters.");
    }

    try {
      await api.post(`/user/reset-password/${userId}`, {
        password: newPassword,
      });
      toast.success("✅ Password reset successfully!");
      setNewPasswords({ ...newPasswords, [userId]: "" });
    } catch {
      toast.error("❌ Failed to reset password.");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">User Manager</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading users...</div>
      ) : (
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="border px-2 py-1">Email</th>
              <th className="border px-2 py-1">Role</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td className="border px-2 py-1">{u.email}</td>
                <td className="border px-2 py-1">{u.role || "user"}</td>
                <td className="border px-2 py-1 text-center">
                  {user?.role === "admin" && (
                    <>
                      <input
                        type="password"
                        placeholder="New password"
                        value={newPasswords[u._id] || ""}
                        onChange={(e) =>
                          setNewPasswords({ ...newPasswords, [u._id]: e.target.value })
                        }
                        className="border px-2 py-1 rounded w-32 text-sm"
                      />
                      <button
                        onClick={() => handleResetPassword(u._id)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 ml-2 rounded text-sm"
                      >
                        Reset
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserManager;

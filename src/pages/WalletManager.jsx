import React, { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

const WalletManager = () => {
  const [users, setUsers] = useState([]);
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [walletType, setWalletType] = useState("main");
  const [action, setAction] = useState("credit");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch users
  const fetchUsers = () => {
    api.get("/users")
      .then(res => setUsers(res.data))
      .catch(() => toast.error("Failed to load users"));
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onFocus = () => fetchUsers();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  try {
    await api.post("/admin/wallet-adjust", {
      userId,
      type: action,
      wallet: walletType,
      amount: Number(amount)
    });
    toast.success("Wallet updated successfully");
    fetchUsers(); // 🧊 refresh state
  } catch (err) {
    toast.error("Wallet adjustment failed");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Wallet Manager</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <select value={userId} onChange={e => setUserId(e.target.value)} className="input">
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name || user.email || user.phone || user.telegramId}
            </option>
          ))}
        </select>

        <select value={walletType} onChange={e => setWalletType(e.target.value)} className="input">
          <option value="main">Main Wallet</option>
          <option value="bonus">Bonus Wallet</option>
        </select>

        <select value={action} onChange={e => setAction(e.target.value)} className="input">
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
        </select>

        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="input"
          placeholder="Enter amount"
        />

        <button
          type="submit"
          disabled={loading || !userId || !amount}
          className="btn bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded"
        >
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>

      <h3 className="text-lg font-bold mb-2">All Users</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Main Wallet</th>
              <th className="p-2 border">Bonus Wallet</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t">
                <td className="p-2 border">{user.name || "-"}</td>
                <td className="p-2 border">{user.email || "-"}</td>
                <td className="p-2 border">₦{user.mainWallet?.toLocaleString() || 0}</td>
                <td className="p-2 border">₦{user.bonusWallet?.toLocaleString() || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WalletManager;

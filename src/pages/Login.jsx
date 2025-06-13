import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("❌ Email and password are required");
    }

    if (!isValidEmail(email)) {
      return toast.error("❌ Please enter a valid email address");
    }

    setLoading(true);
    try {
      const res = await api.post("/admin/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      toast.success("✅ Login successful");
      navigate("/dashboard");
    } catch (err) {
      toast.error("❌ Login failed: " + (err.response?.data?.message || "Server error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handleLogin} className="p-6 bg-white rounded shadow-md w-80">
        <h2 className="text-xl mb-4 font-bold text-center">Admin Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="mb-2 p-2 border w-full"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-4 p-2 border w-full"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white py-2 w-full rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;

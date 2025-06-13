
// 📁 pages/RolloverPlans.jsx

import React, { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

const RolloverPlans = () => {
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({ name: "", odds: "", duration: "", postLimit: 1, price: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/admin/rollover-plans");
      setPlans(res.data);
    } catch (err) {
      toast.error("Failed to fetch plans");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/admin/rollover-plan/${editingId}`, form);
        toast.success("Plan updated");
      } else {
        await api.post("/admin/rollover-plans", form);
        toast.success("Plan created");
      }
      setForm({ name: "", odds: "", duration: "", postLimit: 1, price: "" });
      setEditingId(null);
      fetchPlans();
    } catch (err) {
      toast.error(err.response?.data?.message || "Submit failed");
    }
  };

  const handleEdit = (plan) => {
    setForm({
      name: plan.name,
      odds: plan.odds,
      duration: plan.duration,
      postLimit: plan.postLimit || 1,
      price: plan.price || ""
    });
    setEditingId(plan._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plan?")) return;
    try {
      await api.delete(`/admin/rollover-plan/${id}`);
      toast.success("Plan deleted");
      fetchPlans();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto text-white bg-[#0A0E2C] min-h-screen space-y-8">
      <h2 className="text-2xl font-bold text-yellow-400">Manage Rollover Plans</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-[#111634] p-6 rounded shadow-lg border border-yellow-400">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold text-white">Plan Name</label>
            <input
              type="text"
              placeholder="Plan Name"
              className="input w-full text-black"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-white">Plan Price (₦)</label>
            <input
              type="number"
              placeholder="Plan Price"
              className="input w-full text-black"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-semibold text-white">Daily Odds</label>
            <input
              type="number"
              step="0.01"
              placeholder="Daily Odds"
              className="input w-full text-black"
              value={form.odds}
              onChange={(e) => setForm({ ...form, odds: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-white">Duration (Days)</label>
            <input
              type="number"
              placeholder="Duration"
              className="input w-full text-black"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 font-semibold text-white">Daily Post Limit</label>
          <input
            type="number"
            placeholder="Post Limit"
            className="input w-full text-black"
            value={form.postLimit}
            onChange={(e) => setForm({ ...form, postLimit: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="w-full bg-yellow-400 text-[#0A0E2C] font-bold py-3 rounded hover:bg-yellow-300 transition">
          {editingId ? "Update Plan" : "Create Plan"}
        </button>
      </form>

      <div>
        <h3 className="text-xl font-semibold mb-4 text-yellow-400">Existing Plans</h3>
        <div className="grid gap-4">
          {plans.map(plan => (
            <div key={plan._id} className="border border-gray-600 p-4 rounded bg-[#1A1F3D]">
              <div className="text-lg font-semibold text-yellow-300 mb-1">{plan.name}</div>
              <p className="text-sm text-white mb-2">
                Odds: {plan.odds} • Duration: {plan.duration} days • Price: ₦{plan.price} • Post Limit: {plan.postLimit}
              </p>
              <div className="flex gap-3">
                <button onClick={() => handleEdit(plan)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(plan._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RolloverPlans;

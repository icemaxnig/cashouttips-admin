
// 📁 pages/SubscribeRollover.jsx

import React, { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";

const SubscribeRollover = () => {
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchPlans();
    fetchUser();
  }, []);

  const fetchPlans = async () => {
    try {
      const res = await api.get("/rollover/plans");
      setPlans(res.data);
    } catch {
      toast.error("Failed to load plans");
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
    } catch {
      toast.error("User info error");
    }
  };

  const subscribeToPlan = async (planId, price) => {
    if (!user || user.mainWallet < price) {
      return toast.error("Insufficient balance. Fund your wallet.");
    }

    try {
      await api.post("/rollover/subscribe", { userId: user._id, planId });
      toast.success("Subscribed successfully");
      fetchUser();
    } catch (err) {
      toast.error(err.response?.data?.message || "Subscription failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 text-white bg-[#0A0E2C] min-h-screen">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4">Rollover Plans</h2>

      {user && (
        <p className="mb-6 text-sm text-gray-300">
          Wallet Balance: <span className="text-yellow-300 font-semibold">₦{user.mainWallet.toLocaleString()}</span>
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {plans.map(plan => (
          <div key={plan._id} className="bg-[#1C1F3C] rounded p-4 border border-gray-700">
            <h3 className="text-xl font-semibold text-yellow-300 mb-2">{plan.name}</h3>
            <p className="mb-1 text-sm">Odds: <span className="text-white">{plan.odds}</span></p>
            <p className="mb-1 text-sm">Duration: <span className="text-white">{plan.duration} days</span></p>
            <p className="mb-3 text-sm">Price: <span className="text-green-400 font-bold">₦{plan.price.toLocaleString()}</span></p>
            <button
              onClick={() => subscribeToPlan(plan._id, plan.price)}
              className="w-full bg-yellow-400 text-[#0A0E2C] font-bold py-2 rounded hover:bg-yellow-300"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscribeRollover;

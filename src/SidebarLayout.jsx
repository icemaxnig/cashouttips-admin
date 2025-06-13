// 📁 src/SidebarLayout.jsx

import React, { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  Home, Upload, BookOpen, PencilLine, ListOrdered, History, Wallet, CreditCard,
  Users, UserCog, Award, Settings, LogOut, Layers, ChevronDown, ChevronRight
} from "lucide-react";

const SidebarLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [openSections, setOpenSections] = useState({
    rollover: true,
    booking: true,
    user: true,
    settings: true,
  });

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/login");
  };

  const groupedNavItems = [
    {
      title: "Rollover Suite",
      key: "rollover",
      items: [
        { name: "Rollover Plans", path: "/rollover-plans", icon: <Layers className="w-4 h-4 mr-2" /> },
        { name: "Upload Rollover", path: "/upload-rollover", icon: <Upload className="w-4 h-4 mr-2" /> },
        { name: "Rollover List", path: "/rollover-list", icon: <ListOrdered className="w-4 h-4 mr-2" /> },
        { name: "Rollover Subscriptions", path: "/rollover-history", icon: <History className="w-4 h-4 mr-2" /> },
      ],
    },
    {
      title: "Booking Codes",
      key: "booking",
      items: [
        { name: "Upload Booking Code", path: "/upload-booking", icon: <BookOpen className="w-4 h-4 mr-2" /> },
        { name: "Booking Code List", path: "/booking-list", icon: <ListOrdered className="w-4 h-4 mr-2" /> },
        { name: "Booking Purchase History", path: "/booking-history", icon: <History className="w-4 h-4 mr-2" /> },
      ],
    },
    {
      title: "Users & Wallets",
      key: "user",
      items: [
        { name: "User Manager", path: "/users", icon: <Users className="w-4 h-4 mr-2" /> },
        { name: "Wallet Manager", path: "/wallets", icon: <Wallet className="w-4 h-4 mr-2" /> },
        { name: "Withdrawals", path: "/withdrawals", icon: <CreditCard className="w-4 h-4 mr-2" /> },
        { name: "Referral Leaderboard", path: "/referrals", icon: <Award className="w-4 h-4 mr-2" /> },
        { name: "Role Manager", path: "/roles", icon: <UserCog className="w-4 h-4 mr-2" /> },
      ],
    },
    {
      title: "Settings",
      key: "settings",
      items: [
        { name: "Admin Settings", path: "/settings", icon: <Settings className="w-4 h-4 mr-2" /> },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white py-6 px-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <Link
          to="/dashboard"
          className={`flex items-center py-2 px-3 rounded hover:bg-gray-700 transition-all mb-2 ${
            location.pathname === "/dashboard" ? "bg-gray-700 font-semibold" : ""
          }`}
        >
          <Home className="w-4 h-4 mr-2" />
          Dashboard
        </Link>

        {groupedNavItems.map((group) => (
          <div key={group.key} className="mb-2">
            <button
              className="w-full flex justify-between items-center py-2 px-3 rounded hover:bg-gray-800 font-semibold"
              onClick={() => toggleSection(group.key)}
            >
              <span>{group.title}</span>
              {openSections[group.key] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
            {openSections[group.key] && (
              <div className="pl-3 mt-1 space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center py-2 px-3 rounded hover:bg-gray-700 transition-all text-sm ${
                      location.pathname === item.path ? "bg-gray-700 font-semibold" : ""
                    }`}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}

        <div className="mt-10 border-t border-gray-700 pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center py-2 px-3 rounded hover:bg-red-700 text-red-300 hover:text-white transition-all w-full text-left"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SidebarLayout;


// 📁 App.jsx

import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import SidebarLayout from "./SidebarLayout";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UploadRollover from "./pages/UploadRollover";
import UploadBooking from "./pages/UploadBooking";
import UploadFreeTip from "./pages/UploadFreeTip";
import RolloverList from "./pages/RolloverList";
import BookingCodeList from "./pages/BookingCodeList";
import BookingPurchaseList from "./pages/BookingPurchaseList";
import RolloverSubscriptionList from "./pages/RolloverSubscriptionList";
import WalletManager from "./pages/WalletManager";
import UserManager from "./pages/UserManager";
import ReferralLeaderboard from "./pages/ReferralLeaderboard";
import AdminSettings from "./pages/AdminSettings";
import WithdrawalList from "./pages/WithdrawalList";
import RoleManager from "./pages/RoleManager";
import WithdrawManager from "./pages/WithdrawManager";
import RolloverPlans from "./pages/RolloverPlans"; // ✅ NEW


function App() {
  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="upload-rollover" element={<UploadRollover />} />
          <Route path="upload-booking" element={<UploadBooking />} />
          <Route path="free-tip" element={<UploadFreeTip />} />
          <Route path="rollover-list" element={<RolloverList />} />
          <Route path="booking-list" element={<BookingCodeList />} />
          <Route path="booking-history" element={<BookingPurchaseList />} />
          <Route path="rollover-history" element={<RolloverSubscriptionList />} />
          <Route path="wallets" element={<WalletManager />} />
          <Route path="users" element={<UserManager />} />
          <Route path="referrals" element={<ReferralLeaderboard />} />
          <Route path="withdrawals" element={<WithdrawManager />} />
          <Route path="roles" element={<RoleManager />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="rollover-plans" element={<RolloverPlans />} /> {/* ✅ NEW */}
        </Route>
      </Routes>
    </>
  );
}

export default App;

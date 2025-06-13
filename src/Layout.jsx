import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">COT Admin</h2>
        <nav className="space-y-2">
          <Link to="/" className="block hover:text-yellow-400">Dashboard</Link>
          <Link to="/upload-rollover" className="block hover:text-yellow-400">Upload Rollover</Link>
          <Link to="/rollover-list" className="block hover:text-yellow-400">Rollover List</Link>
          <Link to="/upload-booking" className="block hover:text-yellow-400">Upload Booking Code</Link>
          <Link to="/booking-list" className="block hover:text-yellow-400">Booking Code List</Link>
          <Link to="/wallet-manager" className="block hover:text-yellow-400">Wallet Manager</Link>
          <Link to="/user-manager" className="block hover:text-yellow-400">User Manager</Link>
          <Link to="/admin-settings" className="block hover:text-yellow-400">Admin Settings</Link>
          <Link to="/notification-panel" className="block hover:text-yellow-400">Send Notification</Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

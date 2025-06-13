import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UserViewer() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/users').then(res => setUsers(res.data));
  }, []);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h2 className="text-xl font-bold mb-4">All Users Overview</h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Telegram ID</th>
              <th className="p-2 border">Main Wallet</th>
              <th className="p-2 border">Bonus Wallet</th>
              <th className="p-2 border">Plan Type</th>
              <th className="p-2 border">Day #</th>
              <th className="p-2 border">Referral Code</th>
              <th className="p-2 border">Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={i}>
                <td className="p-2 border">{u.telegramId}</td>
                <td className="p-2 border">{u.wallet?.main || 0}</td>
                <td className="p-2 border">{u.wallet?.bonus || 0}</td>
                <td className="p-2 border">{u.subscription?.planType || '-'}</td>
                <td className="p-2 border">{u.subscription?.dayNumber || '-'}</td>
                <td className="p-2 border">{u.referralCode || '-'}</td>
                <td className="p-2 border">{new Date(u.createdAt).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UserViewer;

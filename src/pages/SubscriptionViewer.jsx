import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SubscriptionViewer() {
  const [subs, setSubs] = useState([]);

  useEffect(() => {
    const fetchSubs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/subs');
        setSubs(res.data);
      } catch {
        setSubs([]);
      }
    };
    fetchSubs();
  }, []);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Active Subscriptions</h2>
      <table className="w-full border text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Telegram ID</th>
            <th className="p-2 border">Plan Type</th>
            <th className="p-2 border">Start Date</th>
            <th className="p-2 border">Day #</th>
          </tr>
        </thead>
        <tbody>
          {subs.map((s, i) => (
            <tr key={i}>
              <td className="p-2 border">{s.telegramId}</td>
              <td className="p-2 border">{s.planType}</td>
              <td className="p-2 border">{new Date(s.startDate).toLocaleDateString()}</td>
              <td className="p-2 border">{s.dayNumber}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SubscriptionViewer;

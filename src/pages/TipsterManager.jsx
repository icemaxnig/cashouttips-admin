import React, { useState } from 'react';
import axios from 'axios';

export default function TipsterManager() {
  const [query, setQuery] = useState('');
  const [user, setUser] = useState(null);
  const [plans, setPlans] = useState([]);
  const [message, setMessage] = useState('');

  const planOptions = [
    'free', '1.5-3day', '1.5-5day', '1.5-7day',
    '2.0-3day', '2.0-5day', '2.0-7day',
    '3.0-3day', '3.0-5day', '3.0-7day'
  ];

  const searchUser = async () => {
    setMessage('');
    const { data } = await axios.get(`/api/users/search?q=${query}`);
    if (data.length) {
      setUser(data[0]);
      setPlans(data[0].allowedPlans || []);
    } else {
      setUser(null);
      setMessage('User not found');
    }
  };

  const toggleTipster = async () => {
    try {
      const { data } = await axios.post('/api/users/tipster', {
        telegramId: user.telegramId,
        isTipster: !user.isTipster,
        allowedPlans: !user.isTipster ? plans : []
      });
      setUser({ ...user, isTipster: !user.isTipster });
      setMessage('✅ Tipster status updated');
    } catch {
      setMessage('❌ Failed to update role');
    }
  };

  const handlePlanToggle = (plan) => {
    setPlans(prev =>
      prev.includes(plan) ? prev.filter(p => p !== plan) : [...prev, plan]
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Tipster Role Manager</h2>
      <input
        placeholder="Enter Telegram ID or name"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button onClick={searchUser}>Search</button>

      {user && (
        <div className="mt-4 p-4 border rounded">
          <p><strong>ID:</strong> {user.telegramId}</p>
          <p><strong>Name:</strong> {user.name || 'N/A'}</p>
          <p><strong>Status:</strong> {user.isTipster ? '✅ Tipster' : '❌ Not a Tipster'}</p>
          <button onClick={toggleTipster} className="bg-blue-500 text-white px-3 py-1 rounded">
            {user.isTipster ? 'Remove Tipster' : 'Make Tipster'}
          </button>

          {user.isTipster && (
            <div className="mt-3">
              <p className="font-bold">Allowed Plans:</p>
              <div className="flex flex-wrap gap-2">
                {planOptions.map(plan => (
                  <label key={plan} className="text-sm bg-gray-200 px-2 py-1 rounded">
                    <input
                      type="checkbox"
                      checked={plans.includes(plan)}
                      onChange={() => handlePlanToggle(plan)}
                    />{' '}{plan}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {message && <p className="mt-3 text-blue-600">{message}</p>}
    </div>
  );
}

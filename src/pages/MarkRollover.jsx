import React, { useState } from 'react';
import axios from 'axios';

function MarkRollover() {
  const [planType, setPlanType] = useState('1.5-3day');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/rollover/mark', { planType, result });
      setStatus('✅ Rollover marked as ' + result);
      setResult('');
    } catch {
      setStatus('❌ Failed to mark rollover');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Mark Rollover Tip</h2>
      <form onSubmit={handleSubmit}>
        <select className="w-full mb-2 p-2 border rounded" value={planType} onChange={e => setPlanType(e.target.value)}>
          <option value="1.5-3day">1.5 – 3 Days</option>
          <option value="2.0-5day">2.0 – 5 Days</option>
          <option value="3.0-7day">3.0 – 7 Days</option>
        </select>
        <select className="w-full mb-4 p-2 border rounded" value={result} onChange={e => setResult(e.target.value)}>
          <option value="">Select result</option>
          <option value="WON">WON</option>
          <option value="LOST">LOST</option>
        </select>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Mark Result</button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}

export default MarkRollover;

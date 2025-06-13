import React, { useState } from 'react';
import axios from 'axios';

function MarkCode() {
  const [codeId, setCodeId] = useState('');
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/booking/mark', { codeId, result });
      setStatus('✅ Code marked as ' + result);
      setCodeId('');
      setResult('');
    } catch {
      setStatus('❌ Failed to mark code');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Mark Booking Code</h2>
      <form onSubmit={handleSubmit}>
        <input
          className="w-full p-2 border rounded mb-3"
          placeholder="Enter Code ID"
          value={codeId}
          onChange={e => setCodeId(e.target.value)}
        />
        <select className="w-full mb-4 p-2 border rounded" value={result} onChange={e => setResult(e.target.value)}>
          <option value="">Select result</option>
          <option value="WON">WON</option>
          <option value="LOST">LOST</option>
        </select>
        <button className="bg-purple-600 text-white px-4 py-2 rounded">Mark Result</button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}

export default MarkCode;

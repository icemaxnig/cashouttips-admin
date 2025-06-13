import React, { useState } from 'react';
import axios from 'axios';

function MarkFreeTip() {
  const [result, setResult] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/free/mark', { result });
      setStatus('✅ Free tip marked as ' + result);
      setResult('');
    } catch {
      setStatus('❌ Failed to mark tip');
    }
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Mark Free Tip</h2>
      <form onSubmit={handleSubmit}>
        <select className="w-full mb-4 p-2 border rounded" value={result} onChange={e => setResult(e.target.value)}>
          <option value="">Select result</option>
          <option value="WON">WON</option>
          <option value="LOST">LOST</option>
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Mark Result</button>
      </form>
      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}

export default MarkFreeTip;

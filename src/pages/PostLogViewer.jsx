import React, { useEffect, useState } from 'react';
import axios from 'axios';

function PostLogViewer() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/logs');
        setLogs(res.data);
      } catch {
        setLogs([]);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Post Logs</h2>
      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Type</th>
              <th className="p-2 border">Plan Type</th>
              <th className="p-2 border">Posted By</th>
              <th className="p-2 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, idx) => (
              <tr key={idx}>
                <td className="p-2 border">{log.type}</td>
                <td className="p-2 border">{log.planType || '-'}</td>
                <td className="p-2 border">{log.postedBy}</td>
                <td className="p-2 border">{new Date(log.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PostLogViewer;

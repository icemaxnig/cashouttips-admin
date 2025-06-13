
// AdminRolloverManager.jsx (with inline edit wiring)
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminRolloverManager = () => {
  const [tips, setTips] = useState([]);
  const [editForm, setEditForm] = useState(null);

  const fetchTips = async () => {
    const res = await axios.get('/api/admin/rollover/all');
    setTips(res.data);
  };

  useEffect(() => {
    fetchTips();
  }, []);

  const deleteTip = async (id) => {
    if (window.confirm("Delete this tip?")) {
      await axios.delete('/api/admin/rollover/' + id);
      fetchTips();
    }
  };

  const startEdit = (tip) => {
    setEditForm({
      _id: tip._id,
      planId: tip.plan,
      totalOdds: tip.totalOdds,
      note: tip.note,
      expiresAt: tip.expiresAt.slice(0, 16),
      games: tip.games
    });
  };

  const handleGameChange = (index, field, value) => {
    const updated = [...editForm.games];
    updated[index][field] = value;
    setEditForm({ ...editForm, games: updated });
  };

  const handleEditSubmit = async () => {
    await axios.put('/api/admin/rollover/' + editForm._id, editForm);
    alert('Tip updated successfully!');
    setEditForm(null);
    fetchTips();
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4 text-[#1F2D5C]">Manage Rollover Tips</h2>

      {editForm && (
        <div className="mb-8 p-4 bg-yellow-100 rounded-xl shadow-inner">
          <h3 className="font-bold mb-2">Editing Tip</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <input type="text" placeholder="Plan ID" value={editForm.planId} onChange={(e) => setEditForm({ ...editForm, planId: e.target.value })} className="p-2 border rounded" />
            <input type="datetime-local" value={editForm.expiresAt} onChange={(e) => setEditForm({ ...editForm, expiresAt: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Total Odds" value={editForm.totalOdds} onChange={(e) => setEditForm({ ...editForm, totalOdds: e.target.value })} className="p-2 border rounded" />
            <input type="text" placeholder="Note" value={editForm.note} onChange={(e) => setEditForm({ ...editForm, note: e.target.value })} className="p-2 border rounded" />
          </div>

          {editForm.games.map((game, index) => (
            <div key={index} className="grid grid-cols-6 gap-2 mb-2">
              <input type="text" placeholder="League" value={game.league} onChange={(e) => handleGameChange(index, 'league', e.target.value)} />
              <input type="text" placeholder="Team A" value={game.teamA} onChange={(e) => handleGameChange(index, 'teamA', e.target.value)} />
              <input type="text" placeholder="Team B" value={game.teamB} onChange={(e) => handleGameChange(index, 'teamB', e.target.value)} />
              <input type="datetime-local" value={game.kickoff?.slice(0, 16)} onChange={(e) => handleGameChange(index, 'kickoff', e.target.value)} />
              <input type="number" step="0.01" value={game.odds} onChange={(e) => handleGameChange(index, 'odds', e.target.value)} />
              <input type="text" placeholder="Prediction" value={game.prediction} onChange={(e) => handleGameChange(index, 'prediction', e.target.value)} />
            </div>
          ))}

          <button onClick={handleEditSubmit} className="mt-3 px-4 py-2 bg-green-700 text-white rounded">Update Tip</button>
        </div>
      )}

      {tips.map(tip => (
        <div key={tip._id} className="mb-4 p-4 rounded-xl shadow bg-white">
          <div className="text-sm text-gray-500">Plan ID: {tip.plan}</div>
          <div className="font-bold text-[#1F2D5C]">Total Odds: {tip.totalOdds}</div>
          <div className="text-xs text-gray-600">Expires: {new Date(tip.expiresAt).toLocaleString()}</div>
          <div className="text-sm italic text-gray-600">Note: {tip.note}</div>
          {tip.games.map((g, i) => (
            <div key={i} className="text-sm text-gray-700 mb-1 border-b pb-1">
              {g.teamA} vs {g.teamB} ({g.league}) — {g.prediction} | {g.odds}
            </div>
          ))}
          <div className="flex gap-2 mt-2">
            <button onClick={() => startEdit(tip)} className="px-3 py-1 text-sm rounded bg-blue-600 text-white">Edit</button>
            <button onClick={() => deleteTip(tip._id)} className="px-3 py-1 text-sm rounded bg-red-600 text-white">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminRolloverManager;

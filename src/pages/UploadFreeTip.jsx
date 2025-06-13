import React, { useState } from "react";
import api from "../api";
import { toast } from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react"; // Icons

const UploadFreeTip = () => {
  const [games, setGames] = useState([
    { sport: "", time: "", league: "", teams: "" }
  ]);

  const handleChange = (index, field, value) => {
    const updatedGames = [...games];
    updatedGames[index][field] = value;
    setGames(updatedGames);
  };

  const addGame = () => {
    if (games.length < 3) {
      setGames([...games, { sport: "", time: "", league: "", teams: "" }]);
    }
  };

  const removeGame = (index) => {
    const updated = games.filter((_, i) => i !== index);
    setGames(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/freetip", { games });
      toast.success("Free Tip uploaded and sent to Telegram!");
      setGames([{ sport: "", time: "", league: "", teams: "" }]);
    } catch (err) {
      toast.error("Upload failed. Check Telegram bot or network.");
    }
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Upload Free Tip</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {games.map((game, index) => (
          <div key={index} className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="🏟️ Sport"
                className="border p-2 rounded"
                value={game.sport}
                onChange={(e) => handleChange(index, "sport", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="🕒 Time"
                className="border p-2 rounded"
                value={game.time}
                onChange={(e) => handleChange(index, "time", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="🌍 League"
                className="border p-2 rounded"
                value={game.league}
                onChange={(e) => handleChange(index, "league", e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="⚽ Teams (e.g. Arsenal vs Chelsea)"
                className="border p-2 rounded col-span-2 md:col-span-1"
                value={game.teams}
                onChange={(e) => handleChange(index, "teams", e.target.value)}
                required
              />
            </div>
            {games.length > 1 && (
              <button
                type="button"
                onClick={() => removeGame(index)}
                className="mt-2 text-sm text-red-500 flex items-center gap-1"
              >
                <Trash2 size={14} /> Remove Game
              </button>
            )}
          </div>
        ))}

        {games.length < 3 && (
          <button
            type="button"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={addGame}
          >
            <Plus size={16} /> Add Another Game
          </button>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700"
        >
          ✅ Submit & Send to Telegram
        </button>
      </form>

      {/* Live Preview Section */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4 text-gray-700">📺 Preview</h3>
        <div className="bg-gray-50 p-4 rounded-2xl shadow max-w-2xl">
          {games.map((game, index) => (
            <div key={index} className="mb-3 border-b pb-2">
              <p className="text-sm font-medium text-gray-600">{game.sport} | {game.league}</p>
              <p className="text-lg font-semibold">{game.teams}</p>
              <p className="text-xs text-gray-500">Time: {game.time}</p>
            </div>
          ))}
          <button
            type="button"
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl font-semibold"
            onClick={() => window.open("https://t.me/cashouttips_ai", "_blank")}
          >
            View Full Tip on Telegram
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadFreeTip;

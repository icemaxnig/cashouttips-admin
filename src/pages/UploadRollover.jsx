// 📄 UploadRollover.jsx (Add sport type field to games)
import React, { useEffect, useState } from "react";
import CreatableSelect from "react-select/creatable";
import api from "../api";
import toast from "react-hot-toast";

const allBookmakers = ["Bet9ja", "SportyBet", "1xBet", "BetKing", "BetWay", "Melbet"];
const sportOptions = ["Football", "Basketball", "Tennis", "Baseball", "Hockey"];

const UploadRollover = () => {
  const [plans, setPlans] = useState([]);
  const [plan, setPlan] = useState(null);
  const [gameForm, setGameForm] = useState({ sport: "Football", league: "", teamA: "", teamB: "", time: "", odds: "", prediction: "" });
  const [games, setGames] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [bookingCode, setBookingCode] = useState("");
  const [bookmaker, setBookmaker] = useState("");
  const [oddsError, setOddsError] = useState(false);

  useEffect(() => {
    api.get("/rollover/plans")
      .then(res => setPlans(res.data))
      .catch(() => toast.error("Failed to load rollover plans"));
  }, []);

  const handleGameChange = (key, value) => {
    setGameForm(prev => ({ ...prev, [key]: value }));
  };

  const getTotalOdds = () => {
    return games.reduce((acc, g) => acc + parseFloat(g.odds || 0), 0);
  };

  const getOddsLimit = () => {
    return plan ? parseFloat(plan.odds) : null;
  };

  const saveGame = () => {
    const { sport, league, teamA, teamB, time, odds } = gameForm;
    if (!sport || !league || !teamA || !teamB || !time || !odds) {
      toast.error("Fill all required game fields");
      return;
    }

    const totalSoFar = getTotalOdds();
    const futureTotal = totalSoFar + parseFloat(odds);
    const oddsLimit = getOddsLimit();

    if (oddsLimit && futureTotal > oddsLimit) {
      toast.error(`Cumulative odds exceed limit (${futureTotal.toFixed(2)} > ${oddsLimit})`);
      setOddsError(true);
      return;
    }

    setOddsError(false);
    if (editingIndex !== null) {
      const updated = [...games];
      updated[editingIndex] = gameForm;
      setGames(updated);
      setEditingIndex(null);
    } else {
      setGames([...games, gameForm]);
    }
    setGameForm({ sport: "Football", league: "", teamA: "", teamB: "", time: "", odds: "", prediction: "" });
  };

  const editGame = (index) => {
    setGameForm(games[index]);
    setEditingIndex(index);
  };

  const deleteGame = (index) => {
    const updated = games.filter((_, i) => i !== index);
    setGames(updated);
    if (editingIndex === index) setGameForm({ sport: "Football", league: "", teamA: "", teamB: "", time: "", odds: "", prediction: "" });
  };

  const getEarliestKickoff = () => {
    if (!games.length) return "";
    return games.reduce((earliest, g) => new Date(g.time) < new Date(earliest) ? g.time : earliest, games[0].time);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!plan || !bookingCode || !bookmaker) {
      toast.error("Please complete all fields");
      return;
    }

    const totalOdds = getTotalOdds();
    const oddsLimit = getOddsLimit();
    if (oddsLimit && totalOdds > oddsLimit) {
      toast.error(`Total odds (${totalOdds.toFixed(2)}) exceed the allowed max of ${oddsLimit}`);
      return;
    }

    const expiresAt = games.length ? getEarliestKickoff() : new Date().toISOString();
    const formattedGames = games.map(g => ({
      sport: g.sport,
      league: g.league,
      teamA: g.teamA,
      teamB: g.teamB,
      teams: `${g.teamA} vs ${g.teamB}`,
      time: g.time,
      odds: g.odds,
      prediction: g.prediction
    }));

    const payload = {
      planId: plan._id,
      planName: plan.name,
      games: formattedGames,
      totalOdds,
      bookingCode,
      bookmaker,
      expiresAt
    };

    try {
      await api.post("/admin/rollover-tip", payload);
      toast.success("✅ Tip uploaded");
      setGames([]);
      setGameForm({ sport: "Football", league: "", teamA: "", teamB: "", time: "", odds: "", prediction: "" });
      setBookingCode("");
      setBookmaker("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed");
    }
  };

  return (
    <div className="p-6 bg-[#1F2D5C] text-white min-h-screen">
      <h2 className="text-2xl font-bold text-yellow-400 mb-4 font-poppins">Upload Rollover Tip</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <select onChange={(e) => {
          const selected = plans.find(p => p._id === e.target.value);
          setPlan(selected);
        }} className="input w-full text-black p-2 rounded-xl">
          <option value="">Select Rollover Plan</option>
          {plans.map(p => (
            <option key={p._id} value={p._id}>
              {p.name} — {p.odds} Odds / {p.duration} Days
            </option>
          ))}
        </select>

        <div className="bg-white text-black p-4 rounded-xl shadow-md">
          <select
            value={gameForm.sport}
            onChange={e => handleGameChange("sport", e.target.value)}
            className="input w-full mb-2 p-2 rounded-xl"
          >
            {sportOptions.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <input className="input w-full mb-2" placeholder="League" value={gameForm.league} onChange={e => handleGameChange("league", e.target.value)} />
          <div className="grid md:grid-cols-2 gap-2">
            <input className="input w-full" placeholder="Team A" value={gameForm.teamA} onChange={e => handleGameChange("teamA", e.target.value)} />
            <input className="input w-full" placeholder="Team B" value={gameForm.teamB} onChange={e => handleGameChange("teamB", e.target.value)} />
          </div>
          <input className="input w-full my-2" placeholder="Prediction" value={gameForm.prediction} onChange={e => handleGameChange("prediction", e.target.value)} />
          <input className="input w-full mb-2" type="datetime-local" value={gameForm.time} onChange={e => handleGameChange("time", e.target.value)} />
          <div className="flex items-center gap-2">
            <input className={`input w-full mb-2 ${oddsError ? 'border-2 border-red-500' : ''}`} placeholder="Odds" value={gameForm.odds} onChange={e => handleGameChange("odds", e.target.value)} />
            {plan && (
              <span className="text-xs text-gray-700">Total: {getTotalOdds().toFixed(2)} / Max: {getOddsLimit()}</span>
            )}
          </div>
          <button type="button" onClick={saveGame} className="btn bg-blue-600 text-white w-full mt-2">{editingIndex !== null ? "Update Game" : "Add Game"}</button>
        </div>

        {games.length > 0 && (
          <div className="space-y-2">
            {games.map((g, i) => (
              <div key={i} className="bg-white text-black p-3 rounded-lg shadow flex justify-between items-center">
                <div>
                  <div className="font-bold">{g.teamA} vs {g.teamB}</div>
                  <div className="text-xs text-gray-600">{g.sport} • {g.league} • {g.prediction} • {g.odds} odds</div>
                  <div className="text-xs text-gray-500">Kickoff: {new Date(g.time).toLocaleString()}</div>
                </div>
                <div className="flex gap-2">
                  <button type="button" onClick={() => editGame(i)} className="text-blue-600 font-bold text-sm">Edit</button>
                  <button type="button" onClick={() => deleteGame(i)} className="text-red-600 font-bold text-sm">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        <CreatableSelect
          options={allBookmakers.map(b => ({ label: b, value: b }))}
          value={bookmaker ? { label: bookmaker, value: bookmaker } : null}
          onChange={(opt) => setBookmaker(opt?.value || "")}
          placeholder="Select Bookmaker"
          className="mb-3 text-black"
        />
        <input className="input w-full text-black p-2 rounded-xl mb-3" placeholder="Booking Code" value={bookingCode} onChange={e => setBookingCode(e.target.value)} />

        <button type="submit" className="bg-yellow-400 text-black py-2 px-4 rounded-full font-bold w-full hover:bg-yellow-300">
          ✅ Submit Tip
        </button>
      </form>
    </div>
  );
};

export default UploadRollover;

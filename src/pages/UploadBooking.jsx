import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import api from "../api";
import { notifySuccess, notifyError } from "../components/Toast";

const BOOKMAKERS = ["Bet9ja", "1xbet", "Betway", "SportyBet", "BetKing"];
const CATEGORIES = ["Sure 2+", "Over Goals", "Underdogs", "Midweek Special"];
const URGENCY_TAGS = ["🔥 HOT", "⚡ FLASH", "🚀 BOOSTED", "🎯 TARGET"];

const getBookingPrice = (odds) => {
  if (odds >= 2 && odds < 5) return { price: 3000, rate: "98%" };
  if (odds >= 5 && odds < 11) return { price: 2500, rate: "90%" };
  if (odds >= 11 && odds < 21) return { price: 2000, rate: "85%" };
  if (odds >= 21 && odds < 31) return { price: 1500, rate: "80%" };
  if (odds >= 31 && odds < 51) return { price: 1000, rate: "70%" };
  if (odds >= 51 && odds < 101) return { price: 500, rate: "60%" };
  if (odds >= 101) return { price: 300, rate: "50%" };
  return { price: 0, rate: "N/A" };
};

const UploadBooking = () => {
  const [totalOdds, setTotalOdds] = useState("");
  const [bookingCode, setBookingCode] = useState("");
  const [bookmaker, setBookmaker] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [category, setCategory] = useState("");
  const [urgency, setUrgency] = useState("");
  const [confidence, setConfidence] = useState(75);
  const [slotLimit, setSlotLimit] = useState(0);
  const [expiryHours, setExpiryHours] = useState("");
  const [expiryMinutes, setExpiryMinutes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!totalOdds || !bookingCode || !bookmaker || !category || !urgency || (!expiryHours && !expiryMinutes)) {
      return notifyError("All fields are required");
    }

    const { price } = getBookingPrice(Number(totalOdds));
    const totalExpiryMinutes = parseInt(expiryHours || 0) * 60 + parseInt(expiryMinutes || 0);

    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      await api.post(
        "/booking-codes/upload",
        {
          bookingCode,
          totalOdds: Number(totalOdds),
          platform: bookmaker,
          price,
          confidence,
          adminNote,
          category,
          urgency,
          slotLimit: Number(slotLimit),
          expiryMinutes: totalExpiryMinutes,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      notifySuccess("Booking Code Uploaded");
      setTotalOdds("");
      setBookingCode("");
      setBookmaker("");
      setAdminNote("");
      setCategory("");
      setUrgency("");
      setExpiryHours("");
      setExpiryMinutes("");
      setConfidence(75);
      setSlotLimit(0);
    } catch (err) {
      console.error("Booking Upload Error:", err);
      notifyError("Failed to upload booking code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E2C] text-white p-6">
      <div className="max-w-2xl mx-auto bg-[#0A0E2C] p-6 rounded shadow">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Upload Booking Code</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            step="0.01"
            placeholder="Total Odds"
            value={totalOdds}
            onChange={(e) => {
              const val = e.target.value;
              setTotalOdds(val);
              setConfidence(getBookingPrice(Number(val)).rate.replace("%", ""));
            }}
            className="input w-full text-black"
          />

          <input
            type="text"
            placeholder="Booking Code"
            value={bookingCode}
            onChange={(e) => setBookingCode(e.target.value)}
            className="input w-full text-black"
          />

          <CreatableSelect
            placeholder="Select or type bookmaker"
            options={BOOKMAKERS.map((b) => ({ label: b, value: b }))}
            onChange={(opt) => setBookmaker(opt?.value || "")}
            value={bookmaker ? { label: bookmaker, value: bookmaker } : null}
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input w-full text-black"
          >
            <option value="">Select Category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="input w-full text-black"
          >
            <option value="">Select Urgency</option>
            {URGENCY_TAGS.map((tag) => (
              <option key={tag}>{tag}</option>
            ))}
          </select>

          <label className="block text-yellow-300 text-sm">AI Confidence: {confidence}%</label>
          <input
            type="range"
            min="40"
            max="99"
            step="1"
            value={confidence}
            onChange={(e) => setConfidence(Number(e.target.value))}
            className="w-full"
          />

          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Expiry Hours"
              value={expiryHours}
              onChange={(e) => setExpiryHours(e.target.value)}
              className="input w-1/2 text-black"
            />
            <input
              type="number"
              placeholder="Expiry Minutes"
              value={expiryMinutes}
              onChange={(e) => setExpiryMinutes(e.target.value)}
              className="input w-1/2 text-black"
            />
          </div>

          <input
            type="number"
            placeholder="Slot Limit (0 for unlimited)"
            value={slotLimit}
            onChange={(e) => setSlotLimit(Number(e.target.value))}
            className="input w-full text-black"
          />

          <textarea
            placeholder="Optional Admin Note"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className="input w-full text-black"
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="btn bg-yellow-400 text-[#0A0E2C] font-semibold w-full"
          >
            {loading ? "Uploading..." : "Upload Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadBooking;

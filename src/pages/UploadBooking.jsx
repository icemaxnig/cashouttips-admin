// UploadBooking.jsx (Branded for CashoutTips)
import React, { useState } from "react";
import CreatableSelect from "react-select/creatable";
import adminApi from "../api/adminApi";
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

  const { price, rate } = getBookingPrice(Number(totalOdds));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!totalOdds || !bookingCode || !bookmaker || !category || !urgency || (!expiryHours && !expiryMinutes)) {
      return notifyError("All fields are required");
    }

    const totalExpiryMinutes = parseInt(expiryHours || 0) * 60 + parseInt(expiryMinutes || 0);

    try {
      setLoading(true);
      await adminApi.post(
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
    <div className="min-h-screen bg-[#1F2D5C] text-white p-6">
      <div className="max-w-3xl mx-auto bg-[#1F2D5C] border border-yellow-500 p-6 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-yellow-400 mb-6 font-[Poppins]">📄 Upload Booking Code</h2>
        <form onSubmit={handleSubmit} className="space-y-5 font-[Inter]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="number"
              step="0.01"
              placeholder="🎯 Total Odds"
              value={totalOdds}
              onChange={(e) => {
                const val = e.target.value;
                setTotalOdds(val);
                setConfidence(getBookingPrice(Number(val)).rate.replace("%", ""));
              }}
              className="input w-full text-black p-3 rounded-xl"
            />
            <input
              type="text"
              placeholder="🔐 Booking Code"
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value)}
              className="input w-full text-black p-3 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm text-yellow-200 mb-1">📱 Bookmaker</label>
            <CreatableSelect
              placeholder="Select or type bookmaker"
              options={BOOKMAKERS.map((b) => ({ label: b, value: b }))}
              onChange={(opt) => setBookmaker(opt?.value || "")}
              value={bookmaker ? { label: bookmaker, value: bookmaker } : null}
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "#1F2D5C",
                  color: "#FAFAFA",
                  borderColor: "#FFD700",
                  borderRadius: "0.75rem",
                  padding: "4px",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#1F2D5C",
                  color: "#FAFAFA",
                }),
                option: (base, state) => ({
                  ...base,
                  backgroundColor: state.isFocused ? "#FFD700" : "#1F2D5C",
                  color: state.isFocused ? "#1F2D5C" : "#FAFAFA",
                  cursor: "pointer",
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#FAFAFA",
                }),
              }}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input w-full text-black p-3 rounded-xl"
            >
              <option value="">📂 Select Category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={urgency}
              onChange={(e) => setUrgency(e.target.value)}
              className="input w-full text-black p-3 rounded-xl"
            >
              <option value="">⏱️ Select Urgency</option>
              {URGENCY_TAGS.map((tag) => (
                <option key={tag}>{tag}</option>
              ))}
            </select>
          </div>
          <p className="text-sm text-green-300">
            💰 Auto Price: ₦{price.toLocaleString()} ({rate})
          </p>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="number"
              placeholder="🕐 Expiry Hours"
              value={expiryHours}
              onChange={(e) => setExpiryHours(e.target.value)}
              className="input text-black p-3 rounded-xl"
            />
            <input
              type="number"
              placeholder="⏳ Expiry Minutes"
              value={expiryMinutes}
              onChange={(e) => setExpiryMinutes(e.target.value)}
              className="input text-black p-3 rounded-xl"
            />
          </div>
          <div>
            <input
              type="number"
              placeholder="🎟️ Number of Slots"
              value={slotLimit}
              onChange={(e) => setSlotLimit(Number(e.target.value))}
              className="input w-full text-black p-3 rounded-xl"
            />
            <small className="text-yellow-200 text-sm">
              Enter <b>0</b> for unlimited access
            </small>
          </div>
          <textarea
            placeholder="📝 Optional Admin Note"
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
            className="input w-full text-black p-3 rounded-xl"
          ></textarea>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#1F2D5C] font-bold py-3 rounded-full transition-all"
          >
            {loading ? "Uploading..." : "✅ Upload Booking"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadBooking;

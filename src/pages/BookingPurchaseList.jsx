// src/pages/BookingPurchaseList.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { saveAs } from "file-saver";
import { unparse } from "papaparse";

const BookingPurchaseList = () => {
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseRes, userRes] = await Promise.all([
          api.get("/booking-purchase"),
          api.get("/api/users")
        ]);
        const userMap = {};
        userRes.data.forEach(u => userMap[u._id] = u.email);
        setUsers(userMap);
        setPurchases(purchaseRes.data);
      } catch (err) {
        console.error('Data load failed');
      }
    };
    fetchData();
  }, []);

  const downloadCSV = () => {
    const csv = unparse(
      purchases.map((p) => ({
        user: users[p.userId] || p.userId,
        bookingCode: p.bookingId,
        amount: p.amount,
        referral: p.referralEarning,
        created: new Date(p.createdAt).toLocaleString()
      }))
    );

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "booking_purchases.csv");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Booking Purchase History</h2>
      <button
        onClick={downloadCSV}
        className="mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Download CSV
      </button>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">User</th>
              <th className="p-2 border">Booking Code</th>
              <th className="p-2 border">Amount (₦)</th>
              <th className="p-2 border">Referral Earning</th>
              <th className="p-2 border">Created</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((p) => (
              <tr key={p._id}>
                <td className="p-2 border font-mono">{users[p.userId] || p.userId}</td>
                <td className="p-2 border">{p.bookingId}</td>
                <td className="p-2 border">₦{p.amount}</td>
                <td className="p-2 border">₦{p.referralEarning}</td>
                <td className="p-2 border">{new Date(p.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingPurchaseList;
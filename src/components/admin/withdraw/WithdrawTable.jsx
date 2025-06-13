import React from "react";

const WithdrawTable = ({ data, onUpdateStatus }) => {
  const handleReject = (id) => {
    const reason = prompt("Enter rejection reason:");
    if (reason) onUpdateStatus(id, "Rejected", reason);
  };

  return (
    <table className="min-w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">User</th>
          <th className="p-2 border">Amount</th>
          <th className="p-2 border">Wallet</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Date</th>
          <th className="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map((w) => (
          <tr key={w._id}>
            <td className="p-2 border">{w.user?.email || "N/A"}</td>
            <td className="p-2 border">₦{w.amount}</td>
            <td className="p-2 border">{w.walletType}</td>
            <td className="p-2 border">{w.status}</td>
            <td className="p-2 border">
              {new Date(w.createdAt).toLocaleString()}
            </td>
            <td className="p-2 border space-x-2">
              {w.status === "Pending" && (
                <>
                  <button
                    onClick={() => onUpdateStatus(w._id, "Paid")}
                    className="bg-green-600 text-white px-2 py-1 rounded"
                  >
                    Mark as Paid
                  </button>
                  <button
                    onClick={() => handleReject(w._id)}
                    className="bg-red-600 text-white px-2 py-1 rounded"
                  >
                    Reject
                  </button>
                </>
              )}
              {w.status !== "Pending" && (
                <button
                  onClick={() => onUpdateStatus(w._id, "Pending")}
                  className="bg-gray-500 text-white px-2 py-1 rounded"
                >
                  Revert
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default WithdrawTable;

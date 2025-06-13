import React from "react";

const BookingTableRow = ({
  code,
  isSelected,
  onSelect,
  onUpdateStatus,
  onUserClick,
}) => {
  const formatDateTime = (iso) => new Date(iso).toLocaleString();

  const getStatusBadge = (status) => {
    const base = "px-2 py-1 rounded text-white text-xs font-semibold";
    switch (status) {
      case "WON":
        return <span className={`${base} bg-green-600`}>WON</span>;
      case "LOST":
        return <span className={`${base} bg-red-600`}>LOST</span>;
      default:
        return <span className={`${base} bg-gray-500`}>PENDING</span>;
    }
  };

  return (
    <tr key={code._id}>
      <td className="p-2 border text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(code._id)}
        />
      </td>
      <td className="p-2 border">{code.totalOdds}</td>
      <td className="p-2 border font-mono">{code.bookingCode}</td>
      <td
        className="p-2 border text-blue-600 underline cursor-pointer"
        onClick={() => onUserClick(code.user?.email)}
      >
        {code.user?.email || "N/A"}
      </td>
      <td className="p-2 border">{formatDateTime(code.createdAt)}</td>
      <td className="p-2 border text-center">{getStatusBadge(code.status)}</td>
      <td className="p-2 border space-x-2">
        <button
          onClick={() => onUpdateStatus(code._id, "WON")}
          className="bg-green-600 text-white px-2 py-1 rounded"
        >
          Mark WON
        </button>
        <button
          onClick={() => onUpdateStatus(code._id, "LOST")}
          className="bg-red-600 text-white px-2 py-1 rounded"
        >
          Mark LOST
        </button>
        <button
          onClick={() => onUpdateStatus(code._id, "Pending")}
          className="bg-gray-500 text-white px-2 py-1 rounded"
        >
          Revert
        </button>
      </td>
    </tr>
  );
};

export default BookingTableRow;

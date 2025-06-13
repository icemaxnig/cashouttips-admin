import React, { useState, useEffect } from "react";

const UserTable = ({ users = [] }) => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const currentUsers = users.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();

  return (
    <div className="bg-white/10 p-4 rounded-xl text-white mt-6">
      <h3 className="text-lg font-bold mb-2">📋 User List</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-yellow-400 border-b border-yellow-300">
              <th className="py-2 pr-4">Name</th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">Odds Plan</th>
              <th className="py-2 pr-4">Status</th>
              <th className="py-2">Expires</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((u, idx) => (
              <tr key={idx} className="border-b border-white/10">
                <td className="py-2 pr-4">{u.name}</td>
                <td className="py-2 pr-4">{u.email}</td>
                <td className="py-2 pr-4">{u.oddsPlan}</td>
                <td className="py-2 pr-4">
                  {u.isSubscribed ? (
                    <span className="text-green-400 font-semibold">Active</span>
                  ) : (
                    <span className="text-red-400 font-semibold">Expired</span>
                  )}
                </td>
                <td className="py-2">{u.subscriptionExpires ? formatDate(u.subscriptionExpires) : "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 rounded bg-white/20 hover:bg-white/30 text-sm"
        >
          ◀ Prev
        </button>
        <span className="px-2 text-sm text-yellow-300">Page {page} of {totalPages}</span>
        <button
          onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 rounded bg-white/20 hover:bg-white/30 text-sm"
        >
          Next ▶
        </button>
      </div>
    </div>
  );
};

export default UserTable;
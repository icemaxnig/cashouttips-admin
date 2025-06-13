import React from "react";

const UserTable = ({ data }) => {
  return (
    <table className="min-w-full text-sm border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-2 border">Email</th>
          <th className="p-2 border">Main Wallet</th>
          <th className="p-2 border">Bonus Wallet</th>
          <th className="p-2 border">Referred</th>
          <th className="p-2 border">Status</th>
          <th className="p-2 border">Registered</th>
        </tr>
      </thead>
      <tbody>
        {data.map((u) => (
          <tr key={u._id}>
            <td className="p-2 border">{u.email}</td>
            <td className="p-2 border">₦{u.wallet || 0}</td>
            <td className="p-2 border">₦{u.bonusWallet || 0}</td>
            <td className="p-2 border">{u.referredUsers?.length || 0}</td>
            <td className="p-2 border capitalize">{u.status || "active"}</td>
            <td className="p-2 border">
              {new Date(u.createdAt).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;

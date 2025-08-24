// src/components/AdminUsers.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const filteredUsers =
    roleFilter === "all"
      ? users
      : users.filter((u) => u.role === roleFilter);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">👥 Manage Users</h2>

      <div className="mb-4 flex gap-4">
        <label>Role Filter:</label>
        <select
          className="border p-2 rounded"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="customer">Customer</option>
          <option value="farmer">Farmer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="p-4 bg-white border rounded shadow-sm flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-500">Role: {user.role}</p>
              <p className="text-sm text-gray-400">Phone: {user.phone || "-"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

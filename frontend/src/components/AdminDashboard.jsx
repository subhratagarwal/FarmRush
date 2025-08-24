import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({ totalOrders: 0, totalEarnings: 0 });
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const orderRes = await axios.get("http://localhost:5000/api/admin/orders");
      const userRes = await axios.get("http://localhost:5000/api/admin/users");

      setOrders(orderRes.data);
      setUsers(userRes.data);

      const totalEarnings = orderRes.data.reduce(
        (sum, o) => sum + (o.brokerageFarmer || 0),
        0
      );

      setStats({
        totalOrders: orderRes.data.length,
        totalEarnings,
      });
    } catch (err) {
      console.error("Admin data fetch error:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "accepted":
        return "bg-blue-100 text-blue-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  const filteredOrders =
    filterStatus === "All"
      ? orders
      : orders.filter((o) => o.status === filterStatus.toLowerCase());

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-indigo-700">🛠️ Admin Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4">
          <h4 className="font-semibold text-gray-600">Total Users</h4>
          <p className="text-2xl text-indigo-700">{users.length}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h4 className="font-semibold text-gray-600">Total Orders</h4>
          <p className="text-2xl text-green-700">{stats.totalOrders}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h4 className="font-semibold text-gray-600">Total Earnings</h4>
          <p className="text-2xl text-emerald-700">₹{stats.totalEarnings}</p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="mt-6 flex gap-3">
        {["All", "Pending", "Accepted", "Delivered", "Cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-3 py-1 rounded-full border ${
              filterStatus === s ? "bg-indigo-600 text-white" : "bg-white text-gray-700"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">📦 Orders ({filterStatus})</h3>
        <div className="space-y-2 max-h-[400px] overflow-auto">
          {filteredOrders.map((o) => (
            <div
              key={o.id}
              className="border p-4 rounded bg-white shadow-sm space-y-1"
            >
              <div className="flex justify-between items-center">
                <p className="font-bold">{o.productName}</p>
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(o.status)}`}>
                  {o.status.toUpperCase()}
                </span>
              </div>
              <p>
                Farmer: <span className="text-gray-700">{o.farmer?.name}</span>
              </p>
              <p>
                Customer: <span className="text-gray-700">{o.customer?.name}</span>
              </p>
              <p>Brokerage: ₹{o.brokerageFarmer}</p>
              <p className="text-sm text-gray-500">ETA: {o.eta || "-"} min</p>
              <p className="text-xs text-gray-400">Ordered At: {formatDate(o.createdAt)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Users Section */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">👥 Users</h3>
        <div className="space-y-2 max-h-[400px] overflow-auto">
          {users.map((u) => (
            <div key={u.id} className="border p-3 rounded bg-white shadow-sm">
              <p className="font-semibold">
                {u.name} <span className="text-sm text-gray-500">({u.role})</span>
              </p>
              <p>Email: {u.email}</p>
              <p>Phone: {u.phone || "-"}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// src/components/AdminOrders.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching admin orders:", err);
    }
  };

  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">📦 Manage All Orders</h2>

      <div className="mb-4 flex gap-4">
        <label>Status Filter:</label>
        <select
          className="border p-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto">
        {filteredOrders.map((order) => (
          <div key={order.id} className="p-4 bg-white border rounded shadow-sm flex justify-between items-center">
            <div>
              <p className="font-bold">{order.productName}</p>
              <p>Status: <span className="text-blue-600">{order.status}</span></p>
              <p>Customer: {order.customer?.name || "N/A"}</p>
              <p>Farmer: {order.farmer?.name || "N/A"}</p>
              <p>ETA: {order.eta || "-"} min</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">₹ {order.totalAmount}</p>
              <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

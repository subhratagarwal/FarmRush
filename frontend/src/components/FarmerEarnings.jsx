// src/components/FarmerEarnings.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function FarmerEarnings() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    accepted: 0,
    declined: 0,
    earnings: 0,
    avgETA: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const farmerId = user?.id;

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/farmer?farmerId=${farmerId}`
      );
      const data = res.data;
      setOrders(data);

      let accepted = 0,
        declined = 0,
        earnings = 0,
        etaSum = 0,
        etaCount = 0;

      data.forEach((o) => {
        if (o.status === "Accepted") {
          accepted++;
          earnings += o.brokerageFarmer || 0;
          if (o.eta) {
            etaSum += parseInt(o.eta);
            etaCount++;
          }
        } else if (o.status === "Declined") {
          declined++;
        }
      });

      setStats({
        total: data.length,
        accepted,
        declined,
        earnings,
        avgETA: etaCount ? Math.round(etaSum / etaCount) : 0,
      });
    } catch (err) {
      console.error("Error loading earnings:", err);
    }
  };

  const downloadInvoice = (order) => {
    const invoiceContent = `
      Invoice - Order ID: ${order.id}
      Product: ${order.productName}
      Status: ${order.status}
      Customer: ${order.customerName || "N/A"}
      Quantity: ${order.quantity || 1}
      Price: ₹${order.price}
      Brokerage: ₹${order.brokerageFarmer}
      ETA: ${order.eta} min
    `;

    const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = `invoice_order_${order.id}.txt`;
    link.href = url;
    link.click();
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h2 className="text-3xl font-bold text-green-800">📊 Farmer Earnings Dashboard</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded p-4">
          <h4 className="font-semibold text-gray-600">Total Orders</h4>
          <p className="text-2xl text-green-700">{stats.total}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h4 className="font-semibold text-gray-600">Accepted Orders</h4>
          <p className="text-2xl text-green-700">{stats.accepted}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h4 className="font-semibold text-gray-600">Declined Orders</h4>
          <p className="text-2xl text-red-600">{stats.declined}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h4 className="font-semibold text-gray-600">Total Earnings</h4>
          <p className="text-2xl text-emerald-700">₹{stats.earnings}</p>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h4 className="font-semibold text-gray-600">Avg. ETA</h4>
          <p className="text-2xl text-blue-700">{stats.avgETA} min</p>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-3">📦 Recent Orders Summary</h3>
        <div className="space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded shadow flex flex-col sm:flex-row justify-between items-start sm:items-center"
            >
              <div>
                <p className="font-semibold text-lg">{order.productName}</p>
                <p>Status:{" "}
                  <span className={order.status === "Accepted" ? "text-green-700" : "text-red-600"}>
                    {order.status}
                  </span>
                </p>
                <p>Price: ₹{order.price}</p>
                <p>Brokerage Earned: ₹{order.brokerageFarmer}</p>
                {order.eta && <p>ETA: {order.eta} min</p>}
              </div>
              <button
                className="mt-3 sm:mt-0 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
                onClick={() => downloadInvoice(order)}
              >
                Download Invoice
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

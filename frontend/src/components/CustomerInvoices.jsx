// src/components/CustomerInvoices.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function CustomerInvoices() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const customerId = user?.id;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/customer?customerId=${customerId}`
      );
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching invoices:", err);
    }
  };

  const downloadInvoice = (order) => {
    const invoiceContent = `
      Order ID: ${order.id}
      Product: ${order.productName}
      Price: ₹${order.price}
      Quantity: ${order.quantity || 1}
      Total: ₹${order.price * (order.quantity || 1)}
      Farmer: ${order.farmer?.name || "-"}
      Farmer Phone: ${order.farmer?.phone || "-"}
      Farmer Address: ${order.farmer?.address || "-"}
      Status: ${order.status}
      ETA: ${order.eta || "-"} min
      Delivery Status: ${order.deliveryStatus || "-"}
    `;
    const blob = new Blob([invoiceContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `invoice-${order.id}.txt`;
    link.click();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-green-700">🧾 Your Invoices</h2>

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border p-4 rounded-md shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <h4 className="text-lg font-semibold">{order.productName}</h4>
                <p>Price: ₹{order.price}</p>
                <p>Status: <span className={order.status === "Accepted" ? "text-green-700" : "text-red-600"}>{order.status}</span></p>
                <p>Delivery: {order.deliveryStatus || "Pending"} | ETA: {order.eta || "-"} min</p>
                <p>Farmer: {order.farmer?.name || "N/A"}</p>
              </div>
              <button
                onClick={() => downloadInvoice(order)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Download Invoice
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

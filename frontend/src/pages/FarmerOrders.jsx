// src/pages/FarmerOrders.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const farmerId = localStorage.getItem("id");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/farmer", {
        params: { farmerId },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch farmer orders", err);
    }
  };

  const updateOrder = async (id, updateFields) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, updateFields);
      fetchOrders();
    } catch (err) {
      console.error("Failed to update order", err);
    }
  };

  const handleSetETA = (id) => {
    const eta = prompt("Enter ETA in minutes (e.g. 30):");
    if (eta) {
      const deliveryTime = new Date(Date.now() + parseInt(eta) * 60000);
      updateOrder(id, {
        deliveryStatus: "Out for Delivery",
        deliveryTime,
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Incoming Orders</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow-sm space-y-2 bg-white"
            >
              <div className="flex justify-between">
                <h3 className="font-semibold text-lg">{order.productName}</h3>
                <img
                  src={`http://localhost:5000/uploads/${order.productImage}`}
                  alt={order.productName}
                  className="w-16 h-16 object-cover rounded"
                />
              </div>
              <p>Quantity: {order.quantity}</p>
              <p>Total: ₹{order.totalPrice}</p>
              <p>Status: <span className="font-medium">{order.status}</span></p>
              <p>Delivery: {order.deliveryStatus || "Pending"}</p>
              {order.deliveryTime && (
                <p>ETA: {new Date(order.deliveryTime).toLocaleString()}</p>
              )}
              <p>To: {order.userAddress} | 📞 {order.userContact}</p>

              {order.status === "Pending" && (
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => updateOrder(order.id, { status: "Accepted", deliveryStatus: "Processing" })}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateOrder(order.id, { status: "Declined", deliveryStatus: "Cancelled" })}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </div>
              )}

              {order.status === "Accepted" && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  <button
                    onClick={() => updateOrder(order.id, { deliveryStatus: "Dispatched" })}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Mark Dispatched
                  </button>
                  <button
                    onClick={() => handleSetETA(order.id)}
                    className="bg-purple-600 text-white px-3 py-1 rounded"
                  >
                    Set ETA
                  </button>
                  <button
                    onClick={() =>
                      updateOrder(order.id, { deliveryStatus: "Delivered", status: "Delivered" })
                    }
                    className="bg-green-800 text-white px-3 py-1 rounded"
                  >
                    Mark Delivered
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

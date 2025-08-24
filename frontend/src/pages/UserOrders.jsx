// src/pages/UserOrders.jsx
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.id) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/orders/customer?userId=${user.id}`);
      setOrders(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-green-700">🛒 Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders placed yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded p-4 shadow-sm flex justify-between items-start bg-white"
            >
              <div>
                <p className="font-semibold text-lg">🧄 {order.productName}</p>
                <p>Qty: {order.quantity} kg</p>
                <p>Total: ₹{order.totalPrice}</p>
                <p>Brokerage: ₹{order.brokerage?.toFixed(2)}</p>
                <p>Status: <span className="font-bold text-blue-700">{order.status}</span></p>
                <p>Delivery: <span className="font-semibold text-purple-700">{order.deliveryStatus}</span></p>
                {order.deliveryTime && (
                  <p className="text-sm text-gray-500">
                    Delivered at: {new Date(order.deliveryTime).toLocaleString()}
                  </p>
                )}

                <button
                  onClick={() => navigate(`/track/${order.id}`)}
                  className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                >
                  🚚 Track Order
                </button>

                <a
                  href={`http://localhost:5000/api/orders/${order.id}/invoice`}
                  className="mt-2 ml-2 inline-block bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  🧾 Download Invoice
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

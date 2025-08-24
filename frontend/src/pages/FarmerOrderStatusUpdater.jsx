import { useEffect, useState } from "react";
import axios from "axios";

export default function FarmerOrderStatusUpdater({ orderId }) {
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
      setOrder(res.data);
      setStatus(res.data.status || "Pending");
    };

    fetchOrder();
  }, [orderId]);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, {
        status,
        deliveryTime,
      });
      alert("Order status updated!");
    } catch (err) {
      alert("Failed to update order");
      console.error(err);
    }
  };

  if (!order) return <p>Loading...</p>;

  return (
    <div className="p-4 bg-white rounded shadow max-w-lg mx-auto mt-6">
      <h3 className="text-xl font-semibold mb-3">📦 Update Order Status</h3>

      <label className="block mb-2 font-medium">Status:</label>
      <select
        className="border rounded p-2 w-full mb-4"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>Pending</option>
        <option>Accepted</option>
        <option>Packed</option>
        <option>Out for Delivery</option>
        <option>Delivered</option>
      </select>

      <label className="block mb-2 font-medium">Delivery ETA (Optional):</label>
      <input
        type="datetime-local"
        value={deliveryTime}
        onChange={(e) => setDeliveryTime(e.target.value)}
        className="border p-2 w-full mb-4"
      />

      <button
        onClick={handleUpdate}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        ✅ Update Status
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BillSummary() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        alert("Failed to load bill summary");
      }
    };
    fetchOrder();
  }, [id]);

  if (!order) return <p className="p-4">Loading...</p>;

  const total = order.totalPrice || 0;
  const brokerage = order.brokerage || total * 0.05;
  const finalAmount = total;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-lg border">
      <h2 className="text-2xl font-bold text-green-700 mb-4">🧾 Order Bill Summary</h2>

      <div className="flex items-center space-x-4 mb-4">
        <img
          src={order.productImage}
          alt={order.productName}
          className="w-24 h-24 object-cover rounded"
        />
        <div>
          <p className="text-lg font-semibold">{order.productName}</p>
          <p className="text-gray-600">Qty: {order.quantity} kg</p>
          <p className="text-gray-600">Price: ₹{total.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-2 text-gray-800">
        <p><strong>Status:</strong> {order.status}</p>
        {order.deliveryStatus && (
          <p><strong>Delivery:</strong> {order.deliveryStatus}</p>
        )}
        {order.deliveryTime && (
          <p>
            <strong>Estimated Arrival:</strong>{" "}
            {new Date(order.deliveryTime).toLocaleString()}
          </p>
        )}

        <hr className="my-3" />

        <div>
          <h3 className="font-semibold text-green-600">Customer Details</h3>
          <p>{order.customerName || "N/A"} | 📞 {order.customerPhone || "N/A"}</p>
          <p className="text-sm text-gray-700">{order.customerAddress || "N/A"}</p>
        </div>

        <div>
          <h3 className="font-semibold text-green-600 mt-2">Farmer Details</h3>
          <p>{order.farmerName || "N/A"} | 📞 {order.farmerPhone || "N/A"}</p>
          <p className="text-sm text-gray-700">{order.farmerAddress || "N/A"}</p>
        </div>
      </div>

      <div className="border-t mt-6 pt-4 text-md font-semibold text-gray-800">
        <p>Brokerage (5%): ₹{brokerage.toFixed(2)}</p>
        <p className="text-lg text-green-700 mt-1">Total Payable: ₹{finalAmount.toFixed(2)}</p>
      </div>

      <div className="mt-6 text-center">
        <a
          href={`http://localhost:5000/api/orders/${id}/invoice`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          📥 Download Invoice
        </a>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function LiveTrack() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Error fetching order:", err);
      }
    };

    fetchOrder(); // initial fetch
    const interval = setInterval(fetchOrder, 5000); // poll every 5s

    return () => clearInterval(interval); // cleanup
  }, [orderId]);

  if (!order) return <div className="p-4 text-lg font-medium">Loading tracking info...</div>;

  const steps = ["Pending", "Accepted", "Packed", "Out for Delivery", "Delivered"];
  const currentStepIndex = steps.indexOf(order.status);

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">🧭 Live Order Tracking</h2>

      <div className="mb-4">
        <p><span className="font-semibold">Product:</span> {order.productName}</p>
        <p><span className="font-semibold">Quantity:</span> {order.quantity} kg</p>
        <p><span className="font-semibold">Current Status:</span> <span className="text-blue-600">{order.status}</span></p>
      </div>

      <div className="mt-6 space-y-4">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`h-5 w-5 rounded-full ${
                index <= currentStepIndex ? "bg-green-500" : "bg-gray-300"
              }`}
            ></div>
            <p
              className={`ml-3 ${
                index <= currentStepIndex
                  ? "text-green-700 font-semibold"
                  : "text-gray-500"
              }`}
            >
              {step}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

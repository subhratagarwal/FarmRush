import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderSummary() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/orders/customer").then(res => setOrders(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Orders</h2>
      {orders.map(o => (
        <div key={o.id} className="border p-4 rounded mb-3">
          <p>📦 {o.productName} ({o.quantity} kg)</p>
          <p>💰 Total: ₹{o.totalPrice}</p>
          <p>Brokerage (Farmer): ₹{o.brokerageFarmer}</p>
          <p>Brokerage (Customer): ₹{o.brokerageCustomer}</p>
          <p>Status: {o.status}</p>
        </div>
      ))}
    </div>
  );
}

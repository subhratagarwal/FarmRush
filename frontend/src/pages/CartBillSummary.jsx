import { useEffect, useState } from "react";
import axios from "axios";

export default function BillSummary() {
  const [cart, setCart] = useState([]);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(stored);
  }, []);

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const brokerage = totalPrice * 0.05; // 5% brokerage
  const finalAmount = totalPrice + brokerage;

  const placeOrder = async () => {
    setPlacing(true);
    const userId = localStorage.getItem("userId");
    try {
      for (const item of cart) {
        await axios.post("http://localhost:5000/api/orders", {
                productId: item.id,
                userId,
                farmerId: item.farmerId,
                quantity: item.qty,
                totalPrice: item.price * item.qty,
                productName: item.name,
                brokerage: item.price * item.qty * 0.05,  // ✅ 5% of subtotal
                status: "Pending",
              });
      }
      alert("✅ Order placed! Farmer(s) will be notified.");
      localStorage.removeItem("cart");
      window.location.replace("/orders");


    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order.");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold">🧾 Bill Summary</h2>
      {cart.length === 0 ? (
        <p>No items in cart.</p>
      ) : (
        <>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Item</th>
                <th className="border p-2">Qty (kg)</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((c) => (
                <tr key={c.id}>
                  <td className="border p-2">{c.name}</td>
                  <td className="border p-2">{c.qty}</td>
                  <td className="border p-2">₹{c.price}</td>
                  <td className="border p-2">₹{c.price * c.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-right mt-4 space-y-1">
            <p>Total: ₹{totalPrice}</p>
            <p>Brokerage (5%): ₹{brokerage.toFixed(2)}</p>
            <p className="font-bold">Final Amount: ₹{finalAmount.toFixed(2)}</p>
          </div>

          <button
            disabled={placing}
            onClick={placeOrder}
            className="bg-green-700 text-white px-4 py-2 rounded mt-4"
          >
            {placing ? "Placing Order..." : "Place Order"}
          </button>
        </>
      )}
    </div>
  );
}

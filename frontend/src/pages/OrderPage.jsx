import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function OrderPage() {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);

  const handleOrder = async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return alert("Please login first!");

  try {
    const productRes = await axios.get(`http://localhost:5000/api/products/${id}`);
    const product = productRes.data;

    const total = quantity * product.price;
    const brokerage = total * 0.05;

    await axios.post("http://localhost:5000/api/orders", {
      productId: product.id,
      productName: product.name,
      userId: user.id,
      farmerId: product.farmerId,
      quantity,
      totalPrice: total,
      brokerage
    });

    alert(`✅ Order placed! Total: ₹${total} (incl. brokerage ₹${brokerage})`);
  } catch (err) {
    console.error(err);
    alert("❌ Order failed");
  }
};


  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">📦 Place Order</h2>
      <input
        type="number"
        className="border p-2 rounded w-full mb-4"
        placeholder="Quantity (kg)"
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={handleOrder} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
        Confirm Order
      </button>
    </div>
  );
}

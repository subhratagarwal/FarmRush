import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CustomerCart() {
  const [cartItems, setCartItems] = useState([]);
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user") || "{}");
    if (!u?.id) {
      alert("❌ Please login to view cart");
      return navigate("/login");
    }
    setUser(u);
    fetchCart(u.id);
  }, []);

  const fetchCart = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/cart/${userId}`);
      setCartItems(res.data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const handleQtyChange = async (itemId, newQty) => {
    try {
      if (newQty < 1) return;
      await axios.put(`http://localhost:5000/api/cart/${itemId}`, { quantity: newQty });
      fetchCart(user.id);
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cart/${itemId}`);
      fetchCart(user.id);
    } catch (err) {
      console.error(err);
    }
  };

  const placeOrder = async () => {
    try {
      await axios.post("http://localhost:5000/api/orders/checkout", {
        customerId: user.id,
      });
      alert("✅ Order placed successfully!");
      fetchCart(user.id); // refresh cart
      navigate("/orders");
    } catch (err) {
      console.error("Checkout error:", err);
      alert("❌ Failed to place order");
    }
  };

  const total = cartItems.reduce((sum, item) => sum + item.quantity * item.Product.price, 0);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🛒 Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          {cartItems.map((item) => (
            <div key={item.id} className="border p-4 rounded mb-3 shadow-sm">
              <h3 className="text-lg font-semibold">{item.Product.name}</h3>
              <p>Price: ₹{item.Product.price}/kg</p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                  className="bg-gray-300 px-2 py-1 rounded"
                >
                  −
                </button>
                <span>{item.quantity} kg</span>
                <button
                  onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                  className="bg-gray-300 px-2 py-1 rounded"
                >
                  +
                </button>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 text-red-600"
                >
                  ❌ Remove
                </button>
              </div>
              <p className="mt-2 font-bold">
                Subtotal: ₹{item.quantity * item.Product.price}
              </p>
            </div>
          ))}
          <h3 className="text-xl font-bold mt-6">Total: ₹{total}</h3>
          <button
            onClick={placeOrder}
            className="bg-green-600 text-white px-6 py-2 rounded mt-4"
          >
            ✅ Place Order
          </button>
        </>
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import axios from "axios";

export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await axios.get("/api/wishlist");
      setWishlistItems(response.data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`/api/wishlist/${productId}`);
      fetchWishlist();
    } catch (err) {
      console.error("Error removing item from wishlist:", err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Your Wishlist</h2>
      {wishlistItems.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {wishlistItems.map((item) => (
            <div key={item.id} className="border p-4 rounded shadow">
             <img
                    src={
                        item.Product.image.startsWith("http")
                        ? item.Product.image
                        : `http://localhost:5000/uploads/${item.Product.image}`
                    }
                    alt={item.Product.name}
                    className="w-full h-48 object-cover mb-2"
              />


              <h3 className="font-semibold">{item.Product.name}</h3>
              <p>Price: ₹{item.Product.price}</p>
              <button
                onClick={() => handleRemove(item.Product.id)}
                className="mt-2 bg-red-500 text-white px-4 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

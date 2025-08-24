import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">🌾 All Products</h2>

      <div className="space-y-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded p-4 shadow-sm bg-white">
            <h4 className="text-lg font-semibold">{product.name}</h4>
            <p className="text-sm text-gray-600">Price: ₹{product.price}</p>
            <p className="text-sm text-gray-600">Category: {product.category}</p>
            <p className="text-sm text-gray-500">Farmer ID: {product.farmerId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// src/pages/Products.jsx
import { useEffect, useState } from "react";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then(setProducts);
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOrder === "lowToHigh") return a.price - b.price;
    if (sortOrder === "highToLow") return b.price - a.price;
    return 0;
  });

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-green-900 mb-6">🛍️ Available Products</h2>

      {/* Sorting Dropdown */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Sort by Price:</label>
        <select
          className="border px-3 py-1 rounded"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="lowToHigh">⬇️ Low to High</option>
          <option value="highToLow">⬆️ High to Low</option>
        </select>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {sortedProducts.map((p) => (
          <div key={p.id} className="bg-white p-4 rounded-lg shadow">
            <img
              src={
                p.image?.startsWith("http")
                  ? p.image
                  : `http://localhost:5000/uploads/${p.image}`
              }
              alt={p.name}
              className="w-full h-40 object-cover rounded mb-3"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/200x150?text=No+Image";
              }}
            />
            <h3 className="text-xl font-semibold">{p.name}</h3>
            <p className="text-gray-700">Price: ₹{p.price} / {p.unit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

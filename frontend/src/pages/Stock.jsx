import { useState, useEffect } from "react";
import axios from "axios";

export default function Stock() {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState(null);

  const farmerId = localStorage.getItem("userId"); // make sure you set this after login

  const loadProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/products");
      // Filter only this farmer’s products
      const myProducts = res.data.filter((p) => String(p.farmerId) === String(farmerId));
      setProducts(myProducts);
    } catch (err) {
      console.error("❌ Error loading products:", err);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const startEdit = (p) => {
    setEditId(p.id);
    setEditName(p.name);
    setEditPrice(p.price);
    setEditImage(null);
  };

  const handleEditSave = async () => {
    const formData = new FormData();
    formData.append("name", editName);
    formData.append("price", editPrice);
    if (editImage) {
      formData.append("image", editImage);
    }
    try {
      await axios.put(`http://localhost:5000/api/products/${editId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("✅ Product updated!");
      setEditId(null);
      loadProducts();
    } catch (err) {
      console.error("❌ Update failed:", err);
      alert("❌ Update failed!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("❌ Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      alert("✅ Product deleted!");
      loadProducts();
    } catch (err) {
      console.error("❌ Delete failed:", err);
      alert("❌ Delete failed!");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">📦 My Stock</h2>

      {products.length === 0 && <p>No products added yet!</p>}

      {products.map((p) => (
        <div
          key={p.id}
          className="border rounded-lg p-4 flex items-center justify-between shadow-sm"
        >
          {editId === p.id ? (
            <div className="flex-1 space-y-2">
              <input
                className="border p-1 rounded w-full"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <input
                className="border p-1 rounded w-full"
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
              />
              <input
                className="border p-1 rounded w-full"
                type="file"
                onChange={(e) => setEditImage(e.target.files[0])}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleEditSave}
                  className="bg-green-700 text-white px-3 py-1 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditId(null)}
                  className="bg-gray-500 text-white px-3 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{p.name}</h3>
                <p className="text-gray-600">₹ {p.price} per kg</p>
              </div>
              {p.image && (
                <img
                  src={`http://localhost:5000/uploads/${p.image}`}
                  alt={p.name}
                  className="w-20 h-20 object-cover rounded"
                />
              )}
              <div className="flex flex-col gap-1 ml-4">
                <button
                  onClick={() => startEdit(p)}
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

import { useState } from "react";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("kg");

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price, unit }),
    })
      .then((res) => res.json())
      .then(() => alert("✅ Product added successfully!"));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-4">Add a New Product</h2>
      <input
        className="w-full border p-2 rounded mb-4"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        className="w-full border p-2 rounded mb-4"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <select
        className="w-full border p-2 rounded mb-4"
        value={unit}
        onChange={(e) => setUnit(e.target.value)}
      >
        <option value="kg">per kg</option>
        <option value="piece">per piece</option>
      </select>
      <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        Add Product
      </button>
    </form>
  );
}

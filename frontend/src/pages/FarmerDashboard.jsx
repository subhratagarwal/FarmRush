import { useState, useEffect } from "react";
import axios from "axios";

export default function FarmerDashboard() {
  const farmerId = localStorage.getItem("userId");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [myProducts, setMyProducts] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
  });

  useEffect(() => {
    fetchOrders();
    fetchMyProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/orders/farmer/${farmerId}`);
      setOrders(res.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products/farmer/${farmerId}`);
      setMyProducts(res.data);
    } catch (err) {
      console.error("Error fetching my products:", err);
    }
  };

  const handleAccept = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/accept`);
      fetchOrders();
    } catch (err) {
      console.error("Error accepting order:", err);
    }
  };

  const handleDecline = async (orderId) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${orderId}/decline`);
      fetchOrders();
    } catch (err) {
      console.error("Error declining order:", err);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    try {
      const res = await axios.get(`https://api.unsplash.com/search/photos`, {
        params: { query: search, per_page: 6 },
        headers: {
          Authorization: "Client-ID VHH2CaOrqw0jLhINQEGwnrnF_lUhMubnfjuJ9ykca1c",
        },
      });
      setImages(res.data.results);
    } catch (err) {
      console.error("Error fetching images:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage || !formData.name || !formData.price) return;

    setUploading(true);
    try {
      const productData = {
        name: formData.name,
        price: formData.price,
        imageUrl: selectedImage.urls.small,

        farmerId,
      };

      await axios.post("http://localhost:5000/api/products", productData);
      setFormData({ name: "", price: "" });
      setSearch("");
      setImages([]);
      setSelectedImage(null);
      fetchMyProducts();
    } catch (err) {
      console.error("Error uploading product:", err);
    }
    setUploading(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-6">🌾 Farmer Dashboard</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow rounded mb-10">
        <h2 className="text-xl font-semibold mb-4">Upload Product</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Product Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Price (₹/kg)"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Search Image (e.g. Tomato)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="col-span-2 border p-2 rounded"
          />
          <button type="button" onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 rounded">
            Search Image
          </button>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            {images.map((img) => (
              <img
                key={img.id}
                src={img.urls.small}
                alt="img"
                className={`cursor-pointer border-4 ${selectedImage?.id === img.id ? "border-green-500" : "border-transparent"}`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        )}

        {selectedImage && (
          <div className="mt-4">
            <h4 className="font-semibold">Selected Image Preview:</h4>
            <img src={selectedImage.urls.small} alt="Selected" className="h-32 mt-2" />
          </div>
        )}

        <button
          type="submit"
          disabled={uploading}
          className="mt-6 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {uploading ? "Uploading..." : "Upload Product"}
        </button>
      </form>

      {/* My Products Section */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-green-800 mb-4">My Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {myProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <img
                  src={
                    product.image?.startsWith("http")
                      ? product.image
                      : `http://localhost:5000/uploads/${product.image}`
                  }
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                  <p className="text-green-700 font-bold text-md">₹{product.price}/kg</p>
                </div>
              </div>
            ))}
          </div>

      </div>

      {/* Orders Section */}
      <h2 className="text-2xl font-bold text-green-800 mb-4">Incoming Orders</h2>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border p-4 rounded shadow">
            <p>
              <strong>Product:</strong> {order.product?.name}
            </p>
            <p>
              <strong>Quantity:</strong> {order.quantity} kg
            </p>
            <p>
              <strong>Total Price:</strong> ₹{order.totalPrice}
            </p>
            <p>
              <strong>Brokerage:</strong> ₹{order.brokerage}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`font-bold ${order.status === "accepted" ? "text-green-600" : "text-red-500"}`}>
                {order.status}
              </span>
            </p>
            {order.status === "pending" && (
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleAccept(order.id)}
                  className="bg-green-500 text-white px-4 py-1 rounded"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleDecline(order.id)}
                  className="bg-red-500 text-white px-4 py-1 rounded"
                >
                  Decline
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isFarmer = user?.role === "farmer";
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const url = isFarmer
        ? `http://localhost:5000/api/orders/farmer?farmerId=${user.id}`
        : `http://localhost:5000/api/orders/customer?userId=${user.id}`;
      const res = await axios.get(url);
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to fetch orders");
    }
  };

  const updateOrder = async (id, updateFields) => {
    try {
      await axios.put(`http://localhost:5000/api/orders/${id}`, updateFields);
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update order");
    }
  };

  const cancelOrder = async (id) => {
    if (window.confirm("Cancel this order?")) {
      await updateOrder(id, { status: "Cancelled" });
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders
    .filter((o) =>
      o.productName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((o) =>
      statusFilter === "All" ? true : o.status === statusFilter
    )
    .sort((a, b) => {
      if (sortOption === "lowToHigh") return a.totalPrice - b.totalPrice;
      if (sortOption === "highToLow") return b.totalPrice - a.totalPrice;
      return 0;
    });

  const formatETA = (eta) => {
    const now = new Date();
    const delivery = new Date(eta);
    const diffMs = delivery - now;
    const diffMin = Math.ceil(diffMs / 60000);
    return diffMin > 0 ? `${diffMin} min left` : `Past ETA`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">
        {isFarmer ? "🧑‍🌾 Incoming Orders" : "📦 Your Orders"}
      </h2>

      {!isFarmer && (
        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-md w-60"
          />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="">Sort by</option>
            <option value="lowToHigh">Price: Low → High</option>
            <option value="highToLow">Price: High → Low</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border px-3 py-2 rounded-md"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        filteredOrders.map((o) => (
          <div
            key={o.id}
            className="border p-4 rounded-lg mb-4 shadow-md flex gap-4 items-start bg-white"
          >
            <img
              src={
                o.productImage?.startsWith("http")
                  ? o.productImage
                  : `http://localhost:5000/uploads/${o.productImage}`
              }
              alt={o.productName}
              className="w-24 h-24 object-cover rounded-md border"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold">{o.productName}</h3>
              <p>Quantity: {o.quantity} kg</p>
              <p>Total Price: ₹{o.totalPrice}</p>
              <p>Brokerage: ₹{o.brokerage}</p>
              <p>
                Status:{" "}
                <span
                  className={`font-semibold ${
                    o.status === "Accepted"
                      ? "text-green-600"
                      : o.status === "Rejected" || o.status === "Cancelled"
                      ? "text-red-600"
                      : o.status === "Delivered"
                      ? "text-blue-600"
                      : "text-gray-700"
                  }`}
                >
                  {o.status}
                </span>
              </p>
              {o.deliveryStatus && (
                <p>
                  Delivery Status:{" "}
                  <span className="text-purple-700 font-medium">
                    {o.deliveryStatus}
                  </span>
                </p>
              )}
              {o.deliveryTime && (
                <p className="text-sm text-gray-600">
                  ETA: {new Date(o.deliveryTime).toLocaleString()}{" "}
                  ({formatETA(o.deliveryTime)})
                </p>
              )}
              <p className="mt-2 font-semibold">
                {isFarmer ? "Customer" : "Farmer"} Contact Info:
              </p>
              <p>📞 {isFarmer ? o.customerPhone : o.farmerPhone}</p>
              <p>🏠 {isFarmer ? o.customerAddress : o.farmerAddress}</p>

              <button
                onClick={() => navigate(`/bill/${o.id}`)}
                className="bg-yellow-500 text-white px-3 py-1 rounded mt-2"
              >
                View Bill
              </button>

                {!isFarmer && o.status === "Delivered" && (
                    <a
                      href={`http://localhost:5000/api/orders/${o.id}/invoice`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block bg-green-600 text-white px-3 py-1 rounded mt-2"
                    >
                      📥 Download Invoice
                    </a>
                  )}

            </div>

            <div className="flex flex-col gap-2">
              {isFarmer && o.status === "Pending" && (
                <>
                  <button
                    onClick={() => updateOrder(o.id, { status: "Accepted" })}
                    className="bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateOrder(o.id, { status: "Rejected" })}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Reject
                  </button>
                </>
              )}

              {isFarmer && o.status === "Accepted" && (
                <>
                  <button
                    onClick={() =>
                      updateOrder(o.id, { deliveryStatus: "Dispatched" })
                    }
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    Mark as Dispatched
                  </button>

                  <button
                    onClick={() => {
                      const eta = prompt("Enter ETA in minutes (e.g. 30):");
                      if (eta) {
                        const deliveryTime = new Date(
                          Date.now() + parseInt(eta) * 60000
                        );
                        updateOrder(o.id, {
                          deliveryStatus: "Out for Delivery",
                          deliveryTime,
                        });
                      }
                    }}
                    className="bg-purple-600 text-white px-3 py-1 rounded"
                  >
                    Set ETA
                  </button>

                  <button
                    onClick={() =>
                      updateOrder(o.id, {
                        deliveryStatus: "Delivered",
                        status: "Delivered",
                      })
                    }
                    className="bg-green-800 text-white px-3 py-1 rounded"
                  >
                    Mark Delivered
                  </button>
                </>
              )}

              {!isFarmer && o.status === "Pending" && (
                <button
                  onClick={() => cancelOrder(o.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded mt-2"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

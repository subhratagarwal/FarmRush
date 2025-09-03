import { useEffect, useState } from "react";
import axios from "axios";
import ProductReviews from "../components/ProductReviews";

export default function Marketplace() {
  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [quantities, setQuantities] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products").then(async (res) => {
      setProducts(res.data);
      setFilteredProducts(res.data);

      // Fetch average ratings for all products
      const ratingData = {};
      for (const product of res.data) {
        try {
          const r = await axios.get(`/api/reviews/average/${product.id}`);
          ratingData[product.id] = r.data;
        } catch (err) {
          console.error("Rating fetch error:", err);
        }
      }
      setRatings(ratingData);
    });
  }, []);

  useEffect(() => {
    filterProducts();
  }, [search, sort, priceRange, products]);

  const filterProducts = () => {
    let filtered = [...products];
    if (search) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    filtered = filtered.filter(
      (p) => p.price >= priceRange.min && p.price <= priceRange.max
    );
    if (sort === "lowToHigh") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "highToLow") {
      filtered.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(filtered);
  };

  const handleQtyChange = (productId, qty) => {
    setQuantities((prev) => ({ ...prev, [productId]: qty }));
  };

  const addToCart = (product) => {
    const qty = Number(quantities[product.id]) || 0;
    if (qty <= 0) return;
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      const updatedCart = cart.map((item) =>
        item.id === product.id ? { ...item, qty: item.qty + qty } : item
      );
      setCart(updatedCart);
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          qty,
          image: product.image,
          farmerId: product.farmerId,
        },
      ]);
    }
    setQuantities((prev) => ({ ...prev, [product.id]: "" }));
  };

  const checkout = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "/bill";
  };

  const handleAddToWishlist = async (productId) => {
    try {
      await axios.post("http://localhost:5000/api/wishlist", { productId });
      alert("❤️ Added to wishlist");
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      alert("❌ Failed to add to wishlist");
    }
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold text-green-800">🌾 Marketplace</h2>

      {/* Search & Filter */}
      <div className="flex flex-wrap items-center gap-4">
        <input
          type="text"
          placeholder="🔍 Search by product name"
          className="border p-2 rounded w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Sort By Price</option>
          <option value="lowToHigh">Low → High</option>
          <option value="highToLow">High → Low</option>
        </select>
        <div className="flex items-center gap-2">
          <span>₹</span>
          <input
            type="number"
            className="border p-1 rounded w-20"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) =>
              setPriceRange({ ...priceRange, min: Number(e.target.value) })
            }
          />
          <span>to ₹</span>
          <input
            type="number"
            className="border p-1 rounded w-20"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) =>
              setPriceRange({ ...priceRange, max: Number(e.target.value) })
            }
          />
        </div>
      </div>

      {/* Product Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="border rounded-xl p-4 flex flex-col gap-3 shadow-md bg-white cursor-pointer transition hover:shadow-lg"
                onClick={() => openProductModal(product)}
              >
                <img
                  src={
                    product.image?.startsWith("http")
                      ? product.image
                      : `http://localhost:5000/uploads/${product.image}`
                  }
                  alt={product.name}
                  className="w-full h-56 object-cover rounded-xl border"
                />
                <div className="flex flex-col gap-1">
                  <h3 className="text-xl font-bold text-gray-800">{product.name}</h3>
                  {ratings[product.id] && (
                    <p className="text-sm text-yellow-600">
                      ⭐ {ratings[product.id].averageRating} (
                      {ratings[product.id].totalReviews} reviews)
                    </p>
                  )}
                  <p className="text-green-700 font-semibold text-lg">
                    ₹{product.price}/kg
                  </p>
                  {product.farmer && (
                    <div className="text-sm text-gray-600 space-y-1 mt-1">
                      <p>👨‍🌾 {product.farmer.name}</p>
                      <p>📍 {product.farmer.address}</p>
                      <p>📞 {product.farmer.phone}</p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={quantities[product.id] || ""}
                    onChange={(e) => handleQtyChange(product.id, e.target.value)}
                    className="border rounded p-1 w-20"
                  />
                  <button
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                  >
                    Add
                  </button>
                  <button
                    className="text-red-500 text-xl"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToWishlist(product.id);
                    }}
                  >
                    ❤️
                  </button>
                </div>
              </div>
            ))}
          </div>  {/* <-- Ensure this closes the grid container */}

          {/* Checkout Button */}
          {cart.length > 0 && (
            <div className="fixed bottom-6 right-6">
              <button
                onClick={checkout}
                className="bg-blue-700 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-800"
              >
                🧾 Proceed to Bill Summary ({cart.length})
              </button>
            </div>
          )}


      {/* Product Details Modal */}
      {isModalOpen && selectedProduct && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg p-6 w-full max-w-xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-3 text-xl"
              onClick={() => setIsModalOpen(false)}
            >
              ❌
            </button>
            <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
            <img
              src={
                selectedProduct.image.startsWith("http")
                  ? selectedProduct.image
                  : `http://localhost:5000/uploads/${selectedProduct.image}`
              }
              alt={selectedProduct.name}
              className="w-full h-60 object-cover rounded mb-4"
            />
            <p className="text-lg font-semibold mb-2">
              ₹{selectedProduct.price}/kg
            </p>
            <p className="mb-4">
              {selectedProduct.description || "No description available."}
            </p>
            <ProductReviews
              productId={selectedProduct.id}
              user={JSON.parse(localStorage.getItem("user"))}
            />
          </div>
        </div>
      )}
    </div>
  );
}

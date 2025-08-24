import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user"); // Optional: clear full user object
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-green-700 text-white">
      <div className="flex items-center space-x-4 font-bold text-lg">
        <Link to="/">Home</Link>

        {token && role === "customer" && (
            <>
              <Link to="/marketplace">Marketplace</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/bill">Bill Summary</Link>
              <Link to="/orders">My Orders</Link>
              <Link to="/wishlist">Wishlist</Link> {/* ✅ Added */}
            </>
          )}


        {token && role === "farmer" && (
          <>
            <Link to="/dashboard">Farmer Dashboard</Link>
            <Link to="/stock">Stock</Link>
            <Link to="/farmer-orders">Orders</Link> {/* ✅ For Farmer */}
          </>
        )}
      </div>

      <div className="space-x-4">
        {!token ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

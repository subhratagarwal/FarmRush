import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from "./pages/FarmerDashboard";
import Marketplace from "./pages/Marketplace";
import Cart from "./pages/CustomerCart";
import CartBillSummary from "./pages/CartBillSummary";
import Stock from "./pages/Stock";
import UserOrders from "./pages/UserOrders";
import FarmerOrders from "./pages/FarmerOrders";
import BillSummary from "./pages/BillSummary";
import AdminDashboard from "./components/AdminDashboard";
import AdminOrders from "./components/AdminOrders";
import AdminUsers from "./components/AdminUsers";
import FarmerEarnings from "./components/FarmerEarnings";
import Wishlist from "./pages/Wishlist";
import LiveTrack from './pages/LiveTrack';

// 🔒 Protected Route wrapper
function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");
  if (!token) return <Navigate to="/login" />;
  if (role && userRole !== role) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer */}
        <Route path="/marketplace" element={<ProtectedRoute role="customer"><Marketplace /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute role="customer"><Cart /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute role="customer"><UserOrders /></ProtectedRoute>} />
        <Route path="/bill/cart" element={<ProtectedRoute role="customer"><CartBillSummary /></ProtectedRoute>} />
        <Route path="/bill/:id" element={<ProtectedRoute role="customer"><BillSummary /></ProtectedRoute>} />
        <Route path="/wishlist" element={<ProtectedRoute role="customer"><Wishlist /></ProtectedRoute>} />
        <Route path="/track/:orderId" element={<ProtectedRoute role="customer"><LiveTrack /></ProtectedRoute>} />

        {/* Farmer */}
        <Route path="/dashboard" element={<ProtectedRoute role="farmer"><FarmerDashboard /></ProtectedRoute>} />
        <Route path="/stock" element={<ProtectedRoute role="farmer"><Stock /></ProtectedRoute>} />
        <Route path="/farmer-orders" element={<ProtectedRoute role="farmer"><FarmerOrders /></ProtectedRoute>} />
        <Route path="/farmer-earnings" element={<ProtectedRoute role="farmer"><FarmerEarnings /></ProtectedRoute>} />

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/orders" element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/earnings" element={<ProtectedRoute role="admin"><FarmerEarnings /></ProtectedRoute>} />
      </Routes>
    </>
  );
}

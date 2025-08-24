import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:5000/api/users/login", {
      email,
      password
    });

    // ✅ Save full user object
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.role);
    localStorage.setItem("userId", res.data.id);

    // ✅ NEW: Save full user object for future use (needed by UserOrders.jsx)
    localStorage.setItem("user", JSON.stringify(res.data));

    // ✅ Redirect based on role
    if (res.data.role === "farmer") {
      navigate("/dashboard");
    } else {
      navigate("/marketplace");
    }
  } catch (err) {
    console.error(err);
    alert("❌ Invalid credentials or server error!");
  }
};



  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="space-y-3">
        <input
          className="border p-2 rounded w-full"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          className="border p-2 rounded w-full"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="bg-green-700 text-white px-4 py-2 rounded w-full"
        >
          Login
        </button>
      </form>
    </div>
  );
}

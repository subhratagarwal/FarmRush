import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-green-200 to-green-300 flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-5xl font-extrabold text-green-900 mb-4">🌾 Farmer's Portal</h1>
      <p className="text-lg text-green-800 max-w-xl mb-8">
        Manage your products, set your prices, and connect with customers directly!
      </p>
      <div className="flex gap-4">
        <Link to="/marketplace" className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow-lg transition">Marketplace</Link>
        <Link to="/dashboard" className="px-6 py-3 bg-white border border-green-600 text-green-700 rounded-lg shadow-lg hover:bg-green-50 transition">Farmer Dashboard</Link>
      </div>
    </div>
  );
}

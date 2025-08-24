import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminEarnings() {
  const [earnings, setEarnings] = useState([]);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/earnings");
      setEarnings(res.data);
    } catch (err) {
      console.error("Error fetching earnings:", err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-green-700 mb-4">💰 Farmer Earnings</h2>
      <div className="space-y-3">
        {earnings.map((e, index) => (
          <div key={index} className="bg-white border p-4 rounded shadow-sm">
            <p className="font-semibold">{e.name}</p>
            <p className="text-sm text-gray-500">{e.email}</p>
            <p className="text-emerald-600 font-bold">₹ {e.totalEarnings.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

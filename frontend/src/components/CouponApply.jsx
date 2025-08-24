// src/components/CouponApply.jsx
import { useState } from "react";
import axios from "axios";

export default function CouponApply({ totalAmount, onDiscount }) {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const applyCoupon = async () => {
    try {
      const res = await axios.post("/api/coupons/validate", { code, totalAmount });
      onDiscount(res.data.discount, res.data.finalAmount);
      setMessage(`Coupon applied! You saved ₹${res.data.discount.toFixed(2)}`);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter coupon code"
      />
      <button onClick={applyCoupon}>Apply</button>
      <p>{message}</p>
    </div>
  );
}

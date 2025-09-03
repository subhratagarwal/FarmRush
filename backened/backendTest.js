// backendTest.js
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");

const BASE = "http://localhost:5000/api";

const testBackend = async () => {
  console.log("🚀 Starting backend tests...");

  try {
    // 1️⃣ Health Check
    const health = await axios.get(`${BASE}/health`);
    console.log("Health Check:", health.data);

    // 2️⃣ User Signup/Login
    const newUser = {
      name: "Test User",
      email: "testuser@example.com",
      password: "123456",
      role: "customer",
    };
    const signup = await axios.post(`${BASE}/auth/register`, newUser);
    console.log("User Signup:", signup.data);

    const login = await axios.post(`${BASE}/auth/login`, {
      email: newUser.email,
      password: newUser.password,
    });
    console.log("User Login:", login.data);

    const token = login.data.token;

    // 3️⃣ Fetch Products
    const products = await axios.get(`${BASE}/products`);
    console.log("Products:", products.data.length, "items");

    // 4️⃣ Add to Cart
    if (products.data.length > 0) {
      const cartRes = await axios.post(
        `${BASE}/cart`,
        { productId: products.data[0].id, quantity: 2 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Add to Cart:", cartRes.data);
    }

    // 5️⃣ Place Order
    const orderRes = await axios.post(
      `${BASE}/orders`,
      { paymentMode: "COD" },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log("Place Order:", orderRes.data);

    // 6️⃣ Live Tracking
    const orderId = orderRes.data.id;
    const live = await axios.get(`${BASE}/live-tracking/${orderId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Live Tracking:", live.data);

    // 7️⃣ Add Review (if products exist)
    if (products.data.length > 0) {
      const review = await axios.post(
        `${BASE}/reviews`,
        { productId: products.data[0].id, rating: 5, comment: "Excellent!" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Add Review:", review.data);
    }

    // 8️⃣ Fetch Wishlist
    const wishlist = await axios.get(`${BASE}/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Wishlist Items:", wishlist.data.length);

    // 9️⃣ Apply Coupon (if exists)
    const coupons = await axios.get(`${BASE}/coupons`);
    if (coupons.data.length > 0) {
      const couponApply = await axios.post(
        `${BASE}/orders/apply-coupon`,
        { couponCode: coupons.data[0].code, orderId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("Apply Coupon:", couponApply.data);
    }

    console.log("✅ All backend tests executed");
  } catch (err) {
    console.error("❌ Backend Test Error:", err.response?.data || err.message);
  }
};

testBackend();

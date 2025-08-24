// src/seed.js
const { sequelize, User, Product, Cart, Order, Wishlist } = require("./config/db");

async function seed() {
  try {
    await sequelize.sync({ force: true }); // ⚠️ Drops existing tables and recreates

    // ---- Users ----
    const farmers = await User.bulkCreate([
      { name: "Farmer A", email: "farmerA@example.com", password: "123456", role: "farmer", phone: "1111111111", address: "Farm Street 1" },
      { name: "Farmer B", email: "farmerB@example.com", password: "123456", role: "farmer", phone: "2222222222", address: "Farm Street 2" }
    ]);

    const customers = await User.bulkCreate([
      { name: "Customer X", email: "customerX@example.com", password: "123456", role: "customer", phone: "3333333333", address: "City 1" },
      { name: "Customer Y", email: "customerY@example.com", password: "123456", role: "customer", phone: "4444444444", address: "City 2" }
    ]);

    // ---- Products ----
    const products = await Product.bulkCreate([
      { name: "Mango", description: "Fresh Mangoes", price: 120, stock: 50, farmerId: farmers[0].id, image: "/uploads/mango.jpg" },
      { name: "Tomato", description: "Organic Tomato", price: 40, stock: 100, farmerId: farmers[0].id, image: "/uploads/tomato.jpg" },
      { name: "Potato", description: "Fresh Potato", price: 30, stock: 80, farmerId: farmers[1].id, image: "/uploads/potato.jpg" },
      { name: "Onion", description: "Red Onion", price: 50, stock: 60, farmerId: farmers[1].id, image: "/uploads/onion.jpg" }
    ]);

    // ---- Carts ----
    await Cart.bulkCreate([
      { customerId: customers[0].id, productId: products[0].id, quantity: 2 },
      { customerId: customers[0].id, productId: products[1].id, quantity: 3 },
      { customerId: customers[1].id, productId: products[2].id, quantity: 5 }
    ]);

    // ---- Wishlist ----
    await Wishlist.bulkCreate([
      { userId: customers[0].id, productId: products[2].id },
      { userId: customers[1].id, productId: products[0].id }
    ]);

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding error:", err);
    process.exit(1);
  }
}

seed();

// src/config/db.js
const { Sequelize, DataTypes, Model } = require("sequelize");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "farmerapp",
  process.env.DB_USER || "root",
  process.env.DB_PASSWORD || "",
  {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // flip to console.log for verbose SQL
  }
);

const db = {};

// 1) Load ONLY proper model factories
const modelsDir = path.join(__dirname, "../models");
const isModelFile = (file) => {
  // accept PascalCase/Literal model files, reject helper/indices
  if (!file.endsWith(".js")) return false;
  const base = file.toLowerCase();
  // skip any index-like files and known non-model scripts
  if (base === "index.js" || base.startsWith("index")) return false;
  // optionally skip files you know aren’t models
  // e.g., if you ever put migrations/helpers in this folder
  return true;
};

fs.readdirSync(modelsDir)
  .filter(isModelFile)
  .forEach((file) => {
    const full = path.join(modelsDir, file);
    const mod = require(full);

    if (typeof mod !== "function") {
      console.warn(`⚠️  Skipped non-model file: ${file} (exports is not a function)`);
      return;
    }

    const model = mod(sequelize, DataTypes);

    // sanity check: must be a Sequelize Model subclass
    if (!(model && model.prototype instanceof Model)) {
      console.warn(`⚠️  Skipped ${file}: returned value is not a Sequelize Model`);
      return;
    }

    // Use model.name ("Cart", "Product", etc.) as key
    db[model.name] = model;
  });

// 2) Wire associations (only if the model defined an associate())
Object.keys(db).forEach((modelName) => {
  const model = db[modelName];
  if (model && typeof model.associate === "function") {
    model.associate(db);
  }
});

// 3) Attach sequelize + Sequelize to the export
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// 4) Eagerly test the DB connection (nice UX)
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected successfully.");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

module.exports = db;

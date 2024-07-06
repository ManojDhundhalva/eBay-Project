const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// Import Routes
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const profileRoutes = require("./routes/profile");
const bankDetailsRoutes = require("./routes/bankDetails");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const wishListRoutes = require("./routes/wishList");
const orderRoutes = require("./routes/order");
const inventoryRoutes = require("./routes/inventory");
const shipperRoutes = require("./routes/shipper");
const categoryRoutes = require("./routes/category");
const databaseRoutes = require("./routes/database");
const verifyEmail = require("./routes/verifyEmail");
const { verifyTokenAndAuthorizationUser } = require("./middlewares/verifyUser");

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "authorization"],
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.use("/login", loginRoutes);
app.use("/register", registerRoutes);
app.use("/profile", profileRoutes);
app.use("/bank-details", bankDetailsRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/wish-list", wishListRoutes);
app.use("/order", orderRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/shipper", shipperRoutes);
app.use("/category", categoryRoutes);
app.use("/database", databaseRoutes);
app.use("/verify-email", verifyEmail);

app.get("/getTomTomApiKey", verifyTokenAndAuthorizationUser, (req, res) => {
  res.status(200).json({
    message: "API key sent successfully!",
    apiKey: process.env.TOMTOM_API_KEY,
  });
});

// Start Server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

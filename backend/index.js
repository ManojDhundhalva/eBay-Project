const express = require("express");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const profileRoutes = require("./routes/profile");
const bankDetailsRoutes = require("./routes/bankDetails");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const wishListRoutes = require("./routes/wishList");
const { verifyTokenAndAuthorizationUser } = require("./middlewares/verifyUser");
const orderRoutes = require("./routes/order");
const inventoryRoutes = require("./routes/inventory");
const shipperRoutes = require("./routes/shipper");
const categoryRoutes = require("./routes/category");
const databaseRoutes = require("./routes/database");
const verifyEmail = require("./routes/verifyEmail");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, resp) => {
  resp.send("hello");
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

app.get(
  "/api/v1/getTomTomApiKey",
  verifyTokenAndAuthorizationUser,
  (req, res) => {
    return res.status(200).json({
      message: "Api key sent successfully!",
      apiKey: process.env.TOMTOM_API_KEY,
    });
  }
);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

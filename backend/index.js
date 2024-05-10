const express = require("express");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const profileRoutes = require("./routes/profile");
const bankDetailsRoutes = require("./routes/bankDetails");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const wishListRoutes = require("./routes/wishList");
const { verifyTokenAndAuthorizationUser } = require("./middlewares/verifyUser");
// const orderRoutes = require("./routes/order");
// const sellerRoutes = require("./routes/seller");
// const inventoryRoutes = require("./routes/inventory");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());

// app.get("/", (req, resp) => {
//   resp.send("hello");
// });

app.use("/api/v1/login", loginRoutes);
app.use("/api/v1/register", registerRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/bank-details", bankDetailsRoutes);
app.use("/api/v1/product", productRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wish-list", wishListRoutes);
// app.use("/api/v1/order", orderRoutes);
// app.use("/api/v1/seller", sellerRoutes);
// app.use("/api/v1/inventory", inventoryRoutes);

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

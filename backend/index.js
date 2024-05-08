const express = require("express");
const loginRoutes = require("./routes/login");
const registerRoutes = require("./routes/register");
const profileRoutes = require("./routes/profile");
const bankDetailsRoutes = require("./routes/bankDetails");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart");
const wishListRoutes = require("./routes/wishList");
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

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const squareRouter = require("./routes/square");

dotenv.config();
const port = process.env.PORT || 5000;

// Middleware để parse form data (phải đặt trước app.use router)
app.use(express.urlencoded({ extended: true }));

// Set EJS as templating engine
app.set("view engine", "ejs");

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Mongoose connected successfully!");
  })
  .catch((err) => {
    console.error("Mongoose connection error:", err);
  });

// Sử dụng router
app.use("/", squareRouter);

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
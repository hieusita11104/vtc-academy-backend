const express = require("express");
const { Sequelize } = require("sequelize");
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Kết nối Sequelize
const sequelize = new Sequelize("ecommerce", "root", "", {
  host: "127.0.0.1",
  dialect: "mysql",
  port: 3306,
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Router
const router = require("./routes/productRouter.js");
const categoryRouter = require("./routes/categoryRouter.js");
app.use("/api/products", router);
app.use("/api/categories", categoryRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
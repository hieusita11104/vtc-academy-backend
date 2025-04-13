const express = require("express");
const app = express();
const port = 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// router
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

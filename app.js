const express = require('express');
const app = express();
const ejs = require('ejs');
const port = 8000;

app.set('view engine', 'ejs');
app.set('views', './view');

// Cấu hình thư mục tĩnh
app.use(express.static('public'));

app.get("/", (req, res) => {
    res.render("index");
  });

// Route cho trang giỏ hàng
app.get("/shopping-cart", (req, res) => {
  res.render("shoppingCart");
});


app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`);
});



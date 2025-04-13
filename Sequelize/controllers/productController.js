const db = require("../models"); 
// Create main product
const Product = db.products;
const Category = db.category;

// main work
// 1. create product

const addProduct = async (req, res) => {
  let info = {
    id: req.body.id,
    name: req.body.name,
    imagePath: req.body.imagePath,
    oldPrice: req.body.oldPrice,
    price: req.body.price,
    summary: req.body.summary,
    description: req.body.description,
    specification: req.body.specification,
    stars: req.body.stars,
    quantity: req.body.quantity,
  };

  const product = await Product.create(info);
  res.status(200).json({
    message: "Product added successfully",
    product,
  });
};

// 2. get all products

const getAllProducts = async (req, res) => {
  let product = await Product.findAll({});
  res.status(200).json({
    message: "Products fetched successfully",
    product,
  });
};

// 3. get product by id

const getOneProducts = async (req, res) => {
  let id = req.params.id;
  let product = await Product.findOne({ where: { id: id } });
  res.status(200).json({
    message: "Products fetched id successfully",
    product,
  });
};

// 4. update product

const updateProducts = async (req, res) => {
  let id = req.params.id;
  let product = await Product.update(req.body, { where: { id: id } });
  res.status(200).json({
    message: "Product updated successfully",
    product,
  });
};

// 5. Delete product

const deleteProducts = async (req, res) => {
  let id = req.params.id;

  await Product.destroy({ where: { id: id } });

  res.status(200).json({
    message: "Product deleted successfully",
  });
};

// 6. publish product

const publishProducts = async (req, res) => {
  const product = await Product.findAll({
    where: { published: true },
  });

  res.status(200).json({
    message: "Product deleted successfully",
  });
};

module.exports = {
  addProduct,
  getAllProducts,
  getOneProducts,
  updateProducts,
  deleteProducts,
  publishProducts,
};

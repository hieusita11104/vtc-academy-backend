const productController = require("../controllers/productController.js");

const router = require("express").Router();

router.post("/add", productController.addProduct);

router.get("/all", productController.getAllProducts);

router.get("/:id", productController.getOneProducts);

router.put("/:id", productController.updateProducts);

router.delete("/delete/:id", productController.deleteProducts);

router.get("/published", productController.publishProducts);

module.exports = router;

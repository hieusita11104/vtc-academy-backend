const categoryController = require("../controllers/categoryController.js");

const router = require("express").Router();

router.post("/add", categoryController.addCategory);

router.get("/all", categoryController.getAllCategory);

router.get("/:id", categoryController.getOneCategory);

router.put("/:id", categoryController.updateCategory);

router.delete("/delete/:id", categoryController.deleteCategory);

router.get("/published", categoryController.publishCategory);

module.exports = router;

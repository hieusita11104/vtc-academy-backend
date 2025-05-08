const express = require("express");
const router = express.Router();
const squareController = require("../controllers/squareController");

router.get("/", squareController.getSquares);
router.post("/", squareController.getSquares);

module.exports = router;
const Square = require('../models/square');

exports.getSquares = (req, res) => {
  // Kiểm tra nếu req.body tồn tại
  if (!req.body || typeof req.body !== 'object') {
    return res.render('index', { area: null });
  }

  const { width, height } = req.body;

  // Kiểm tra nếu width hoặc height không hợp lệ
  if (!width || !height) {
    return res.render('index', { area: null });
  }

  const square = new Square(Number(width), Number(height));
  const area = square.getArea();

  res.render('index', { area });
};
const db = require("../models");

// create main category
const Category = db.category;

// main work
// 1. create category

const addCategory = async (req, res) => {
    let info = {
        id: req.body.id,
        name: req.body.name,
        imagePath: req.body.imagePath,
    };

    const category = await Category.create(info);

    res.status(200).json({
        message: "Category added successfully",
        category,
    });
};


// 2. get all category


const getAllCategory = async (req, res) => {
  let category = await Category.findAll({});
  res.status(200).json({
    message: "Categories fetched successfully",
    category,
  });
};

// 3. get category by id

const getOneCategory = async (req, res) => {
  let id = req.params.id;
  let category = await Category.findOne({ where: { id: id } });
  res.status(200).json({
    message: "Categories fetched id successfully",
    category,
  });
};
    

// 4. update category

const updateCategory = async (req, res) => {
  let id = req.params.id;
  let category = await Category.update(req.body, { where: { id: id } });
  res.status(200).json({
    message: "Category updated successfully",
    category,
  });
};

// 5. Delete category

const deleteCategory = async (req, res) => {
  let id = req.params.id;

  await Category.destroy({ where: { id: id } });

  res.status(200).json({
    message: "category deleted successfully",
  });
};

// 6. publish category

const publishCategory = async (req, res) => {
  const category = await Category.findAll({
    where: { published: true },
  });

  res.status(200).json({
    message: "category deleted successfully",
  });
};


module.exports = {
  addCategory,
  getAllCategory,
  getOneCategory,
  updateCategory,
  deleteCategory,
  publishCategory,
};
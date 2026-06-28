const {
  createCategory,
  listCategories,
} = require("../services/categoryService");

async function create(req, res) {
  try {
    const category = await createCategory(req.body);

    return res.status(201).json({
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function list(req, res) {
  try {
    const categories = await listCategories();

    return res.status(200).json({
      categories,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  create,
  list,
};

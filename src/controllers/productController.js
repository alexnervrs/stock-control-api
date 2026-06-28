const {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../services/productService");

async function create(req, res) {
  try {
    const product = await createProduct(req.body);

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function list(req, res) {
  try {
    const products = await listProducts();

    return res.status(200).json({
      products,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
}

async function show(req, res) {
  try {
    const product = await getProductById(req.params.id);

    return res.status(200).json({
      product,
    });
  } catch (error) {
    return res.status(404).json({
      message: error.message,
    });
  }
}

async function update(req, res) {
  try {
    const product = await updateProduct(req.params.id, req.body);

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function remove(req, res) {
  try {
    const result = await deleteProduct(req.params.id);

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

module.exports = {
  create,
  list,
  show,
  update,
  remove,
};
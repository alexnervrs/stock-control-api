const {
  createSupplier,
  listSuppliers,
} = require("../services/supplierService");

async function create(req, res) {
  try {
    const supplier = await createSupplier(req.body);

    return res.status(201).json({
      message: "Supplier created successfully",
      supplier,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

async function list(req, res) {
  try {
    const suppliers = await listSuppliers();

    return res.status(200).json({
      suppliers,
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
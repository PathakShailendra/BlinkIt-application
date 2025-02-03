const express = require("express");
const router = express.Router();
const upload = require("../config/multer_config");
const { productModel, validateProduct } = require("../models/product");
const { categoryModel, validateCategory } = require("../models/category");
const { validateAdmin } = require("../middlewares/admin");

router.get("/", async (req, res) => {
  const products = await productModel.find();
  res.send(products);
});

router.get("/delete/:id", validateAdmin, async function (req, res) {
  if (req.user.admin) {
    let prods = await productModel.findOneAndDelete({ _id: req.params.id });
    return res.redirect("/admin/products");
  }
  res.send("you are not allowed to delete this product.");
});

router.post("/delete", validateAdmin, async function (req, res) {
  if (req.user.admin) {
    let prods = await productModel.findOneAndDelete({
      _id: req.body.product_id,
    });
    return res.redirect("back");
  }
  res.send("you are not allowed to delete this product.");
});

router.post("/", upload.single("image"), async function (req, res) {
  let { name, price, category, stock, description, image } = req.body;
  let { error } = validateProduct({
    name,
    price,
    category,
    stock,
    description,
    image,
  });
  if (error) return res.send(error.message);

  let isCategory = await categoryModel.findOne({ name: category });
  if (!isCategory) {
    await categoryModel.create({ name: category });
  }

  await productModel.create({
    name,
    price,
    category,
    image: req.file.buffer,
    description,
    stock,
  });

  res.redirect(`/admin/dashboard`);
});

module.exports = router;

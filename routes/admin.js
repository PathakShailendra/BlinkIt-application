const express = require("express");
const router = express.Router();
const { adminModel } = require("../models/admin");
const { productModel } = require("../models/product");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

if (
  typeof process.env.NODE_ENV !== undefined &&
  process.env.NODE_ENV === "DEVELOPMENT"
) {
  router.get("/create", async function (req, res) {
    try {
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash("admin", salt);

      let user = new adminModel({
        name: "Harsh",
        email: "admin@blink.com",
        password: hash,
        role: "admin",
      });

      await user.save();

      let token = jwt.sign(
        { email: "admin@blink.com", admin: true },
        process.env.JWT_KEY
      );
      res.cookie("token", token);
      res.send("admin created successfully");
    } catch (err) {
      res.send(err.message);
    }
  });
}

router.get("/login", function (req, res) {
  res.render("admin_login");
});

router.post("/login", async function (req, res) {
  let { email, password } = req.body;
  let admin = await adminModel.findOne({ email });
  if (!admin) return res.send("this admin is not available");

  let valid = await bcrypt.compare(password, admin.password);
  if (valid) {
    let token = jwt.sign(
      { email: "admin@blink.com", admin: true },
      process.env.JWT_KEY
    );
    res.cookie("token", token);
    res.redirect("/admin/dashboard");
  }
});

router.get("/dashboard", validateAdmin, async function (req, res) {
  let prodcount = await productModel.countDocuments();
  let categcount = await categoryModel.countDocuments();

  res.render("admin_dashboard", { prodcount, categcount });
});

module.exports = router;

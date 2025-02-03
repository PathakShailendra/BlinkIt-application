const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("you are on / route");
});

module.exports = router;

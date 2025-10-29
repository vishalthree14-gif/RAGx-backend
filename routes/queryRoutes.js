const express = require("express");
const router = express.Router();
const { queryText } = require("../controllers/queryController");

router.post("/query", queryText);

module.exports = router;

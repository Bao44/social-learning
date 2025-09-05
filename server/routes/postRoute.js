// server/routes/postRoute.js
const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");

router.post("/post", postController.createOrUpdatePost);

module.exports = router;

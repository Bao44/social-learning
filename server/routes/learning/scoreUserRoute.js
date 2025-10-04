const express = require("express");
const router = express.Router();
const scoreUserController = require("../../controllers/learning/scoreUserController");

// Route to get score user by user_id
router.get("/score/:user_id", scoreUserController.getScoreUserByUserId);

// Route to add practice score to user
router.post("/practiceScore", scoreUserController.addPracticeScore);

module.exports = router;

const express = require("express");
const router = express.Router();
const rankingController = require("../../controllers/learning/rankingController");

// Route to get leaderboard by type
router.get(
  "/leaderboard/:leaderboard_type",
  rankingController.getLeaderBoardByType
);
// Route to get user rank by userId
router.get("/userRank/:userId", rankingController.getUserRank);

module.exports = router;

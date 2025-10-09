const rankingService = require("../../services/learning/rankingService");

const rankingController = {
  // Get leaderboard by type
  getLeaderBoardByType: async (req, res) => {
    const { leaderboard_type } = req.params;
    if (!leaderboard_type) {
      return res
        .status(400)
        .json({ error: "Missing leaderboard_type parameter" });
    }
    try {
      const { data, error } = await rankingService.getLeaderBoardByType(
        leaderboard_type
      );
      if (error) {
        return res.status(500).json({ error: "Error fetching leaderboard" });
      }
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error in getLeaderBoardByType:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  // Get user rank by userId
  getUserRank: async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
      return res.status(400).json({ error: "Missing userId parameter" });
    }
    try {
      const { data, error } = await rankingService.getUserRank(userId);
      if (error) {
        return res.status(500).json({ error: "Error fetching user rank" });
      }
      return res.status(200).json({ success: true, data });
    } catch (error) {
      console.error("Error in getUserRank:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = rankingController;

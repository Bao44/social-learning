const learningService = require("../../services/learning/listeningService");

const listeningController = {
    // Get listening exercise by id
    async getListeningExerciseById(req, res) {
        const { id } = req.params;
        try {
            const data = await learningService.getListeningExerciseById(id);
            res.json(data);
        } catch (error) {
            console.error("Error fetching listening exercise by id:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }, 
};

module.exports = listeningController;
const express = require('express');
const router = express.Router();
const listeningController = require('../../controllers/learning/listeningController');

// Get listening exercise by id
router.get('/listening-exercises/:id', listeningController.getListeningExerciseById);

module.exports = router;
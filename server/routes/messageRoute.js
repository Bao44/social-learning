const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// Lưu tin nhắn mới
router.post('/save', messageController.saveMessage);

module.exports = router;
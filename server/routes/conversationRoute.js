const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/conversationController');

// Tạo cuộc trò chuyện mới (riêng tư hoặc nhóm)
router.post('/create', conversationController.createConversation);

// Lấy danh sách cuộc trò chuyện của người dùng
router.get('/user/:userId', conversationController.getUserConversations);

module.exports = router;
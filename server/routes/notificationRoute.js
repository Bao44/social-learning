const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

router.post("/", notificationController.createNotification);

router.put("/:notificationId/read", notificationController.markAsRead);

router.get("/:receiverId", notificationController.fetchNotifications);

router.put("/learning/:notificationLearningId/read", notificationController.markAsReadNotificationLearning);

router.get("/learning/:userId", notificationController.fetchNotificationsLearning);

module.exports = router;

function getTimeAgo(lastSeen) {
  const now = new Date();
  const diffInMs = now.getTime() - lastSeen.getTime();

  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return "Vừa mới hoạt động";
  if (diffInMinutes < 60) return `Đã hoạt động ${diffInMinutes} phút trước`;
  if (diffInHours < 24) return `Đã hoạt động ${diffInHours} giờ trước`;
  return `Đã hoạt động ${diffInDays} ngày trước`;
}

module.exports = { getTimeAgo };

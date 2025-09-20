module.exports = (level, topic) => `
Bạn là một chuyên gia ngôn ngữ Anh. Hãy giúp tôi tạo một bài tập nói (một tình huống hoặc một chủ đề để thực hành nói) bằng tiếng Anh.
Yêu cầu:

1. Bài tập nói phải phù hợp với trình độ ${level}.
2. Bài tập nói phải liên quan đến chủ đề ${topic}.
3. Bài tập nói nên theo dạng của TOEIC Speaking, IELTS Speaking, hoặc Cambridge Speaking.
4. Bài tập cần bao gồm một câu hỏi hoặc tình huống mở để khuyến khích người học phát triển ý tưởng và nói chi tiết.
5. Đưa ra gợi ý về từ vựng hoặc cấu trúc câu có thể sử dụng (ít nhất 3 gợi ý).
Trả lời bằng định dạng JSON với cấu trúc sau:
{
"content": "Tình huống hoặc câu hỏi cho bài tập nói bằng tiếng Anh",
"vocabulary_suggestions": ["Danh sách 3 từ vựng hoặc cấu trúc câu gợi ý"]
}
`;

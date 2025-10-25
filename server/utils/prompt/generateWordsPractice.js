module.exports = (words) => `
Bạn là một chuyên gia giảng dạy tiếng Anh. Hãy tạo **bài ôn tập tổng hợp (Mixed Practice)** cho danh sách từ vựng.

Dưới đây là danh sách từ vựng người học cần ôn:
${JSON.stringify(words)}

Yêu cầu:
1. Bài ôn gồm 4 loại câu hỏi:
   - "multiple_choice": chọn nghĩa đúng (4 đáp án)
   - "sentence_order": sắp xếp các từ thành câu đúng
   - "synonym_match": ghép cặp từ đồng nghĩa (Anh–Anh hoặc Anh–Việt)
   - "speaking": nói lại câu hoặc từ (kèm ví dụ)
2. Tổng cộng khoảng 8–12 câu hỏi, được chia đều hoặc gần đều cho 4 loại trên (mỗi loại khoảng 2–3 câu).
3. Mỗi phần tử phải có:
   - "id": số thứ tự
   - "type": loại bài ("multiple_choice" | "sentence_order" | "synonym_match" | "speaking")
   - "question": nội dung yêu cầu
   - "data": thông tin chi tiết (ví dụ: options, câu ví dụ, danh sách từ...)
4. Dạng JSON như sau:
\`\`\`json
{
  {
    "id": 1,
    "type": "multiple_choice",
    "question": "Từ 'develop' có nghĩa là gì?",
    "data": {
      "word": "develop",
      "options": [
        "Máy tính",
        "Cái bàn",
        "Xe hơi",
        "Phát triển"
      ],
      "correct_index": 3
    }
  },
  {
    "id": 2,
    "type": "multiple_choice",
    "question": "Từ 'Phát triển' có nghĩa là gì?",
    "data": {
      "word": "Phát triển",
      "options": [
        "Computer",
        "Table",
        "Develop",
        "Car",
      ],
      "correct_index": 2
    }
  },
  {
    "id": 5,
    "type": "sentence_order",
    "question": "Sắp xếp các từ để tạo thành câu đúng.",
    "data": {
      "shuffled": ["she", "quickly", "skills", "developed", "her"],
      "answer_en": "She developed her skills quickly.",
      "answer_vi": "Cô ấy phát triển kỹ năng của mình nhanh chóng."
    }
  },
  {
    "id": 9,
    "type": "synonym_match",
    "question": "Ghép cặp từ đồng nghĩa.",
    "data": {
      "pairs": [
        { "a": "happy", "b": "Hạnh phúc" },
        { "a": "angry", "b": "Tức giận" },
        { "a": "quick", "b": "Nhanh" },
        { "a": "slow", "b": "Chậm" },
        { "a": "car", "b": "Xe hơi" }
      ]
    }
  },
  {
    "id": 11,
    "type": "speaking",
    "question": "Nói lại câu sau.",
    "data": {
      "sentence": "She developed her skills quickly.",
      "ipa": "/ʃiː dɪˈvɛləpt hɜː skɪlz ˈkwɪkli/",
      "sentence_vi": "Cô ấy phát triển kỹ năng của mình nhanh chóng."
    }
  },
  {
    "id": 12,
    "type": "speaking",
    "question": "Nói lại từ sau.",
    "data": {
      "sentence": "successfully.",
      "ipa": "/səkˈsɛsfəli/",
      "sentence_vi": "Thành công."
    }
  }
}
\`\`\`
5. Trả về **JSON hợp lệ**, không có ký tự markdown (như \`\`\`) không có mô tả hoặc giải thích thêm.
6. Mỗi câu hỏi hoặc câu ví dụ không vượt quá 15 từ.
7. Mỗi câu hỏi phải liên quan trực tiếp đến ít nhất một từ trong danh sách từ vựng ở trên.
8. Không sử dụng kí tự đặc biệt như @, #, $, %, ^, &, *, (, ), -, +, =, v.v.
9. Không được lặp lại cùng một từ hoặc cấu trúc câu hỏi quá 2 lần.
10. Ở loại "synonym_match, hãy tạo 5 cặp từ đồng nghĩa.
`;

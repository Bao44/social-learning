/**
 * Hàm tính điểm cho bài tập
 * @param {number} maxScore - Điểm tối đa của bài tập
 * @param {boolean} result - Kết quả đúng/sai của bài tập
 * @param {number} submit_times - Số lần nộp bài
 * @returns {number} - Điểm số được tính toán
 * @param {boolean} alreadyCorrect - Bài đã đúng từ lần nộp trước
 */


function calculateScore(maxScore, result, submit_times, alreadyCorrect) {
    const EFFORT_PER_WRONG = 2;

    if (alreadyCorrect) {
        if (submit_times <= 5) {
            return EFFORT_PER_WRONG;
        }
        return 0;
    }

    // Xét xem result có đúng không
    if (result) {
        // Nếu đúng thì xét số lần submit
        if (submit_times === 0) {
            return maxScore * 3;
        } else if (submit_times === 1) {
            return maxScore * 2;
        } else {
            return maxScore;
        }
    } else {
        if (submit_times <= 5) {
            return EFFORT_PER_WRONG;
        } else {
            return 0;
        }
    }
}

module.exports = { calculateScore };
/**
 * Calculate score for writing snowflake exercise
 * @param {number} unit - Base score unit
 * @param {boolean} result - Whether the answer is correct
 * @param {number} submit_times - Number of submission attempts
 * @param {boolean} alreadyCorrect - Whether the exercise was already correct in previous attempts
 * @returns {number} - Calculated score
 */


function calculateWritingSnowflake(unit, result, submit_times, alreadyCorrect) {

    if (alreadyCorrect) {
        return 0;
    }

    if (result) {
        if (submit_times === 0) {
            return unit * 3;
        } else if (submit_times === 1) {
            return unit * 2;
        } else if (submit_times === 2) {
            return unit;
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}

module.exports = { calculateWritingSnowflake };
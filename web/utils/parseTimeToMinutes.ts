"use client";

const parseTimeToMinutes = (input: string) => {
    input = input.trim().toLowerCase()

    let minutes = 0

    const hourMatch = input.match(/(\d+(\.\d+)?)\s*giờ/)
    const minuteMatch = input.match(/(\d+)\s*phút/)

    if (hourMatch) {
        minutes += parseFloat(hourMatch[1]) * 60
    }

    if (minuteMatch) {
        minutes += parseInt(minuteMatch[1])
    }

    // fallback: nếu không tìm thấy "giờ" hay "phút", coi là phút
    if (!hourMatch && !minuteMatch) {
        const num = parseFloat(input)
        minutes = isNaN(num) ? 60 : num
    }

    return minutes
}

export default parseTimeToMinutes
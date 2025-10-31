import { motion, AnimatePresence } from "framer-motion"

type Week = {
    week: number
    focus: string
    lessons: Lesson[]
}

type Lesson = {
    type: string
    level: string
    topic: string
    description: string
    quantity: number
    completedCount: number
    typeParagraph?: string
    isCompleted?: boolean
}

const WeekCard = ({
    week,
    expandedWeeks,
    toggleWeek,
    iconMap,
}: {
    week: Week
    expandedWeeks: number[]
    toggleWeek: (week: number) => void
    iconMap: Record<string, any>
}) => {
    const isOpen = expandedWeeks.includes(week.week)

    // Hàm đổi màu theo phần trăm hoàn thành
    const getProgressColor = (percent: number) => {
        if (percent < 25) return "from-red-500 to-orange-400"
        if (percent < 50) return "from-orange-400 to-yellow-400"
        if (percent < 75) return "from-yellow-400 to-lime-400"
        return "from-lime-500 to-emerald-400"
    }

    return (
        <div
            className={`transition-transform duration-300 cursor-pointer ${isOpen ? "scale-[1.02]" : "hover:scale-[1.01]"}`}
            onClick={() => toggleWeek(week.week)}
        >
            <h2 className="font-semibold text-xl text-emerald-800 mb-3">
                Tuần {week.week}:{" "}
                <span className="text-sky-700">{week.focus}</span>
            </h2>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-4 max-w-sm"
                    >
                        {week.lessons.map((lesson, idx) => {
                            const progress =
                                lesson.quantity > 0
                                    ? (lesson.completedCount / lesson.quantity) * 100
                                    : 0
                            const percent = Math.round(progress)

                            return (
                                <motion.li
                                    key={idx}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white border border-emerald-100 rounded-2xl p-4 shadow-sm relative"
                                    aria-label={`Lesson ${lesson.topic}`}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            {iconMap[lesson.type]}
                                            <div>
                                                <p className="font-semibold text-gray-800">
                                                    {lesson.type}{" "}
                                                    <span className="text-sm text-gray-500">
                                                        ({lesson.level})
                                                    </span>
                                                </p>
                                                <p className="text-sm text-gray-700 mt-1 font-medium">
                                                    📘 {lesson.topic}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                                                🔢 {lesson.quantity} bài
                                            </div>
                                            <div className="mt-2 text-xs text-gray-500">
                                                <span className="font-medium">{lesson.completedCount}</span>/{lesson.quantity} hoàn thành
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                                        {lesson.description}
                                    </p>

                                    {/* Thanh tiến trình đổi màu mượt */}
                                    <div className="flex items-center gap-3 mt-3">
                                        <div className="flex-1 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${percent}%` }}
                                                transition={{ duration: 0.6 }}
                                                className={`h-2 bg-gradient-to-r ${getProgressColor(percent)} rounded-full`}
                                            />
                                        </div>
                                        <div className="w-12 text-right text-sm font-medium text-gray-700">
                                            {percent}%
                                        </div>
                                    </div>
                                </motion.li>
                            )
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}

export default WeekCard;
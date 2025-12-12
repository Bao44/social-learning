"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { motion } from "framer-motion"
import { createRoadMapForUser } from "@/app/apiClient/learning/roadmap/roadmap"
import useAuth from "@/hooks/useAuth"
import parseTimeToMinutes from "@/utils/parseTimeToMinutes"
import { useLanguage } from "@/components/contexts/LanguageContext"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface Props {
    open: boolean
    onClose: () => void
    onCreated: () => void
}

const skillsList = ["Writing", "Listening", "Speaking", "Vocabulary"]

const goalList_vi = [
    "Đọc hiểu tài liệu chuyên ngành",
    "Giao tiếp lưu loát trong công việc",
    "Viết email chuyên nghiệp",
    "Nghe hiểu hội thoại tự nhiên",
    "Thuyết trình bằng tiếng Anh",
    "Thi chứng chỉ (IELTS, TOEIC, ...)",
]

const goalList_en = [
    "Understand professional documents",
    "Communicate fluently at work",
    "Write professional emails",
    "Comprehend natural conversations",
    "Present in English",
    "Take certification exams (IELTS, TOEIC, ...)",
]

const fields_en = ["Business", "Academic", "Travel", "IT", "General"]
const fields_vi = ["Kinh doanh", "Học thuật", "Du lịch", "Công nghệ thông tin", "Tiếng Anh tổng quát"]

const studyTimeOptions_vi = [
    "15 phút/ngày",
    "30 phút/ngày",
    "1 giờ/ngày",
    "2 giờ/ngày",
    "Hơn 2 giờ/ngày",
]
const studyTimeOptions_en = [
    "15 minutes/day",
    "30 minutes/day",
    "1 hour/day",
    "2 hours/day",
    "More than 2 hours/day",
]

export default function CreatePathModal({ open, onClose, onCreated }: Props) {
    const { user } = useAuth()
    const { t, language } = useLanguage()
    const [step, setStep] = useState(1)
    const [pathName, setPathName] = useState("")
    const [skills, setSkills] = useState<string[]>([])
    const [goal, setGoal] = useState("")
    const [customGoal, setCustomGoal] = useState("")
    const [field, setField] = useState("")
    const [customField, setCustomField] = useState("")
    const [studyTime, setStudyTime] = useState("")
    const [customStudyTime, setCustomStudyTime] = useState("")
    const [loading, setLoading] = useState(false)

    const nextStep = () => setStep((s) => s + 1)
    const prevStep = () => setStep((s) => s - 1)

    const handleCreate = async () => {
        try {
            setLoading(true)

            const finalGoal = customGoal.trim() || goal
            const finalField = customField.trim() || field
            const finalStudyTime = customStudyTime.trim() || studyTime

            const minutesPerDay = parseTimeToMinutes(finalStudyTime)

            const inputUser = {
                userId: user!.id,
                pathName,
                targetSkills: skills,
                goal: finalGoal,
                field: finalField,
                studyPlan: {
                    minutesPerDay,
                    rawInput: finalStudyTime,
                },
            }

            await createRoadMapForUser(user!.id, inputUser)

            onCreated()
            onClose()
        } finally {
            setLoading(false)
        }
    }


    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg bg-linear-to-br from-white via-blue-50 to-indigo-100 rounded-2xl shadow-xl p-6">
                <DialogHeader className="text-center">
                    <DialogTitle className="text-2xl font-semibold text-indigo-700">
                        ✨ {t("learning.roadmap.createRoadmapTitle")}
                    </DialogTitle>
                    <p className="text-sm text-gray-500 mt-1">
                        {t("learning.roadmap.step")} {step}/5 — {t("learning.roadmap.personalizeYourLearningPath")}
                    </p>
                </DialogHeader>

                <motion.div
                    key={step}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 space-y-5"
                >
                    {/* Bước 1: Tên lộ trình */}
                    {step === 1 && (
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">
                                {t("learning.roadmap.pathNameTitle")}
                            </label>
                            <Input
                                className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                                placeholder={t("learning.roadmap.pathNamePlaceholder")}
                                value={pathName}
                                onChange={(e) => setPathName(e.target.value)}
                            />
                        </div>
                    )}

                    {/* Bước 2: Chọn kỹ năng */}
                    {step === 2 && (
                        <div>
                            <label className="block text-sm font-medium mb-3 text-gray-700">
                                {t("learning.roadmap.selectSkillsTitle")}
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {skillsList.map((skill) => (
                                    <motion.div
                                        key={skill}
                                        whileHover={{ scale: 1.05 }}
                                        className="flex items-center space-x-2 bg-white rounded-lg border border-indigo-100 hover:border-indigo-400 px-3 py-2 shadow-sm transition-all"
                                    >
                                        <Checkbox
                                            id={skill}
                                            checked={skills.includes(skill)}
                                            onCheckedChange={(checked) =>
                                                setSkills((prev) =>
                                                    checked ? [...prev, skill] : prev.filter((s) => s !== skill)
                                                )
                                            }
                                        />
                                        <label htmlFor={skill} className="text-gray-700 text-sm cursor-pointer">
                                            {skill}
                                        </label>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Bước 3: Mục tiêu */}
                    {step === 3 && (
                        <div>
                            <label className="block text-sm font-medium mb-3 text-gray-700">
                                {t("learning.roadmap.selectGoalTitle")}
                            </label>
                            <div className="flex flex-col gap-2">
                                {(language === "vi" ? goalList_vi : goalList_en).map((g) => (
                                    <Button
                                        key={g}
                                        variant={goal === g ? "default" : "outline"}
                                        className={`justify-start rounded-xl text-left ${goal === g
                                            ? "bg-indigo-600 text-white"
                                            : "border-indigo-200 text-indigo-700 hover:border-indigo-400"
                                            }`}
                                        onClick={() => {
                                            setGoal(g)
                                            setCustomGoal("")
                                        }}
                                    >
                                        {g}
                                    </Button>
                                ))}
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-600 mb-1">
                                    {t("learning.roadmap.orEnterCustomGoal")}
                                </label>
                                <Input
                                    placeholder={t("learning.roadmap.customGoalPlaceholder")}
                                    value={customGoal}
                                    onChange={(e) => {
                                        setCustomGoal(e.target.value)
                                        setGoal("")
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Bước 4: Lĩnh vực */}
                    {step === 4 && (
                        <div>
                            <label className="block text-sm font-medium mb-3 text-gray-700">
                                {t("learning.roadmap.selectFieldTitle")}
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {(language === "vi" ? fields_vi : fields_en).map((f) => (
                                    <Button
                                        key={f}
                                        variant={field === f ? "default" : "outline"}
                                        className={`rounded-xl px-4 py-2 ${field === f
                                            ? "bg-indigo-600 text-white"
                                            : "border-indigo-200 text-indigo-600 hover:border-indigo-400"
                                            }`}
                                        onClick={() => {
                                            setField(f)
                                            setCustomField("")
                                        }}
                                    >
                                        {f}
                                    </Button>
                                ))}
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-600 mb-1">
                                    {t("learning.roadmap.orEnterCustomField")}
                                </label>
                                <Input
                                    placeholder={t("learning.roadmap.customFieldPlaceholder")}
                                    value={customField}
                                    onChange={(e) => {
                                        setCustomField(e.target.value)
                                        setField("")
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Bước 5: Thời gian học mỗi ngày */}
                    {step === 5 && (
                        <div>
                            <label className="block text-sm font-medium mb-3 text-gray-700">
                                {t("learning.roadmap.selectStudyTimeTitle")}
                            </label>
                            <div className="flex flex-col gap-2">
                                {(language === "vi" ? studyTimeOptions_vi : studyTimeOptions_en).map((t) => (
                                    <Button
                                        key={t}
                                        variant={studyTime === t ? "default" : "outline"}
                                        className={`justify-start rounded-xl text-left ${studyTime === t
                                            ? "bg-indigo-600 text-white"
                                            : "border-indigo-200 text-indigo-700 hover:border-indigo-400"
                                            }`}
                                        onClick={() => {
                                            setStudyTime(t)
                                            setCustomStudyTime("")
                                        }}
                                    >
                                        {t}
                                    </Button>
                                ))}
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm text-gray-600 mb-1">
                                    {t("learning.roadmap.orEnterCustomStudyTime")}
                                </label>
                                <Input
                                    placeholder={t("learning.roadmap.customStudyTimePlaceholder")}
                                    value={customStudyTime}
                                    onChange={(e) => {
                                        setCustomStudyTime(e.target.value)
                                        setStudyTime("")
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Điều hướng */}
                <div className="flex justify-between mt-8">
                    {step > 1 && (
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            className="rounded-full border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> {t("learning.roadmap.back")}
                        </Button>
                    )}

                    {step < 5 ? (
                        <Button
                            onClick={nextStep}
                            disabled={
                                (step === 1 && !pathName) ||
                                (step === 2 && skills.length === 0)
                            }
                            className="ml-auto rounded-full bg-indigo-600 hover:bg-indigo-700 text-white px-5"
                        >
                            {t("learning.roadmap.next")} <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleCreate}
                            className="ml-auto rounded-full bg-green-600 hover:bg-green-700 text-white px-5"
                        >
                            {t("learning.roadmap.createPath")}
                        </Button>
                    )}
                </div>

                {loading && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-50 rounded-2xl">
                        <div className="animate-spin h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
                        <p className="mt-4 text-indigo-700 font-medium">{t("learning.roadmap.creatingPathPleaseWait")}</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

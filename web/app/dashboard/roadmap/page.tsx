"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle } from "lucide-react"
import CreatePathModal from "./components/CreatePathModal"
import { useLanguage } from "@/components/contexts/LanguageContext"
import { getRoadmapByUserId } from "@/app/apiClient/learning/roadmap/roadmap"
import useAuth from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import WeekTimeline from "./components/WeekTimeline"


export default function LearningPathPage() {
    const { user } = useAuth()
    const [paths, setPaths] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [openModal, setOpenModal] = useState(false)
    const { t } = useLanguage()
    const router = useRouter()

    console.log("🚀🚀🚀 Path:", paths)

    useEffect(() => {
        if (!user?.id) return

        const fetchData = async () => {
            setLoading(true)
            try {
                const res = await getRoadmapByUserId(user.id)
                setPaths(res ? [res] : [])
            } catch (error) {
                console.error("Error fetching learning paths:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [user?.id])

    const handleRouteClick = (pathId: string) => {
        router.push(`/dashboard/roadmap/${pathId}`)
    }

    return (
        <div className="flex-1 px-6 py-6">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col items-center justify-center text-center gap-2 my-6">
                    <h2 className="text-3xl font-semibold">{t("learning.roadmapTitle")}</h2>
                    <p className="text-lg tracking-widest text-gray-600">
                        {t("learning.roadmapDescription")}
                    </p>
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="flex items-center justify-center py-10 text-gray-500">
                        Đang tải lộ trình học...
                    </div>
                ) : paths.length === 0 ? (
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-10">
                        <p className="text-gray-500 mb-4">Bạn chưa có lộ trình học nào.</p>
                        <Button onClick={() => setOpenModal(true)}>
                            <PlusCircle className="mr-2 h-4 w-4" /> Tạo lộ trình mới
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {paths.map((path, index) => (
                            <Card
                                key={path?.id || index}
                                onClick={() => handleRouteClick(path.id)}
                                className="shadow-md hover:shadow-lg transition cursor-pointer relative"
                            >
                                {/* ✅ Dấu mộc tròn kiểu thật */}
                                {(path?.isCompleted || path?.currentweek >= path?.totalweeks) && (
                                    <div
                                        className="absolute top-4 right-8 w-32 h-32 flex items-center justify-center rounded-full text-green-700 font-extrabold uppercase text-[10px] tracking-wider select-none"
                                        style={{
                                            border: "3px solid #16a34a",
                                            boxShadow: "0 0 4px rgba(22,163,74,0.7), inset 0 0 8px rgba(22,163,74,0.4)",
                                            transform: "rotate(-15deg)",
                                            background: "radial-gradient(circle at center, rgba(255,255,255,0.6) 0%, transparent 70%)",
                                            fontFamily: "serif",
                                            animation: "stampIn 0.3s ease-out",
                                            position: "absolute",
                                        }}
                                    >
                                        <span
                                            style={{
                                                border: "2px solid #16a34a",
                                                borderRadius: "50%",
                                                position: "absolute",
                                                inset: "6px",
                                                opacity: 0.6,
                                            }}
                                        ></span>
                                        <span
                                            style={{
                                                textShadow: "0 0 1px rgba(0,0,0,0.2)",
                                                transform: "scale(1.1)",
                                            }}
                                            className="text-center text-lg"
                                        >
                                            ĐÃ HOÀN THÀNH
                                        </span>
                                    </div>
                                )}

                                <CardTitle
                                    className="ml-6 text-3xl font-extrabold uppercase tracking-wide bg-gradient-to-r from-green-500 via-emerald-600 to-green-700 bg-clip-text text-transparent font-[Poppins]">
                                    {path?.pathName || "Chưa có tên"}
                                </CardTitle>


                                <CardContent className="space-y-4 mt-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        <div className="flex flex-col border rounded-xl p-3 bg-green-50/50">
                                            <span className="text-gray-500 font-medium">🎯 Mục tiêu</span>
                                            <span className="text-gray-800 font-semibold">
                                                {path?.goal || "—"}
                                            </span>
                                        </div>

                                        <div className="flex flex-col border rounded-xl p-3 bg-green-50/50">
                                            <span className="text-gray-500 font-medium">📘 Lĩnh vực</span>
                                            <span className="text-gray-800 font-semibold">
                                                {path?.field || "—"}
                                            </span>
                                        </div>

                                        <div className="flex flex-col border rounded-xl p-3 bg-green-50/50 sm:col-span-2">
                                            <span className="text-gray-500 font-medium">💡 Kỹ năng chính</span>
                                            <span className="text-gray-800 font-semibold">
                                                {path?.targetSkills?.join(", ") || "—"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Timeline các tuần */}
                                    <div className="mt-6">
                                        <WeekTimeline
                                            totalWeeks={path?.totalWeeks || 12}
                                            currentWeek={path?.currentweek || 1}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                <CreatePathModal open={openModal} onClose={() => setOpenModal(false)} />
            </div>
        </div>
    )
}
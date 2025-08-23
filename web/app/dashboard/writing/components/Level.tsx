"use client"

import { Card } from "@/components/ui/card"
import * as Icons from "lucide-react"

const levels = [
    {
        id: 1,
        icon: {
            name: "Sprout",
            color: "green"
        },
        name: "Người mới bắt đầu",
        slug: "beginner",
        description: "Dành cho những người mới bắt đầu",
        time_advice: "15-30 phút mỗi ngày"
    },
    {
        id: 2,
        icon: {
            name: "BookOpen",
            color: "blue"
        },
        name: "Trung cấp",
        slug: "intermediate",
        description: "Dành cho những người đã có kinh nghiệm",
        time_advice: "30-60 phút mỗi ngày"
    },
    {
        id: 3,
        icon: {
            name: "GraduationCap",
            color: "purple"
        },
        name: "Nâng cao",
        slug: "advanced",
        description: "Dành cho những người muốn nâng cao kỹ năng",
        time_advice: "1-2 giờ mỗi ngày"
    }
]

interface LevelProps {
    selectedLevel: string;
    setSelectedLevel: (level: string) => void;
}

export function Level({ selectedLevel, setSelectedLevel }: LevelProps) {
    return (
        <div className="flex-1">
            <h2 className="text-xl font-semibold">Chọn mức năng lực</h2>
            <div className="grid grid-cols-3 gap-4 mt-4">
                {levels.map(level => {
                    const IconComponent = Icons[level.icon.name as keyof typeof Icons] as Icons.LucideIcon;
                    return (
                        <Card
                            onClick={() => setSelectedLevel(level.slug)}
                            key={level.id}
                            className={`
                                flex flex-row justify-between gap-4 px-4 
                                transition-all duration-300 
                                border-2 
                                ${selectedLevel === level.slug
                                    ? "shadow-lg -translate-y-1 border-black"
                                    : "hover:shadow-lg hover:-translate-y-1 hover:border-black"
                                }
                            `}
                        >
                            <div className="flex items-center justify-center bg-gray-200 rounded-full h-fit p-4">
                                {IconComponent && <IconComponent className={'h-6 w-6'} color={level.icon.color} />}
                            </div>

                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-semibold">{level.name}</h3>
                                <p className="text-md text-gray-500">{level.description}</p>
                                <p className="text-sm text-gray-500">{level.time_advice}</p>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

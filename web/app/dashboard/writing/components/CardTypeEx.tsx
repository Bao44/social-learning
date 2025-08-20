"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import * as Icons from "lucide-react"
import { useRouter } from "next/navigation"

const types = [
    {
        id: 1,
        title: "Luyện Viết Đoạn",
        slug: "writing-paragraph",
        description: "Phát triển kỹ năng viết đoạn văn mạch lạc và logic",
        icon: {
            name: "FileText",
            color: "purple",
        },
        features: [
            "Viết đoạn văn có cấu trúc rõ ràng",
            "Cải thiện khả năng liên kết ý tưởng",
            "Luyện tập viết theo chủ đề cụ thể",
            "Phù hợp cho người đã có nền tảng cơ bản",
        ],
    },
    {
        id: 2,
        title: "Luyện Viết Câu",
        slug: "writing-sentence",
        description: "Cải thiện khả năng viết câu hoàn chỉnh và chính xác",
        icon: {
            name: "PenTool",
            color: "blue",
        },
        features: [
            "Sửa lỗi ngữ pháp và từ vựng",
            "Cải thiện cấu trúc câu",
            "Luyện tập viết câu theo chủ đề",
            "Phù hợp cho người mới bắt đầu",
        ],
    }
]

export function CardTypeEx() {
    const router = useRouter();
    // Handle card click
    const handleCardClick = (slug: string) => {
        // Navigate to the appropriate writing practice page
        router.push(`/dashboard/writing/${slug}`);
    };

    return (
        <>
            {types.map((type) => {
                const IconComponent = Icons[type.icon.name as keyof typeof Icons] as Icons.LucideIcon;
                return (
                    <Card
                        key={type.id}
                        className={`group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50 flex flex-col justify-between`}>
                        <CardHeader className="text-center pb-4">
                            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                                {IconComponent && <IconComponent className='h-8 w-8' color={type.icon.color} />}
                            </div>
                            <CardTitle className="text-xl uppercase">{type.title}</CardTitle>
                            <CardDescription className="text-base">
                                {type.description}
                            </CardDescription>
                        </CardHeader>

                        <CardFooter className="flex flex-col">
                            <CardContent className="mb-4 px-0 w-full">
                                <ul className="list-disc pl-5 space-y-2">
                                    {type.features.map((feature, index) => (
                                        <li key={index}>{feature}</li>
                                    ))}
                                </ul>
                            </CardContent>
                            <Button
                                className="w-full group-hover:bg-primary/90 transition-colors hover:cursor-pointer uppercase"
                                onClick={() => handleCardClick(type.slug)}
                            >
                                Bắt đầu luyện tập
                            </Button>
                        </CardFooter>
                    </Card>
                )
            })}
        </>
    )
}

"use client"

import { Card } from "@/components/ui/card";
import * as Icons from "lucide-react"; // Import toàn bộ icon 1 lần

const topics = [
    { id: 1, icon: { name: "Newspaper", color: "blue" }, name: "Bài báo", slug: "article", description: "Nội dung về tin tức và tạp chí" },
    { id: 2, icon: { name: "Mail", color: "green" }, name: "Thư điện tử", slug: "email", description: "Nội dung về thư điện tử và giao tiếp trực tuyến" },
    { id: 3, icon: { name: "Podcast", color: "red" }, name: "Đời sống", slug: "lifestyle", description: "Nội dung về đời sống và xã hội" },
    { id: 4, icon: { name: "SwatchBook", color: "purple" }, name: "Truyện ngắn", slug: "short-stories", description: "Nội dung về truyện ngắn và văn học" },
    { id: 5, icon: { name: "BookMarked", color: "orange" }, name: "Tiểu luận", slug: "essays", description: "Nội dung về tiểu luận và nghiên cứu" },
];

type TopicProps = {
    selectedTopic: string;
    setSelectedTopic: (topic: string) => void;
};

export function Topic({ selectedTopic, setSelectedTopic }: TopicProps) {
    return (
        <div className="flex-1">
            <h2 className="text-xl font-semibold">Chọn chủ đề</h2>
            <div className="grid grid-cols-4 gap-4 mt-4">
                {topics.map(topic => {
                    // Lấy component icon theo tên string
                    const IconComponent = Icons[topic.icon.name as keyof typeof Icons] as Icons.LucideIcon;
                    return (
                        <Card
                            onClick={() => setSelectedTopic(topic.slug)}
                            key={topic.id}
                            className={`
                                flex flex-col justify-start items-center gap-4 px-4 
                                transition-all duration-300 border-2 
                                ${selectedTopic === topic.slug
                                    ? "shadow-lg -translate-y-1 border-black"
                                    : "hover:shadow-lg hover:-translate-y-1 hover:border-black"
                                }
                            `}
                        >
                            <div className="flex items-center justify-center bg-gray-200 rounded-full w-fit p-4">
                                {IconComponent && <IconComponent className="h-6 w-6" color={topic.icon.color} />}
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <h3 className="text-lg font-semibold">{topic.name}</h3>
                                <p className="text-md text-gray-500 text-center">{topic.description}</p>
                            </div>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}

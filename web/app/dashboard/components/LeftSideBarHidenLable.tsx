"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Compass, Heart, Home, MessageCircle, PenTool, PlusSquare, Search, TrendingUp, Trophy, User, Volume2 } from "lucide-react";
import { useRouter } from "next/navigation"

const mainNavItems = [
    { icon: Home, path: "/dashboard", label: "Trang chủ", active: true },
    { icon: Search, path: "/dashboard/search", label: "Tìm kiếm" },
    { icon: Compass, path: "/dashboard/explore", label: "Khám phá" },
    { icon: MessageCircle, path: "/dashboard/chat", label: "Tin nhắn", badge: 3 },
    { icon: Heart, path: "/dashboard/notifications", label: "Thông báo", badge: 5 },
    { icon: PlusSquare, path: "/dashboard/create", label: "Tạo" },
    { icon: User, path: "/dashboard/profile", label: "Trang cá nhân" },
];

const learningNavItems = [
    { icon: PenTool, path: "/dashboard/writing", label: "Luyện viết tiếng Anh", special: true },
    { icon: Volume2, path: "/dashboard/listening", label: "Luyện nghe tiếng Anh" },
    { icon: BookOpen, path: "/dashboard/vocabulary", label: "Từ vựng của bạn" },
    { icon: Trophy, path: "/dashboard/ranking", label: "Bảng xếp hạng" },
    { icon: TrendingUp, path: "/dashboard/progress", label: "Tiến trình của tôi" },
];

export function LeftSideBarHiddenLabel() {
    const router = useRouter();

    const handleMenuClick = (path: string) => {
        // Handle menu item click
        router.push(path);
    }

    return (
        <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="p-4 border-b border-gray-100 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <PenTool className="w-5 h-5 text-white" />
                </div>
            </div>

            {/* Main Navigation */}
            <div>
                <nav className="space-y-1">
                    {mainNavItems.map((item) => (
                        <Button
                            key={item.label}
                            variant="ghost"
                            className={`w-full justify-center h-14 px-3 hover:cursor-pointer ${item.active
                                ? "bg-gray-100 text-gray-900 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                            onClick={() => handleMenuClick(item.path)}
                        >
                            <item.icon size={48} />
                        </Button>
                    ))}
                </nav>
            </div>

            {/* Learning Navigation */}
            <div className="border-t border-gray-100">
                <nav className="space-y-1">
                    {learningNavItems.map((item) => (
                        <Button
                            key={item.label}
                            variant="ghost"
                            className={`w-full justify-center h-14 px-3 hover:cursor-pointer ${item.special
                                ? "bg-gray-100 text-gray-900 font-medium"
                                : "text-gray-700 hover:bg-gray-50"
                                }`}
                            onClick={() => handleMenuClick(item.path)}
                        >
                            <item.icon size={48} />
                        </Button>
                    ))}
                </nav>
            </div>
        </div>
    );
}

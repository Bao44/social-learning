"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, PenTool } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  return (
    <>
      {/* Logo */}
      <div className="absolute flex items-center px-4 py-6 ">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
          <PenTool className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl ml-2 font-bold text-gray-900">
          <Link href="/">SocialLearning</Link>
        </span>
      </div>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl">Chào mừng trở lại</CardTitle>
            <CardDescription>
              Đăng nhập để tiếp tục hành trình nào
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Nhập số điện thoại của bạn"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input
                id="password"
                type="password"
                placeholder="Nhập mật khẩu của bạn"
              />
            </div>
            <div className="flex items-center justify-between">
              <Link
                href="#"
                className="text-sm text-orange-600 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>
            <Button
              onClick={() => {
                router.push("/dashboard/user");
              }}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 cursor-pointer"
            >
              Đăng Nhập
            </Button>
            <div className="text-center text-sm">
              Bạn chưa có tài khoản?{" "}
              <Link
                href="/auth/register"
                className="text-orange-600 hover:underline"
              >
                Đăng ký
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

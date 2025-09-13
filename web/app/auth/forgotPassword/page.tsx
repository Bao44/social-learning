"use client";

import { sendResetOtp } from "@/app/api/auth/route";
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
import React, { useState } from "react";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await sendResetOtp({ email });
      if (res.message == "Email không tồn tại") {
        toast.warn("Email không tồn tại", { autoClose: 1000 });
      }
      if (res.success) {
        toast.success("OTP đã được gửi đến email của bạn.", {
          autoClose: 1000,
        });
        localStorage.setItem("email", JSON.stringify(email));
        router.push("/auth/forgotPassword/verify");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.", { autoClose: 1000 });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendOtp();
    }
  };
  return (
    <>
      {/* Logo */}
      <div className="absolute flex items-center px-4 py-6 ">
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
          <PenTool className="w-5 h-5 text-white" />
        </div>
        <span className="text-3xl ml-2 mt-1 font-bold text-gray-900">
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
            <CardTitle className="text-2xl">Quên mật khẩu</CardTitle>
            <CardDescription>
              Nhập email của bạn để nhận liên kết đặt lại mật khẩu
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="flex items-center justify-between">
              <Link
                href="/auth/login"
                className="text-sm text-orange-600 hover:underline"
              >
                Quay lại đăng nhập
              </Link>
            </div>
            <Button
              onClick={handleSendOtp}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 cursor-pointer rounded-full"
            >
              {loading ? "Đang gửi..." : " Gửi OTP đặt lại mật khẩu"}
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

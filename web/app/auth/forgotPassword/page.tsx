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
import type React from "react";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/contexts/LanguageContext";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSendOtp = async () => {
    setLoading(true);
    try {
      const res = await sendResetOtp({ email });
      if (res.message == "Email không tồn tại") {
        toast.warn(t("auth.forgotPass.emailNotFound"), { autoClose: 1000 });
      }
      if (res.success) {
        toast.success(t("auth.forgotPass.otpSent"), {
          autoClose: 1000,
        });
        localStorage.setItem("email", JSON.stringify(email));
        router.push("/auth/forgotPassword/verify");
      }
    } catch (error) {
      toast.error(t("auth.forgotPass.errorOccurred"), { autoClose: 1000 });
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
      <div
        className={`absolute flex items-center px-4 py-6 transition-all duration-700 z-10 ${
          isVisible
            ? "translate-x-0 opacity-100"
            : "-translate-x-full opacity-0"
        }`}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
          <PenTool className="w-5 h-5 text-white" />
        </div>
        <span className="text-3xl ml-2 mt-1 font-bold text-gray-900 hover:text-orange-600 transition-colors duration-300">
          <Link href="/">SocialLearning</Link>
        </span>
        <div className="ml-auto">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute -top-4 -right-4 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>

        <Card
          className={`w-full max-w-md backdrop-blur-sm bg-white/80 border-0 shadow-2xl transition-all duration-700 ${
            isVisible
              ? "scale-100 opacity-100 translate-y-0"
              : "scale-95 opacity-0 translate-y-8"
          } hover:shadow-3xl hover:scale-[1.02]`}
        >
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div
                className={`w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center transition-all duration-500 hover:rotate-12 hover:scale-110 ${
                  isVisible ? "animate-bounce" : ""
                }`}
              >
                <BookOpen className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle
              className={`text-2xl transition-all duration-700 delay-200 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {t("auth.forgotPass.title")}
            </CardTitle>
            <CardDescription
              className={`transition-all duration-700 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {t("auth.forgotPass.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`space-y-2 transition-all duration-700 delay-400 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <Label htmlFor="email" className="text-gray-700 font-medium">
                {t("auth.email")}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyDown}
                className="transition-all duration-300 focus:scale-[1.02] focus:shadow-lg hover:shadow-md border-gray-200 focus:border-orange-400"
              />
            </div>

            <div
              className={`flex items-center justify-between transition-all duration-700 delay-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <Link
                href="/auth/login"
                className="text-sm text-orange-600 hover:text-orange-700 hover:underline transition-all duration-300 hover:scale-105"
              >
                {t("auth.forgotPass.backToLogin")}
              </Link>
            </div>
            <Button
              onClick={handleSendOtp}
              disabled={loading}
              className={`w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 cursor-pointer rounded-full transition-all duration-700 delay-600 hover:scale-105 hover:shadow-xl active:scale-95 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              } ${loading ? "animate-pulse" : ""}`}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("auth.sending")}</span>
                </div>
              ) : (
                t("auth.forgotPass.sendResetOtp")
              )}
            </Button>
            <div
              className={`text-center text-sm transition-all duration-700 delay-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {t("auth.noAccount")}{" "}
              <Link
                href="/auth/register"
                className="text-orange-600 hover:text-orange-700 hover:underline transition-all duration-300 hover:scale-105 inline-block"
              >
                {t("auth.signUp")}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

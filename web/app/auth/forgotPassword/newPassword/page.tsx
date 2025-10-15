"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { forgotPassword } from "@/app/apiClient/auth/auth";
import { toast } from "react-toastify";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Eye, EyeOff, PenTool } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/contexts/LanguageContext";

export default function NewPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();
  const { t } = useLanguage();

  const passwordRegex = /^.{8,}$/;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleNewPassword = async () => {
    if (!passwordRegex.test(password)) {
      toast.warning(t("auth.passwordMinLength"), { autoClose: 1000 });
      return;
    }

    if (password !== confirmPassword) {
      toast.warning(t("auth.passwordMismatch"), { autoClose: 1000 });
      return;
    }

    setLoading(true);
    try {
      const sessionString = localStorage.getItem("resetSession");
      if (!sessionString) {
        throw new Error(t("auth.forgotPass.sessionMissing"));
      }

      const session = JSON.parse(sessionString);

      const res = await forgotPassword({
        session,
        newPassword: password,
      });

      if (!res.success) {
        throw new Error(res.message);
      }

      toast.success(t("auth.forgotPass.passwordChangeSuccess"), {
        autoClose: 1000,
      });
      localStorage.removeItem("resetSession");
      localStorage.removeItem("email");
      router.push("/auth/login");
    } catch (err: any) {
      console.error("Frontend - Error:", err);
      toast.error(err.message || t("auth.forgotPass.passwordChangeFailed"), {
        autoClose: 1000,
      });
    } finally {
      setLoading(false);
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
              {t("auth.forgotPass.newPasswordTitle")}
            </CardTitle>
            <CardDescription
              className={`transition-all duration-700 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {t("auth.forgotPass.newPasswordDescription")}
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
              <Label htmlFor="password" className="text-gray-700 font-medium">
                {t("auth.password")}
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("auth.createPasswordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg hover:shadow-md border-gray-200 focus:border-orange-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 cursor-pointer transition-all duration-300 hover:scale-110"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 transition-transform duration-300" />
                  ) : (
                    <Eye className="w-5 h-5 transition-transform duration-300" />
                  )}
                </button>
              </div>
            </div>

            <div
              className={`space-y-2 transition-all duration-700 delay-500 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <Label
                htmlFor="confirmPassword"
                className="text-gray-700 font-medium"
              >
                {t("auth.confirmPassword")}
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("auth.confirmPasswordPlaceholder")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pr-10 transition-all duration-300 focus:scale-[1.02] focus:shadow-lg hover:shadow-md border-gray-200 focus:border-orange-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-orange-600 cursor-pointer transition-all duration-300 hover:scale-110"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 transition-transform duration-300" />
                  ) : (
                    <Eye className="w-5 h-5 transition-transform duration-300" />
                  )}
                </button>
              </div>
            </div>

            <Button
              onClick={handleNewPassword}
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
                  <span>{t("auth.processing")}</span>
                </div>
              ) : (
                t("auth.forgotPass.changePassword")
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

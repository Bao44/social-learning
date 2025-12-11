"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { BookOpen, PenTool } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { verifyResetOtp } from "@/app/apiClient/auth/auth";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useLanguage } from "@/components/contexts/LanguageContext";

export default function VerifyPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [sentOtp, setSentOtp] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    setIsVisible(true);
    setSentOtp(true);
    setCountdown(60);
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (sentOtp && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sentOtp, countdown]);

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.warning(t("auth.enterOtp"), { autoClose: 1000 });
      return;
    }
    if (/\D/.test(otp)) {
      toast.warning(t("auth.otpDigitsOnly"), { autoClose: 1000 });
      return;
    }

    try {
      const email = JSON.parse(localStorage.getItem("email") || '""');
      setLoading(true);
      const res = await verifyResetOtp({ email, otp });
      if (!res.success) {
        toast.error(res.message || t("auth.otpVerificationFailed"), {
          autoClose: 1000,
        });
        return;
      }
      localStorage.setItem("resetSession", JSON.stringify(res.data.session));
      toast.success(t("auth.verificationSuccess"), { autoClose: 1000 });
      router.push("/auth/forgotPassword/newPassword");
    } catch (err: any) {
      toast.error(t("auth.otpVerificationFailed"), { autoClose: 1000 });
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
        <div className="w-8 h-8 bg-linear-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center hover:scale-110 transition-transform duration-300">
          <PenTool className="w-5 h-5 text-white" />
        </div>
        <span className="text-3xl ml-2 mt-1 font-bold text-gray-900 hover:text-orange-600 transition-colors duration-300">
          <Link href="/">SocialLearning</Link>
        </span>
        <div className="ml-auto">
          <LanguageSwitcher />
        </div>
      </div>

      <div className="min-h-screen bg-linear-to-br from-orange-50 to-pink-50 flex items-center justify-center p-4 relative overflow-hidden">
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
                className={`w-12 h-12 bg-linear-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center transition-all duration-500 hover:rotate-12 hover:scale-110 ${
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
              {t("auth.forgotPass.verifyTitle")}
            </CardTitle>
            <CardDescription
              className={`transition-all duration-700 delay-300 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              {t("auth.forgotPass.verifyDescription")}
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
              <Label
                htmlFor="otp"
                className="text-center block text-gray-700 font-medium"
              >
                {t("auth.enterOtpInstruction")}
              </Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  className="transition-all duration-300 hover:scale-105"
                >
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={0}
                      className="w-12 h-12 text-xl transition-all duration-300 hover:border-orange-400 focus:border-orange-500"
                    />
                    <InputOTPSlot
                      index={1}
                      className="w-12 h-12 text-xl transition-all duration-300 hover:border-orange-400 focus:border-orange-500"
                    />
                    <InputOTPSlot
                      index={2}
                      className="w-12 h-12 text-xl transition-all duration-300 hover:border-orange-400 focus:border-orange-500"
                    />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot
                      index={3}
                      className="w-12 h-12 text-xl transition-all duration-300 hover:border-orange-400 focus:border-orange-500"
                    />
                    <InputOTPSlot
                      index={4}
                      className="w-12 h-12 text-xl transition-all duration-300 hover:border-orange-400 focus:border-orange-500"
                    />
                    <InputOTPSlot
                      index={5}
                      className="w-12 h-12 text-xl transition-all duration-300 hover:border-orange-400 focus:border-orange-500"
                    />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>

            <Button
              disabled={loading}
              className={`w-full bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 cursor-pointer rounded-full transition-all duration-700 delay-500 hover:scale-105 hover:shadow-xl active:scale-95 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              } ${loading ? "animate-pulse" : ""}`}
              onClick={handleVerifyOtp}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("auth.verifying")}</span>
                </div>
              ) : (
                t("auth.verifyOtp")
              )}
            </Button>

            {countdown > 0 ? (
              <p
                className={`text-center text-sm text-gray-600 transition-all duration-700 delay-600 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                {t("auth.enterOtpWithin")}{" "}
                <span className="font-bold text-orange-600">{countdown}</span>{" "}
                {t("auth.seconds")}
              </p>
            ) : (
              <div
                className={`text-center transition-all duration-700 delay-600 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
              >
                <Button
                  disabled={loading}
                  variant="outline"
                  className="mt-2 cursor-pointer hover:scale-105 transition-all duration-300 bg-transparent"
                  onClick={() => router.push("/auth/login")}
                >
                  {loading ? t("auth.sending") : t("auth.backToLogin")}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

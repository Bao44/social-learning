"use client";

import { getSpeakingByTopicAndLevel } from "@/app/api/learning/speaking/route";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { JSX } from "react/jsx-runtime";

interface Lesson {
  id: number;
  content: string; // Giả định API trả về câu mẫu trong trường 'content'
  // Thêm các trường khác nếu cần
}

export default function SpeechPage() {
  const router = useRouter();
  const [currentSentence, setCurrentSentence] = useState<string>(""); // Câu mẫu hiện tại
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState<number>(0); // Chỉ số bài học hiện tại
  const { transcript, listening, resetTranscript } = useSpeechRecognition();
  const [result, setResult] = useState<JSX.Element | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [browserSupports, setBrowserSupports] = useState(false);

  // Lấy dữ liệu bài học từ API
  useEffect(() => {
    const levelId = localStorage.getItem("levelId");
    const topicId = localStorage.getItem("topicId");
    if (levelId && topicId) {
      getLessons(Number(levelId), Number(topicId));
    }
    setIsClient(true);
    setBrowserSupports(SpeechRecognition.browserSupportsSpeechRecognition());
  }, []);

  // Cập nhật câu mẫu khi lessons thay đổi
  useEffect(() => {
    if (lessons.length > 0) {
      setCurrentSentence(lessons[currentLessonIndex]?.content || "");
    }
  }, [lessons, currentLessonIndex]);

  const getLessons = async (levelId: number, topicId: number) => {
    try {
      const res = await getSpeakingByTopicAndLevel(levelId, topicId);
      setLessons(res.data);
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  // Không render gì cho đến khi client-side hydration hoàn tất
  if (!isClient) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="flex gap-3 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-10 w-20 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Kiểm tra hỗ trợ trình duyệt
  if (!browserSupports) {
    return (
      <div className="max-w-xl mx-auto p-6">
        <p className="text-red-500 font-semibold">
          ❌ Trình duyệt không hỗ trợ Speech Recognition.
        </p>
      </div>
    );
  }

  // Kiểm tra phát âm
  const checkPronunciation = () => {
    if (!currentSentence) return; // Không làm gì nếu chưa có câu mẫu

    const cleanSampleSentence = currentSentence
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .trim();
    const cleanTranscript = transcript
      .toLowerCase()
      .replace(/[.,!?]/g, "")
      .trim();

    const sampleWords = cleanSampleSentence.split(" ");
    const spokenWords = cleanTranscript.split(" ");

    const compared = sampleWords.map((word, i) => {
      if (spokenWords[i] === word) {
        return (
          <span key={i} className="text-green-600 font-semibold mr-2">
            {word}
          </span>
        );
      } else {
        return (
          <span key={i} className="text-red-600 font-semibold mr-2">
            {spokenWords[i] || (
              <span className="text-red-600 font-semibold mr-2">___</span>
            )}
          </span>
        );
      }
    });

    setResult(<div className="mt-2">{compared}</div>);
  };

  // Chuyển sang câu tiếp theo
  const nextSentence = () => {
    if (currentLessonIndex < lessons.length - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setResult(null); // Reset kết quả khi chuyển câu
      resetTranscript(); // Reset transcript khi chuyển câu
    }
  };

  // Quay lại câu trước
  const prevSentence = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setResult(null); // Reset kết quả khi chuyển câu
      resetTranscript(); // Reset transcript khi chuyển câu
    }
  };

  const getVoices = () => {
    const voices = speechSynthesis.getVoices();
    console.log(voices);
  };

  window.speechSynthesis.onvoiceschanged = getVoices;

  const speak = (text: string, voiceName?: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = speechSynthesis.getVoices();

    if (voiceName) {
      const selectedVoice = voices.find((v) => v.name === voiceName);
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    utterance.lang = "en-US";
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">
        🎯 Nói theo câu mẫu:{" "}
        <span className="text-blue-600">
          "{currentSentence || "Đang tải câu mẫu..."}"
        </span>
      </h2>

      <p className="text-sm text-gray-600">
        Trạng thái:{" "}
        <span
          className={`font-semibold ${
            listening ? "text-green-600" : "text-gray-600"
          }`}
        >
          {listening ? "🎙️ Đang nghe..." : "⏹️ Dừng"}
        </span>
      </p>

      {/* Điều hướng câu trước/sau */}
      <div className="flex gap-3">
        <button
          onClick={prevSentence}
          disabled={currentLessonIndex === 0}
          className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 disabled:bg-gray-300"
        >
          Câu trước
        </button>
        <button
          onClick={nextSentence}
          disabled={currentLessonIndex >= lessons.length - 1}
          className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500 disabled:bg-gray-300"
        >
          Câu tiếp theo
        </button>
      </div>

      <button
        onClick={() => {
          if (currentSentence) {
            const utterance = new SpeechSynthesisUtterance(currentSentence);
            utterance.lang = "en-US";
            utterance.rate = 1;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
          }
        }}
        className="px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600"
      >
        🔊 Nghe mẫu
      </button>

      <div className="flex gap-3">
        <button
          onClick={() => {
            resetTranscript();
            SpeechRecognition.startListening({
              continuous: true,
              language: "en-US",
            });
          }}
          className="px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600"
        >
          Start
        </button>
        <button
          onClick={SpeechRecognition.stopListening}
          className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
        >
          Stop
        </button>
        <button
          onClick={resetTranscript}
          className="px-4 py-2 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
        >
          Reset
        </button>
        <button
          onClick={checkPronunciation}
          className="px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          Check
        </button>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800">Bạn đã nói:</h3>
        <p className="mt-1 p-2 border rounded bg-gray-50 text-gray-700">
          {transcript || "Chưa có dữ liệu"}
        </p>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-800">
          Kết quả kiểm tra:
        </h3>
        <div className="mt-1 p-2 border rounded bg-gray-50">
          {result || "Chưa có kết quả"}
        </div>
      </div>

      <button
        onClick={() => router.push("/dashboard/speaking/ipa")}
        className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600"
      >
        Bảng phiên âm IPA
      </button>
    </div>
  );
}

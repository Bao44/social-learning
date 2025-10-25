"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  List,
  Grid3x3,
  Sparkles,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface VocabItem {
  id: string;
  word: string;
  mastery_score: number;
  translation?: string;
  related_words?: { word_vi: string }[];
}

interface Props {
  title: string;
  listPersonalVocab: VocabItem[];
  onBack: () => void;
  onSelectWord?: (id: string) => void;
}

export default function OverviewRangeView({
  title,
  listPersonalVocab,
  onBack,
  onSelectWord,
}: Props) {
  const ranges: Record<string, [number, number]> = {
    "Cần ôn gấp": [0, 29],
    "Đang tiến bộ": [30, 69],
    "Sắp thành thạo": [70, 99],
  };
  const [min, max] = ranges[title] ?? [0, 100];

  const [vocabs, setVocabs] = useState<VocabItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");

  // Filter lại list mỗi khi props thay đổi
  useEffect(() => {
    const relatedFiltered = listPersonalVocab.map((v) => {
      if (!v.translation && v.related_words && v.related_words.length > 0) {
        return { ...v, translation: v.related_words[0].word_vi };
      }
      return v;
    });

    const filtered = relatedFiltered.filter(
      (v) => v.mastery_score >= min && v.mastery_score <= max
    );

    setVocabs(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [listPersonalVocab, min, max]);

  // Shuffle (nên clone mảng thay vì sort trực tiếp)
  useEffect(() => {
    if (shuffle && vocabs.length > 0) {
      setVocabs((prev) => [...prev].sort(() => Math.random() - 0.5));
      setCurrentIndex(0);
      setIsFlipped(false);
    }
  }, [shuffle]);

  useEffect(() => {
    const loadVoices = () => {
      window.speechSynthesis.getVoices();
    };
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
  }, []);

  const speakWord = (text: string) => {
    if (!window.speechSynthesis) {
      console.warn("Speech Synthesis not supported");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    // Lấy tất cả voice tiếng Anh
    const voices = window.speechSynthesis.getVoices();
    const englishVoices = voices.filter((v) => v.lang.startsWith("en-US"));

    // Random voice nếu có
    if (englishVoices.length > 0) {
      const randomVoice =
        englishVoices[Math.floor(Math.random() * englishVoices.length)];
      utterance.voice = randomVoice;
      utterance.lang = randomVoice.lang;
    }

    window.speechSynthesis.cancel(); // dừng voice cũ
    window.speechSynthesis.speak(utterance);
  };

  const getMasteryColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 30) return "text-yellow-600";
    return "text-red-600";
  };

  const getMasteryBgColor = (score: number) => {
    if (score >= 70) return "from-green-500/20 to-emerald-500/20";
    if (score >= 30) return "from-yellow-500/20 to-orange-500/20";
    return "from-red-500/20 to-pink-500/20";
  };

  const handleNext = () => {
    if (currentIndex < vocabs.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  const currentVocab = vocabs[currentIndex];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-4 flex-1 px-6 py-6 pb-36"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={onBack}
              className="mb-6 cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Quay lại
            </Button>

            <h1 className="text-3xl font-bold mb-6">{title}</h1>
          </div>
          <Button
            variant="ghost"
            onClick={() => console.log(vocabs.map((v) => v.word))}
            className="cursor-pointer bg-gradient-to-br from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500 text-white hover:text-white p-6 rounded-4xl text-lg font-bold shadow-lg hover:shadow-xl"
          >
            Luyện tập
          </Button>
        </div>
        {/* Flashcard Section */}
        {vocabs.length > 0 ? (
          <div className="mb-12">
            {/* Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Switch checked={shuffle} onCheckedChange={setShuffle} />
                <span className="text-sm text-gray-600">Ngẫu nhiên</span>
              </div>
              <div className="text-sm text-gray-600">
                {currentIndex + 1} / {vocabs.length}
              </div>
            </div>

            {/* Flashcard */}
            <div className="flex justify-center mb-6">
              {currentVocab && (
                <motion.div
                  className="relative w-full max-w-md h-64 cursor-pointer"
                  onClick={() => setIsFlipped(!isFlipped)}
                  style={{ perspective: 1000 }}
                >
                  {/* Front */}
                  <motion.div
                    className="absolute inset-0 w-full h-full rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm border border-gray-100 flex flex-col justify-center items-center p-6"
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <Button
                      variant="outline"
                      className="border-orange-200 hover:bg-orange-50 bg-transparent absolute top-4 right-4 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        speakWord(currentVocab.word);
                      }}
                    >
                      <Volume2 className="mr-2 h-4 w-4" />
                      Phát âm
                    </Button>
                    <h3 className="text-4xl font-bold text-gray-800">
                      {currentVocab.word}
                    </h3>
                  </motion.div>

                  {/* Back */}
                  <motion.div
                    className="absolute inset-0 w-full h-full rounded-2xl shadow-lg bg-white/80 backdrop-blur-sm border border-gray-100 flex flex-col justify-center items-center p-6"
                    initial={{ rotateY: 180 }}
                    animate={{ rotateY: isFlipped ? 0 : 180 }}
                    transition={{ duration: 0.6 }}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    {currentVocab.translation && (
                      <h3 className="text-4xl font-bold text-gray-800">
                        {currentVocab.translation}
                      </h3>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                onClick={handleNext}
                disabled={currentIndex === vocabs.length - 1}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center py-12">
            Không có từ nào trong khoảng này.
          </p>
        )}

        {/* Divider */}
        <div className="my-12 border-t border-gray-200" />

        {/* List/Grid view */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Tất cả từ trong nhóm</h2>
            <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-gray-200">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500"
                    : ""
                }
              >
                <List className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500"
                    : ""
                }
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <motion.div
            layout
            className={`grid gap-4 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {vocabs.map((v, i) => (
                <div
                  key={v.id}
                  onClick={() => onSelectWord?.(v.id)}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all relative overflow-hidden group"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getMasteryBgColor(
                      v.mastery_score
                    )} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all">
                        {v.word}{" "}
                        <span className="text-sm text-gray-600">
                          {v.translation}
                        </span>
                      </h3>
                      <Volume2
                        onClick={(e) => {
                          e.stopPropagation();
                          speakWord(v.word);
                        }}
                        className="w-6 h-6 text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity hover:text-orange-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-gray-600">
                        Mức độ thành thạo
                      </span>
                      <span
                        className={`text-sm font-bold ${getMasteryColor(
                          v.mastery_score
                        )}`}
                      >
                        {v.mastery_score}%
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${v.mastery_score}%` }}
                        className={`h-full bg-gradient-to-r ${
                          v.mastery_score >= 70
                            ? "from-green-500 to-emerald-500"
                            : v.mastery_score >= 30
                            ? "from-yellow-500 to-orange-500"
                            : "from-red-500 to-pink-500"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

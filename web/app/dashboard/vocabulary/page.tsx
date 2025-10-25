"use client";

import useAuth from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getListPersonalVocabByUserIdAndCreated } from "@/app/apiClient/learning/vocabulary/vocabulary";
import { useLanguage } from "@/components/contexts/LanguageContext";
import OverviewRangeView from "./components/RangeView";

export default function VocabularyPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const personalVocabId = searchParams.get("personalVocabId");

  const [listPersonalVocab, setListPersonalVocab] = useState<any[]>([]);
  const [filteredVocab, setFilteredVocab] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const isInitialLoad = useRef(true);

  // Load dữ liệu
  useEffect(() => {
    if (loading || !user?.id) return;
    if (isInitialLoad.current) {
      loadVocab();
      isInitialLoad.current = false;
    }
  }, [loading, user?.id]);

  const loadVocab = async () => {
    setLoading(true);
    if (!user) return;
    const res = await getListPersonalVocabByUserIdAndCreated({
      userId: user.id,
    });

    if (res.success) {
      setListPersonalVocab(res.data);
    }
    setLoading(false);
  };

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

  // Filter theo search + tab
  useEffect(() => {
    let filtered = listPersonalVocab;

    if (searchQuery.trim() !== "") {
      filtered = filtered.filter((vocab) =>
        vocab.word.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (activeTab === "mastered") {
      filtered = filtered.filter((v) => v.mastery_score === 100);
    } else if (activeTab === "topics" && selectedTopic) {
      filtered = filtered.filter((v) => v.topic === selectedTopic);
    }

    setFilteredVocab(filtered);
  }, [searchQuery, listPersonalVocab, activeTab, selectedTopic]);

  const vocabOverview = listPersonalVocab.filter((v) => v.mastery_score < 100);

  // Tính stats
  const totalWords = listPersonalVocab.length;
  const averageMastery =
    totalWords > 0
      ? Math.round(
          listPersonalVocab.reduce((sum, v) => sum + v.mastery_score, 0) /
            totalWords
        )
      : 0;
  const wordsToReview = listPersonalVocab.filter(
    (v) => v.mastery_score < 70
  ).length;

  const lowCount = listPersonalVocab.filter(
    (v) => v.mastery_score <= 29
  ).length;
  const midCount = listPersonalVocab.filter(
    (v) => v.mastery_score >= 30 && v.mastery_score <= 69
  ).length;
  const highCount = listPersonalVocab.filter(
    (v) => v.mastery_score >= 70 && v.mastery_score <= 99
  ).length;
  const masteredCount = listPersonalVocab.filter(
    (v) => v.mastery_score === 100
  ).length;

  const uniqueTopics = Array.from(
    new Set(listPersonalVocab.map((v) => v.topic).filter(Boolean))
  );

  // Màu sắc mastery
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

  // Render danh sách từ vựng
  const renderVocabList = (vocabList: any[]) => {
    return (
      <motion.div
        layout
        className={`grid gap-4 ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        <AnimatePresence mode="popLayout">
          {vocabList.map((vocab, index) => {
            const isHighlighted = vocab.id === personalVocabId;
            return (
              <motion.div
                key={vocab.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -4 }}
                onClick={() => router.push(`/dashboard/vocabulary/${vocab.id}`)}
                className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all relative overflow-hidden group"
              >
                {isHighlighted && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-pink-500/30 z-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 0, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${getMasteryBgColor(
                    vocab.mastery_score
                  )} opacity-0 group-hover:opacity-100 transition-opacity`}
                />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all">
                      {vocab.word}
                    </h3>
                    <Volume2
                      onClick={(e) => {
                         e.stopPropagation();
                        speakWord(vocab.word);
                      }}
                      className="w-6 h-6 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-600">
                      {t("learning.masteryLevel")}
                    </span>
                    <span
                      className={`text-sm font-bold ${getMasteryColor(
                        vocab.mastery_score
                      )}`}
                    >
                      {vocab.mastery_score}%
                    </span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${vocab.mastery_score}%` }}
                      transition={{ duration: 1, delay: index * 0.05 }}
                      className={`h-full bg-gradient-to-r ${
                        vocab.mastery_score >= 70
                          ? "from-green-500 to-emerald-500"
                          : vocab.mastery_score >= 30
                          ? "from-yellow-500 to-orange-500"
                          : "from-red-500 to-pink-500"
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderLoadingSkeleton = () => {
    return (
      <div
        className={`grid gap-4 ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}
      >
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg animate-pulse"
          >
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  };

  const renderEmptyState = () => {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6"
        >
          <div className="p-8 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full">
            <BookOpen className="w-20 h-20 text-orange-500" />
          </div>
        </motion.div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          {searchQuery
            ? t("learning.noVocabularyFound")
            : t("learning.noVocabulary")}
        </h3>
        <p className="text-gray-600 text-center max-w-md">
          {searchQuery ? t("learning.suggestion") : t("learning.startLearning")}
        </p>
        {searchQuery && (
          <Button
            onClick={() => setSearchQuery("")}
            className="mt-6 bg-gradient-to-r from-orange-500 to-pink-500"
          >
            {t("learning.clearSearch")}
          </Button>
        )}
      </motion.div>
    );
  };

  return (
    <div className="flex-1 px-6 py-6 pb-36 sm:ml-10">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-orange-300/30 to-pink-300/30 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute -bottom-30 -left-20 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <motion.div
              className="p-4 bg-gradient-to-br from-orange-500 to-pink-500 rounded-2xl shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <BookOpen className="w-8 h-8 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                {t("learning.myVocabulary")}
              </h1>
              <p className="text-gray-600 mt-1">
                {t("learning.myVocabularyDescription")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("learning.totalWords")}
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  {totalWords}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-xl">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("learning.averageMastery")}
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {averageMastery}%
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("learning.needReview")}
                </p>
                <p className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
                  {wordsToReview}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-xl">
                <AlertCircle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Tabs */}
        <Tabs
          defaultValue="overview"
          className="relative z-10"
          onValueChange={(v) => {
            setActiveTab(v);
            if (v !== "topics") setSelectedTopic(null);
          }}
        >
          <TabsList className="bg-white/80 backdrop-blur-sm rounded-4xl p-6 border border-gray-200 mb-4">
            <TabsTrigger
              value="overview"
              className="cursor-pointer text-lg p-4 rounded-2xl"
            >
              {t("learning.overview")}
            </TabsTrigger>
            <TabsTrigger
              value="mastered"
              className="cursor-pointer text-lg p-4 rounded-2xl"
            >
              {t("learning.mastered")}
            </TabsTrigger>
            <TabsTrigger
              value="topics"
              className="cursor-pointer text-lg p-4 rounded-2xl"
            >
              {t("learning.byTopic")}
            </TabsTrigger>
          </TabsList>
          {/* TAB 1: Overview */}
          <TabsContent value="overview">
            {selectedTopic ? (
              <OverviewRangeView
                title={selectedTopic}
                listPersonalVocab={listPersonalVocab}
                onBack={() => setSelectedTopic(null)}
                onSelectWord={(id) =>
                  window.open(`/dashboard/vocabulary/${id}`, "_blank")
                }
              />
            ) : (
              <>
                <Button
                  onClick={() => console.log(vocabOverview.map((v) => v.word))}
                  variant="ghost"
                  className="mb-8 cursor-pointer bg-gradient-to-br from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500 text-white hover:text-white p-6 rounded-4xl text-lg font-bold shadow-lg hover:shadow-xl"
                >
                  Luyện tập tổng hợp
                </Button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    {
                      title: "Cần ôn gấp",
                      count: lowCount,
                      bg: "from-red-500/20 to-pink-500/20",
                      icon: AlertCircle,
                    },
                    {
                      title: "Đang tiến bộ",
                      count: midCount,
                      bg: "from-yellow-500/20 to-orange-500/20",
                      icon: TrendingUp,
                    },
                    {
                      title: "Sắp thành thạo",
                      count: highCount,
                      bg: "from-green-500/20 to-emerald-500/20",
                      icon: BookOpen,
                    },
                  ].map((card) => {
                    const Icon = card.icon;
                    return (
                      <motion.div
                        key={card.title}
                        whileHover={{ scale: 1.03, y: -6 }}
                        onClick={() => setSelectedTopic(card.title)}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all relative overflow-hidden group"
                      >
                        <div
                          className={`absolute inset-0 bg-gradient-to-br ${card.bg} opacity-0 group-hover:opacity-100 transition-opacity`}
                        />
                        <div className="relative z-10 flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              {card.title}
                            </h3>
                            <p className="text-3xl font-bold mt-2 bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                              {loading ? "…" : card.count}
                            </p>
                          </div>
                          <div className="p-3 bg-white/50 rounded-xl">
                            <Icon className="w-7 h-7 text-gray-700" />
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>

          {/* TAB 2: Mastered */}
          <TabsContent value="mastered">
            {masteredCount > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
              >
                <p className="text-xl"> Đã thành thạo {masteredCount} từ. </p>
                <Button
                  onClick={() => console.log(vocabOverview.map((v) => v.word))}
                  variant="ghost"
                  className="my-4 cursor-pointer bg-gradient-to-br from-orange-600 to-pink-600 hover:from-orange-500 hover:to-pink-500 text-white hover:text-white p-6 rounded-4xl text-lg font-bold shadow-lg hover:shadow-xl"
                >
                  Ôn tập nhanh
                </Button>
              </motion.div>
            )}
            {loading
              ? renderLoadingSkeleton()
              : filteredVocab.length > 0
              ? renderVocabList(filteredVocab)
              : renderEmptyState()}
          </TabsContent>

          {/* TAB 3: Topics */}
          <TabsContent value="topics">
            {loading ? (
              renderLoadingSkeleton()
            ) : uniqueTopics.length > 0 ? (
              selectedTopic ? (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedTopic(null)}
                    className="mb-4"
                  >
                    Back to Topics
                  </Button>
                  {filteredVocab.length > 0
                    ? renderVocabList(filteredVocab)
                    : renderEmptyState()}
                </>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {uniqueTopics.map((topic) => (
                    <motion.div
                      key={topic}
                      whileHover={{ scale: 1.02, y: -4 }}
                      onClick={() => setSelectedTopic(topic)}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all"
                    >
                      <h3 className="text-xl font-bold text-gray-800">
                        {topic}
                      </h3>
                      <p className="text-sm text-gray-600 mt-2">
                        {
                          listPersonalVocab.filter((v) => v.topic === topic)
                            .length
                        }{" "}
                        words
                      </p>
                    </motion.div>
                  ))}
                </div>
              )
            ) : (
              renderEmptyState()
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

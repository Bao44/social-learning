"use client";

import useAuth from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Search,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Grid3x3,
  List,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getListPersonalVocabByUserIdAndCreated } from "@/app/apiClient/learning/vocabulary/vocabulary";

export default function VocabularyPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [listPersonalVocab, setListPersonalVocab] = useState<any[]>([]);
  const [filteredVocab, setFilteredVocab] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const isInitialLoad = useRef(true);

  // Load dữ liệu ban đầu
  useEffect(() => {
    if (loading || !user?.id) return;
    if (isInitialLoad.current) {
      loadVocab();
      isInitialLoad.current = false;
    }
  }, [loading, user?.id]);

  // Filter vocabulary based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVocab(listPersonalVocab);
    } else {
      const filtered = listPersonalVocab.filter((vocab) =>
        vocab.word.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVocab(filtered);
    }
  }, [searchQuery, listPersonalVocab]);

  const loadVocab = async () => {
    setLoading(true);
    if (!user) return;
    const res = await getListPersonalVocabByUserIdAndCreated({
      userId: user.id,
    });

    if (res.success) {
      setListPersonalVocab(res.data);
      setFilteredVocab(res.data);
    }
    setLoading(false);
  };

  // Calculate stats
  const totalWords = listPersonalVocab.length;
  const averageMastery =
    totalWords > 0
      ? Math.round(
          listPersonalVocab.reduce(
            (sum, vocab) => sum + vocab.mastery_score,
            0
          ) / totalWords
        )
      : 0;
  const wordsToReview = listPersonalVocab.filter(
    (vocab) => vocab.mastery_score < 70
  ).length;

  // Get mastery color
  const getMasteryColor = (score: number) => {
    if (score >= 70) return "text-green-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getMasteryBgColor = (score: number) => {
    if (score >= 70) return "from-green-500/20 to-emerald-500/20";
    if (score >= 40) return "from-yellow-500/20 to-orange-500/20";
    return "from-red-500/20 to-pink-500/20";
  };

  return (
    <div className="flex-1 px-6 py-6 pb-36 sm:ml-10">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-orange-300/30 to-pink-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-pink-300/30 to-purple-300/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
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
                My Vocabulary
              </h1>
              <p className="text-gray-600 mt-1">
                Master your words, expand your knowledge
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
          {/* Total Words */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Words</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
                  {totalWords}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-xl">
                <BookOpen className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </motion.div>

          {/* Average Mastery */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-green-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Average Mastery</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  {averageMastery}%
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </motion.div>

          {/* Words to Review */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-yellow-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Need Review</p>
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

        {/* Search and View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search vocabulary..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-10 h-12 bg-white/80 backdrop-blur-sm border-gray-200 focus:border-orange-300 focus:ring-orange-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-xl p-1 border border-gray-200">
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
          </div>
        </motion.div>

        {/* Vocabulary List */}
        {loading ? (
          // Loading Skeleton
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
                <div className="h-2 bg-gray-200 rounded w-full mb-4"></div>
                <div className="flex gap-2">
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredVocab.length > 0 ? (
          <motion.div
            layout
            className={`grid gap-4 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filteredVocab.map((vocab, index) => (
                <motion.div
                  key={vocab.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  onClick={() =>
                    router.push(`/dashboard/vocabulary/${vocab.id}`)
                  }
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 cursor-pointer hover:shadow-xl transition-all relative overflow-hidden group"
                >
                  {/* Decorative Gradient Background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${getMasteryBgColor(
                      vocab.mastery_score
                    )} opacity-0 group-hover:opacity-100 transition-opacity`}
                  />

                  <div className="relative z-10">
                    {/* Word */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-2xl font-bold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-orange-600 group-hover:to-pink-600 group-hover:bg-clip-text transition-all">
                        {vocab.word}
                      </h3>
                      <Sparkles className="w-5 h-5 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    {/* Translation */}
                    {vocab.translation && (
                      <p className="text-sm text-gray-600 mb-4">
                        {vocab.translation}
                      </p>
                    )}

                    {/* Mastery Score Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600">
                          Mastery Level
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
                              : vocab.mastery_score >= 40
                              ? "from-yellow-500 to-orange-500"
                              : "from-red-500 to-pink-500"
                          }`}
                        />
                      </div>
                    </div>

                    {/* Error Count */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 px-3 py-1 bg-red-100 rounded-full">
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <span className="text-xs font-medium text-red-600">
                          {vocab.error_count} errors
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          // Empty State
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="mb-6"
            >
              <div className="p-8 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full">
                <BookOpen className="w-20 h-20 text-orange-500" />
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              {searchQuery ? "No vocabulary found" : "No vocabulary yet"}
            </h3>
            <p className="text-gray-600 text-center max-w-md">
              {searchQuery
                ? "Try adjusting your search query"
                : "Start learning and add new words to your personal vocabulary collection"}
            </p>
            {searchQuery && (
              <Button
                onClick={() => setSearchQuery("")}
                className="mt-6 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600"
              >
                Clear Search
              </Button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}

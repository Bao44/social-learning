"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Medal, Award, Crown, Star, Sparkles } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { getLeaderBoardByType } from "@/app/apiClient/learning/ranking/ranking";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { getUserImageSrc } from "@/app/apiClient/image/image";

interface LeaderboardEntry {
  score?: number;
  rank?: number;
  leaderboard_type: string;
  users?: {
    id: string;
    name?: string;
    avatar?: string;
    nick_name: string;
  };
}

const Leaderboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"practice" | "test">("practice");
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );

  const currentUserId = user?.id;

  useEffect(() => {
    if (user?.id) {
      fetchLeaderboardData();
    }
  }, [user, activeTab]);

  const fetchLeaderboardData = async () => {
    try {
      const res = await getLeaderBoardByType(activeTab);
      setLeaderboardData(res.data || []);
    } catch (error) {
      console.error("Failed to fetch leaderboard data:", error);
    }
  };

  const filteredData = leaderboardData
    .filter((entry) => entry.leaderboard_type === activeTab && entry.users?.id)
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .map((entry, index) => ({ ...entry, rank: index + 1 }));

  const userRank = filteredData.find(
    (entry) => entry.users?.id === currentUserId
  );
  const topThree = filteredData.slice(0, 3);
  const restOfList = filteredData.slice(3);

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "from-yellow-300 to-amber-500";
      case 2:
        return "from-slate-300 to-slate-400";
      case 3:
        return "from-orange-400 to-amber-600";
      default:
        return "from-blue-500 to-cyan-500";
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-slate-400" />;
      case 3:
        return <Award className="w-6 h-6 text-orange-500" />;
      default:
        return null;
    }
  };

  const getPodiumHeight = (rank: number) => {
    switch (rank) {
      case 1:
        return "h-48";
      case 2:
        return "h-40";
      case 3:
        return "h-32";
      default:
        return "h-24";
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 bg-clip-text text-transparent">
              Bảng Xếp Hạng
            </h1>
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </div>
          <p className="text-slate-400 text-lg">Thể hiện kỹ năng của bạn</p>
        </motion.div>

        {/* User Rank */}
        {userRank && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-10 p-6 rounded-2xl bg-gradient-to-br from-[#1e3a8a]/30 to-[#06b6d4]/20 backdrop-blur-md border border-blue-400/30 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 p-1">
                  <Avatar className="w-full h-full">
                    <AvatarImage
                      src={getUserImageSrc(userRank.users?.avatar)}
                    />
                  </Avatar>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                    Xếp hạng của bạn
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </h3>
                  <p className="text-slate-300 text-sm">
                    {userRank.users?.nick_name}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                  #{userRank.rank}
                </div>
                <div className="text-xl text-white font-semibold">
                  {userRank.score} điểm
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="mb-10 flex justify-center gap-4">
          {["practice", "test"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "practice" | "test")}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === tab
                  ? "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white hover:text-white shadow-lg shadow-blue-500/50 scale-105"
                  : "bg-gradient-to-r from-orange-300 to-pink-300 hover:from-orange-600 hover:to-pink-600 text-white hover:text-white"
              }`}
            >
              {tab === "practice" ? "Luyện tập" : "Kiểm tra"}
            </button>
          ))}
        </div>

        {/* Leaderboard Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Top 3 */}
            <div className="flex items-end justify-center gap-6 mb-12">
              {[topThree[1], topThree[0], topThree[2]].map(
                (entry, index) =>
                  entry && (
                    <motion.div
                      key={entry.users?.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`${
                        index === 2 ? "order-2 w-44" : "w-40"
                      } flex flex-col items-center`}
                    >
                      <div className="relative mb-4">
                        <div
                          className={`w-24 h-24 rounded-full bg-gradient-to-br ${getRankColor(
                            entry.rank!
                          )} p-[3px] shadow-xl`}
                        >
                          <Avatar className="w-full h-full">
                            <AvatarImage
                              src={getUserImageSrc(entry.users?.avatar)}
                            />
                          </Avatar>
                        </div>
                        <div className="absolute -top-3 -right-3 bg-slate-900 rounded-full p-2 border-2 border-slate-700 shadow-md">
                          {getRankIcon(entry.rank!)}
                        </div>
                      </div>
                      <h3 className="text-white font-bold text-center mb-1">
                        {entry.users?.name || "Ẩn danh"}
                      </h3>
                      <p className="text-slate-400 text-sm mb-3">
                        {entry.users?.nick_name}
                      </p>
                      <div
                        className={`${getPodiumHeight(
                          entry.rank!
                        )} w-full bg-gradient-to-br ${getRankColor(
                          entry.rank!
                        )} rounded-t-2xl flex flex-col items-center justify-center shadow-md border-t-4 border-white/20`}
                      >
                        <div className="text-3xl font-bold text-white mb-1">
                          #{entry.rank}
                        </div>
                        <div className="text-xl font-bold text-white">
                          {entry.score}
                        </div>
                        <div className="text-sm text-white/80">điểm</div>
                      </div>
                    </motion.div>
                  )
              )}
            </div>

            {/* Rest of Leaderboard */}
            <div className="space-y-3">
              {restOfList.length > 0 ? (
                restOfList.map((entry, index) => (
                  <motion.div
                    key={entry.users?.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center p-5 rounded-2xl backdrop-blur-md transition-all duration-300 hover:scale-[1.02] ${
                      entry.users?.id === currentUserId
                        ? "bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white hover:text-white shadow-lg shadow-blue-400/30"
                        : "bg-gradient-to-r from-orange-400 to-pink-400 hover:from-orange-500 hover:to-pink-500 text-white hover:text-white"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center mr-4">
                      <span className="text-xl font-bold text-white">
                        {entry.rank}
                      </span>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-0.5 mr-4">
                      <img
                        src={getUserImageSrc(entry.users?.avatar)}
                        alt={entry.users?.name}
                        className="w-full h-full rounded-full bg-slate-800 object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-white text-lg">
                        {entry.users?.name || "Ẩn danh"}
                      </p>
                      <p className="text-white/70 text-sm">
                        {entry.users?.nick_name}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-white">
                        {entry.score}
                      </div>
                      <div className="text-sm text-white/70">điểm</div>
                    </div>
                  </motion.div>
                ))
              ) : filteredData.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20"
                >
                  <Trophy className="w-20 h-20 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400 text-xl">
                    Không có dữ liệu xếp hạng
                  </p>
                </motion.div>
              ) : null}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Leaderboard;

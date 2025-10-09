"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { getLeaderBoardByType } from "@/app/apiClient/learning/ranking/ranking";
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
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [activeTab, setActiveTab] = useState<"practice" | "test">("practice");

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
  console.log(leaderboardData);
  // Filter and sort leaderboard data
  const filteredData = leaderboardData
    .filter((entry) => entry.leaderboard_type === activeTab)
    .filter((entry) => entry.users?.id) // Ensure user exists
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  // Get current user's rank
  const userRank = leaderboardData.find(
    (entry) =>
      entry.users?.id === user.id && entry.leaderboard_type === activeTab
  );

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6" /> Bảng Xếp Hạng
          </CardTitle>
          {userRank && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-primary/10 rounded-lg"
            >
              <h3 className="text-lg font-semibold">Xếp hạng của bạn</h3>
              <p>
                Hạng: <Badge>{userRank.rank || "N/A"}</Badge> | Điểm:{" "}
                {userRank.score || 0}
              </p>
            </motion.div>
          )}
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="practice"
            onValueChange={(value: any) =>
              setActiveTab(value as "practice" | "test")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="practice">Luyện tập</TabsTrigger>
              <TabsTrigger value="test">Kiểm tra</TabsTrigger>
            </TabsList>
            <AnimatePresence mode="wait">
              <TabsContent value={activeTab} className="mt-6">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    {filteredData.length > 0 ? (
                      filteredData.map(
                        (entry: LeaderboardEntry, index: number) => (
                          <motion.div
                            key={index}
                            className={`flex items-center p-4 rounded-lg border ${
                              entry.users?.id === user.id ? "bg-primary/10" : ""
                            }`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="w-12 text-center font-bold text-lg">
                              {entry.rank || index + 1}
                            </span>
                            <Avatar className="h-10 w-10 mx-4">
                              <AvatarImage
                                src={getUserImageSrc(entry.users?.avatar)}
                              />
                            </Avatar>
                            <div className="flex-1">
                              <p className="font-semibold">
                                {entry.users?.name || "Ẩn danh"}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {entry.users?.nick_name}
                              </p>
                            </div>
                            <span className="font-bold">
                              {entry.score || 0} điểm
                            </span>
                          </motion.div>
                        )
                      )
                    ) : (
                      <p className="text-center text-muted-foreground">
                        Không có dữ liệu xếp hạng.
                      </p>
                    )}
                  </div>
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import useAuth from "@/hooks/useAuth";
import { getUserImageSrc } from "@/app/api/image/route";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { followUser, getFollowers, getFollowing } from "@/app/api/follow/route";
import FollowModal from "../profile/components/FollowModal";

interface FriendSuggestion {
  id: string;
  name: string;
  avatar: string;
  nick_name: string;
  level: number;
  isFoF: boolean;
  isSameOrHigherLevel: boolean;
  mutualCount: number;
  matchCount: number;
}

interface Follower {
  id: string;
  name: string;
  nick_name: string;
  avatar?: string;
}

export function RightSidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const [suggestions, setSuggestions] = useState<FriendSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [followingUser, setFollowingUser] = useState<string | null>(null);
  const [openFollowing, setOpenFollowing] = useState(false);
  const [following, setFollowing] = useState<Follower[]>([]);
  const [openFollower, setOpenFollower] = useState(false);
  const [follower, setFollower] = useState<Follower[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!user) return;

      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session?.access_token) return;

        const { data, error } = await supabase.functions.invoke(
          "recommend-friends",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session.access_token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (error) {
          console.error("Error fetching suggestions:", error);
          return;
        }

        // Chỉ lấy 4 người đầu tiên cho sidebar
        setSuggestions((data || []).slice(0, 4));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [user]);

  const handleFollowUser = async (userId: string) => {
    if (!user || followingUser) return;

    setFollowingUser(userId);

    try {
      const { error } = await followUser(user.id, userId);

      if (error) {
        console.error("Error following user:", error);
        return;
      }

      // Xóa user đã follow khỏi danh sách gợi ý
      setSuggestions((prev) => prev.filter((s) => s.id !== userId));
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setFollowingUser(null);
    }
  };

  const getLevelBadgeColor = (level: number) => {
    if (level >= 8) return "bg-purple-100 text-purple-800";
    if (level >= 6) return "bg-blue-100 text-blue-800";
    if (level >= 4) return "bg-green-100 text-green-800";
    if (level >= 2) return "bg-yellow-100 text-yellow-800";
    return "bg-gray-100 text-gray-800";
  };

  const getLevelName = (level: number) => {
    if (level >= 10) return "Master";
    if (level >= 8) return "Expert";
    if (level >= 6) return "Advanced";
    if (level >= 4) return "Intermediate";
    if (level >= 2) return "Beginner";
    return "Newbie";
  };

  useEffect(() => {
    if (user?.id) {
      getListFollowing();
      getListFollowers();
    }
  }, [user?.id]);

  const getListFollowing = async () => {
    if (!user?.id) {
      return;
    }
    setLoading(true);
    let res = await getFollowing(user?.id);
    if (res.success) {
      setFollowing(res.data);
    }
    setLoading(false);
  };

  const getListFollowers = async () => {
    if (!user?.id) {
      return;
    }
    setLoading(true);
    let res = await getFollowers(user?.id);
    if (res.success) {
      setFollower(res.data);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 fixed mt-20">
      {/* Thông tin cá nhân */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-14 w-14">
              <AvatarImage src={getUserImageSrc(user?.avatar)} alt="Profile" />
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.nick_name}</p>
              <Badge
                variant="secondary"
                className={`text-xs mt-1 ${getLevelBadgeColor(user?.level)}`}
              >
                Level {user?.level || 1} {getLevelName(user?.level || 1)}
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div>
              <p className="font-semibold text-gray-900">0</p>
              <p className="text-xs text-gray-500">Bài viết</p>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setOpenFollower(true)}
            >
              <p className="font-semibold text-gray-900">{follower.length}</p>
              <p className="text-xs text-gray-500">Người theo dõi</p>
            </div>
            <div
              className="cursor-pointer"
              onClick={() => setOpenFollowing(true)}
            >
              <p className="font-semibold text-gray-900">{following.length}</p>
              <p className="text-xs text-gray-500">Đang theo dõi</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gợi ý */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold text-gray-500">
              Gợi ý cho bạn
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => router.push("/dashboard/recommendFriends")}
            >
              Xem tất cả
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            // Loading skeleton
            [...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between animate-pulse"
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-gray-300 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
                <div className="h-8 bg-gray-300 rounded w-16"></div>
              </div>
            ))
          ) : suggestions.length > 0 ? (
            suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Avatar
                    className="h-10 w-10 cursor-pointer"
                    onClick={() =>
                      router.push(`/dashboard/profile/${suggestion.nick_name}`)
                    }
                  >
                    <AvatarImage
                      src={getUserImageSrc(suggestion.avatar)}
                      alt={suggestion.name}
                    />
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {suggestion.name}
                      </p>
                      {suggestion.isSameOrHigherLevel && (
                        <Badge
                          variant="secondary"
                          className={`text-xs bg-green-100 ${getLevelBadgeColor(
                            suggestion.level
                          )} px-1`}
                        >
                          L{suggestion.level}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {suggestion.mutualCount > 0
                        ? `${suggestion.mutualCount} bạn chung`
                        : `@${suggestion.nick_name}`}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  disabled={followingUser === suggestion.id}
                  onClick={() => handleFollowUser(suggestion.id)}
                  className="text-xs bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white disabled:opacity-50 cursor-pointer"
                >
                  {followingUser === suggestion.id ? (
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    "Theo dõi"
                  )}
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-xs text-gray-500 mb-2">🔍 Không có gợi ý</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/dashboard/recommendFriends")}
                className="text-xs cursor-pointer"
              >
                Khám phá thêm
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Follow Modal */}
      <FollowModal
        isOpen={openFollowing}
        onClose={() => setOpenFollowing(false)}
        title="Đang theo dõi"
        currentUserId={user?.id}
        data={following}
      />

      <FollowModal
        isOpen={openFollower}
        onClose={() => setOpenFollower(false)}
        title="Người theo dõi"
        currentUserId={user?.id}
        data={follower}
      />
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Flame,
  BookOpen,
  ShieldAlert,
  ShieldCheck,
  Ban,
  Lock,
  UserCog,
  Calendar,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  loadUserAchievements,
  loadUserDetail,
  loadUserErrors,
  loadUserPosts,
  loadUserScores,
  loadUserVocabularies,
  updateUserStatus,
} from "@/app/apiClient/admin/user";
import { getUserImageSrc } from "@/app/apiClient/image/image";
import { useLanguage } from "@/components/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type UserDetailDialogProps = {
  userId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateSuccess?: () => void;
};

export function UserDetailDialog({
  userId,
  open,
  onOpenChange,
  onUpdateSuccess,
}: UserDetailDialogProps) {
  const { t } = useLanguage();

  const [user, setUser] = useState<any>(null);
  const [scores, setScores] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [posts, setPosts] = useState<any[]>([]);
  const [vocab, setVocab] = useState<any[]>([]);
  const [errors, setErrors] = useState<any[]>([]);

  const [userLoading, setUserLoading] = useState(true);
  const [scoresLoading, setScoresLoading] = useState(true);
  const [achievementsLoading, setAchievementsLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(true);
  const [vocabLoading, setVocabLoading] = useState(true);
  const [errorsLoading, setErrorsLoading] = useState(true);

  // State cho hành động Admin
  const [isUpdating, setIsUpdating] = useState(false);
  const [banDuration, setBanDuration] = useState("0"); // 0 = none, -1 = forever, number = days

  useEffect(() => {
    if (!userId || !open) return;
    let isMounted = true;
    const fetchData = async () => {
      setUserLoading(true);
      try {
        const userRes = await loadUserDetail(userId);
        if (isMounted) {
          setUser(userRes.data ?? userRes);
        }
      } catch {
        setUser(null);
      } finally {
        if (isMounted) setUserLoading(false);
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [userId, open]);

  // Load data phụ
  useEffect(() => {
    if (!userId || !open) return;
    const fetchAll = async () => {
      setScoresLoading(true);
      setAchievementsLoading(true);
      setPostsLoading(true);
      setVocabLoading(true);
      setErrorsLoading(true);

      try {
        const [scoresRes, achievementsRes, postsRes, vocabRes, errorsRes] =
          await Promise.allSettled([
            loadUserScores(userId),
            loadUserAchievements(userId),
            loadUserPosts(userId),
            loadUserVocabularies(userId),
            loadUserErrors(userId),
          ]);

        if (scoresRes.status === "fulfilled")
          setScores(scoresRes.value.data ?? scoresRes.value);
        if (achievementsRes.status === "fulfilled")
          setAchievements(achievementsRes.value.data ?? achievementsRes.value);
        if (postsRes.status === "fulfilled")
          setPosts(postsRes.value.data ?? postsRes.value);
        if (vocabRes.status === "fulfilled")
          setVocab(vocabRes.value.data ?? vocabRes.value);
        if (errorsRes.status === "fulfilled")
          setErrors(errorsRes.value.data ?? errorsRes.value);
      } catch {
        console.error("Failed to fetch user details");
      } finally {
        setScoresLoading(false);
        setAchievementsLoading(false);
        setPostsLoading(false);
        setVocabLoading(false);
        setErrorsLoading(false);
      }
    };
    fetchAll();
  }, [userId, open]);

  const handleUpdateStatus = async (type: "role" | "ban", value: any) => {
    if (!user) return;
    try {
      setIsUpdating(true);
      const payload: any = {};

      if (type === "role") {
        // Toggle role
        payload.role = user.role === "admin" ? "user" : "admin";
      } else if (type === "ban") {
        payload.banDuration = parseInt(value); // số ngày
      }

      await updateUserStatus(user.id, payload);

      // Update local state để hiển thị ngay lập tức
      if (type === "role") {
        setUser({ ...user, role: payload.role });
        toast.success(`Đã cập nhật quyền thành: ${payload.role}`, { autoClose: 1000 });
      } else {
        toast.success("Đã cập nhật trạng thái khóa tài khoản", { autoClose: 1000 });
        // Reload user để lấy thời gian banned_until mới từ server
        const userRes = await loadUserDetail(user.id);
        setUser(userRes.data);
      }

      if (onUpdateSuccess) onUpdateSuccess();
    } catch (error) {
      toast.error("Cập nhật thất bại", { autoClose: 1000 });
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (userLoading) return null
  if (!user) return null;

  const isBanned =
    user.banned_until && new Date(user.banned_until) > new Date();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="xl:max-w-6xl h-[85vh] p-0 flex flex-col overflow-hidden">
        <DialogHeader className="px-6 py-4 border-b bg-gray-50 flex-shrink-0">
          <DialogTitle className="flex justify-between items-center">
            <span>{t("dashboard.userDetails")}</span>
            {/* Hiển thị trạng thái tài khoản */}
            <div className="flex gap-2 mr-4">
              {user.role === "admin" && (
                <Badge className="bg-purple-600">Admin</Badge>
              )}
              {isBanned ? (
                <Badge
                  variant="destructive"
                  className="flex gap-1 items-center"
                >
                  <Lock className="w-3 h-3" /> Banned
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="text-green-600 border-green-600 flex gap-1 items-center"
                >
                  <ShieldCheck className="w-3 h-3" /> Active
                </Badge>
              )}
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/30">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Cột trái: Thông tin chính + Admin Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="pt-6 flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4 border-4 border-white shadow-sm">
                    <AvatarImage
                      src={getUserImageSrc(user.avatar)}
                      alt={user.name}
                    />
                    <AvatarFallback>{user.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-bold">{user.name}</h3>
                  <p className="text-sm text-gray-500 mb-4">{user.email}</p>

                  <div className="w-full grid grid-cols-2 gap-2 text-sm border-t pt-4">
                    <div className="text-center">
                      <p className="font-bold text-gray-900">
                        {user.level ?? 0}
                      </p>
                      <p className="text-gray-500 text-xs">Level</p>
                    </div>
                    <div className="text-center border-l">
                      <p className="font-bold text-gray-900">
                        {user.submit_credits ?? 0}
                      </p>
                      <p className="text-gray-500 text-xs">Credits</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Admin Actions Card */}
              <Card className="border-orange-200 bg-orange-50/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm uppercase text-orange-700 font-bold flex items-center gap-2">
                    <UserCog className="w-4 h-4" /> Admin Controls
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Promote/Demote */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-gray-600">
                      Role Management
                    </label>
                    <Button
                      variant={
                        user.role === "admin" ? "destructive" : "default"
                      }
                      className="w-full"
                      onClick={() => handleUpdateStatus("role", null)}
                      disabled={isUpdating}
                    >
                      {user.role === "admin"
                        ? "Demote to User"
                        : "Promote to Admin"}
                    </Button>
                  </div>

                  {/* Ban/Unban */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-medium text-gray-600">
                      Account Status
                    </label>
                    <Select
                      onValueChange={(val) => handleUpdateStatus("ban", val)}
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue
                          placeholder={isBanned ? "Modify Ban" : "Ban User..."}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Unban (Active)</SelectItem>
                        <SelectItem value="1">Ban 1 Day</SelectItem>
                        <SelectItem value="7">Ban 7 Days</SelectItem>
                        <SelectItem value="30">Ban 30 Days</SelectItem>
                        <SelectItem value="-1">Ban Permanently</SelectItem>
                      </SelectContent>
                    </Select>
                    {isBanned && user.banned_until && (
                      <p className="text-xs text-red-500 mt-1">
                        Banned until:{" "}
                        {new Date(user.banned_until).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cột phải: Tabs chi tiết */}
            <div className="lg:col-span-3 space-y-6">
              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                  icon={<Flame className="w-5 h-5 text-orange-600" />}
                  label="Streak"
                  value={user.learningStreak?.current_streak ?? 0}
                  color="bg-orange-50"
                />
                <StatCard
                  icon={<Trophy className="w-5 h-5 text-purple-600" />}
                  label="Achievements"
                  value={achievements.length}
                  color="bg-purple-50"
                />
                <StatCard
                  icon={<Calendar className="w-5 h-5 text-blue-600" />}
                  label="Joined"
                  value={new Date(user.created_at).toLocaleDateString()}
                  color="bg-blue-50"
                />
              </div>

              <Tabs defaultValue="scores" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent gap-6">
                  <TabsTrigger
                    value="scores"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-orange-500 data-[state=active]:shadow-none px-0 pb-2"
                  >
                    Scores
                  </TabsTrigger>
                  <TabsTrigger
                    value="achievements"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-orange-500 data-[state=active]:shadow-none px-0 pb-2"
                  >
                    Achievements
                  </TabsTrigger>
                  <TabsTrigger
                    value="posts"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-orange-500 data-[state=active]:shadow-none px-0 pb-2"
                  >
                    Posts
                  </TabsTrigger>
                  <TabsTrigger
                    value="vocabulary"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-orange-500 data-[state=active]:shadow-none px-0 pb-2"
                  >
                    Vocabulary
                  </TabsTrigger>
                  <TabsTrigger
                    value="errors"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-b-orange-500 data-[state=active]:shadow-none px-0 pb-2"
                  >
                    Errors
                  </TabsTrigger>
                </TabsList>

                <div className="mt-6">
                  <TabsContent value="scores">
                    <ScoresTab loading={scoresLoading} scores={scores} />
                  </TabsContent>
                  <TabsContent value="achievements">
                    <AchievementsTab
                      loading={achievementsLoading}
                      data={achievements}
                    />
                  </TabsContent>
                  <TabsContent value="posts">
                    <PostsTab loading={postsLoading} data={posts} />
                  </TabsContent>
                  <TabsContent value="vocabulary">
                    <VocabTab loading={vocabLoading} data={vocab} />
                  </TabsContent>
                  <TabsContent value="errors">
                    <ErrorsTab loading={errorsLoading} data={errors} />
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <div className={`${color} p-3 rounded-lg`}>{icon}</div>
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* --- Tabs --- */
function ScoresTab({ loading, scores }: any) {
  if (loading) return <Skeleton className="h-48 w-full" />;
  if (!scores.length)
    return (
      <p className="text-center py-8 text-gray-500">No score data available</p>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Skill</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scores.map((score: any, i: number) => (
              <TableRow key={i}>
                <TableCell className="capitalize">{score.skill}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{score.score}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(score.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function AchievementsTab({ loading, data }: any) {
  if (loading) return <Skeleton className="h-48 w-full" />;
  if (!data.length)
    return (
      <p className="text-center py-8 text-gray-500">No achievements yet</p>
    );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Achievements</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {data.map((a: any) => (
          <div
            key={a.id}
            className="flex items-start gap-3 p-4 border rounded-lg"
          >
            <div className="text-3xl">{a.learningAchievements.icon}</div>
            <div className="flex-1">
              <h4 className="font-semibold">{a.learningAchievements.title}</h4>
              <p className="text-sm text-gray-600">
                {a.learningAchievements.description}
              </p>
              <div className="flex gap-2 mt-2">
                <Badge variant={a.unlocked ? "default" : "secondary"}>
                  {a.unlocked ? "Unlocked" : "Locked"}
                </Badge>
                <Badge variant="outline">
                  {a.progress}/{a.learningAchievements.target}
                </Badge>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function PostsTab({ loading, data }: any) {
  if (loading) return <Skeleton className="h-48 w-full" />;
  if (!data.length)
    return <p className="text-center py-8 text-gray-500">No posts yet</p>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Activity</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {data.map((post: any) => (
          <div key={post.id} className="p-4 border rounded-lg">
            <p className="text-sm">{post.content}</p>
            <div className="flex gap-4 mt-3 text-xs text-gray-500">
              <span>{post.likes_count[0].count} likes</span>
              <span>{post.comments_count[0].count} comments</span>
              <span>{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function VocabTab({ loading, data }: any) {
  if (loading) return <Skeleton className="h-48 w-full" />;
  if (!data.length)
    return (
      <p className="text-center py-8 text-gray-500">No vocabulary entries</p>
    );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Vocabulary</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Word</TableHead>
              <TableHead>Mastery Score</TableHead>
              <TableHead>Errors</TableHead>
              <TableHead>Next Review</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((vocab: any) => (
              <TableRow key={vocab.id}>
                <TableCell className="font-medium">{vocab.word}</TableCell>
                <TableCell>
                  <Badge>{vocab.mastery_score}</Badge>
                </TableCell>
                <TableCell>{vocab.error_count}</TableCell>
                <TableCell>
                  {vocab.next_review_at
                    ? new Date(vocab.next_review_at).toLocaleDateString()
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ErrorsTab({ loading, data }: any) {
  if (loading) return <Skeleton className="h-48 w-full" />;
  if (!data.length)
    return <p className="text-center py-8 text-gray-500">No error data</p>;
  return (
    <Card>
      <CardHeader>
        <CardTitle>Error Patterns</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Word</TableHead>
              <TableHead>Error Type</TableHead>
              <TableHead>Skill</TableHead>
              <TableHead>Count</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((error: any, i: number) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{error.word}</TableCell>
                <TableCell>
                  <Badge variant="destructive">{error.error_type}</Badge>
                </TableCell>
                <TableCell className="capitalize">{error.skill}</TableCell>
                <TableCell>{error.error_count}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

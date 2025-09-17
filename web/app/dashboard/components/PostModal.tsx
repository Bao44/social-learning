"use client";

import type React from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Heart, Send } from "lucide-react";
import { useEffect, useState } from "react";
import { getSupabaseFileUrl, getUserImageSrc } from "@/app/api/image/route";
import { convertToDate, formatTime } from "@/utils/formatTime";
import useAuth from "@/hooks/useAuth";
import { addComment, deleteComment, getPostById } from "@/app/api/post/route";
import { toast } from "react-toastify";
import { getUserData } from "@/app/api/user/route";
import { supabase } from "@/lib/supabase";

interface Comment {
  id: number;
  postId: string;
  content: string;
  created_at: string;
  isLiked: boolean;
  user?: {
    id: string;
    name: string;
    nick_name: string;
    avatar?: string | null;
  };
}

interface PostModalProps {
  isOpen: boolean;
  onClose: () => void;
  postId: number;
}

interface PostDetail {
  id: number;
  content: string;
  created_at: string;
  file?: string | null;
  original_name?: string | null;
  user?: {
    id: string;
    name: string;
    nick_name: string;
    avatar?: string | null;
  };
}

export function PostModal({ isOpen, onClose, postId }: PostModalProps) {
  const { user } = useAuth();
  const [postDetail, setPostDetail] = useState<PostDetail>();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNewComment = async (payload: any) => {
    if (payload.new) {
      let newComment = { ...payload.new };
      let res = await getUserData(newComment.userId);
      newComment.user = res.success ? res.data : {};

      // Update cả hai state
      setComments((prevComments) => [newComment, ...prevComments]);
      setPostDetail((prevPost: any) => ({
        ...prevPost,
        comments: [newComment, ...(prevPost?.comments || [])],
      }));
    }
  };

  useEffect(() => {
    let commentChannel = supabase
      .channel("comments")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "comments",
          filter: `postId=eq.${postId}`,
        },
        handleNewComment
      )
      .subscribe();

    fetchPostDetail();

    return () => {
      supabase.removeChannel(commentChannel);
    };
  }, []);

  const fetchPostDetail = async () => {
    if (!postId) return;
    setLoading(true);
    let res = await getPostById(postId);
    if (res.success) {
      setPostDetail(res.data); // Lưu postDetail
      setComments(res.data.comments); // Lưu danh sách bình luận
    } else {
      toast.error("Không thể tải bài viết", { autoClose: 1000 });
      onClose();
    }
    setLoading(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    let data = {
      userId: user?.id,
      postId: postDetail?.id,
      content: newComment,
    };

    setLoading(true);
    let res = await addComment(data);
    if (res.success) {
      setNewComment("");
      toast.success("Bình luận đã được thêm", { autoClose: 1000 });
    }
    setLoading(false);
  };

  const handleDeleteComment = async (commentId: number) => {
    setLoading(true);
    let res = await deleteComment(commentId);
    if (res.success) {
      setComments((prevComments) =>
        prevComments.filter((comment) => comment.id !== commentId)
      );
      toast.success("Bình luận đã bị xóa", { autoClose: 1000 });
    } else {
      toast.error("Không thể xóa bình luận", { autoClose: 1000 });
    }
    setLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddComment();
    }
  };

  const handleLikeComment = (commentId: number) => {
    setComments(
      comments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
            }
          : comment
      )
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="xl:max-w-6xl xl:h-[80vh] lg:max-w-5xl lg:h-[70vh] md:max-w-4xl md:h-[60vh] sm:max-w-2xl sm:h-[60vh] max-w-xl h-[60vh] p-0 overflow-hidden">
        <DialogHeader className="hidden">
          <DialogTitle className="hidden">Chi tiết</DialogTitle>
        </DialogHeader>
        <div className="flex h-full">
          {/* Post content */}
          <div className="flex-1 flex justify-center items-center bg-gray-50">
            {postDetail?.file &&
              (() => {
                const fileUrl = getSupabaseFileUrl(postDetail.file);
                const ext = postDetail.file.split(".").pop()?.toLowerCase();

                if (!fileUrl) return null;

                if (["png", "jpg", "jpeg", "gif"].includes(ext!)) {
                  return (
                    <img
                      src={fileUrl}
                      alt="Post Image"
                      className="w-full h-auto max-h-full object-cover"
                    />
                  );
                }

                if (["mp4", "webm", "ogg"].includes(ext!)) {
                  return (
                    <video controls className="w-full max-h-160">
                      <source src={fileUrl} type={`video/${ext}`} />
                      Trình duyệt không hỗ trợ video.
                    </video>
                  );
                }

                // Các loại file khác (pdf, docx, xlsx...)
                return (
                  <div className="flex items-center space-x-3 p-3 border rounded-md bg-gray-50">
                    <span className="text-2xl">📄</span>
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {postDetail?.original_name}
                    </a>
                  </div>
                );
              })()}
            {!postDetail?.file && (
              <div className="p-4">
                <p className="text-sm text-gray-500">{postDetail?.content}</p>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="w-[450px] border-l flex flex-col">
            {/* Header */}
            <DialogHeader className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={getUserImageSrc(postDetail?.user?.avatar)}
                  />
                </Avatar>
                <span className="font-semibold text-sm">
                  {postDetail?.user?.nick_name}
                </span>
              </div>
            </DialogHeader>

            {/* Caption */}
            <div className="p-4 border-b">
              <div className="flex items-start space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={getUserImageSrc(postDetail?.user?.avatar)}
                  />
                </Avatar>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">
                      {postDetail?.user?.nick_name}
                    </span>{" "}
                    {postDetail?.content}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {convertToDate(postDetail?.created_at)}{" "}
                    {formatTime(postDetail?.created_at)}
                  </p>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="flex items-start space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={getUserImageSrc(comment.user?.avatar)} />
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {comment.user?.nick_name}
                      </span>{" "}
                      <span className="text-xs text-gray-500 ml-2">
                        {convertToDate(comment.created_at)}{" "}
                        {formatTime(comment.created_at)}
                      </span>
                    </p>
                    <div className="mt-1 break-all whitespace-pre-wrap text-sm">
                      {comment.content}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 mt-2 cursor-pointer"
                    onClick={() => handleLikeComment(comment.id)}
                  >
                    <Heart
                      className={`h-3 w-3 ${
                        comment.isLiked
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }`}
                    />
                  </Button>
                  {/* Nút xóa bình luận */}
                  {(postDetail?.user?.id === user?.id ||
                    comment.user?.id === user?.id) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 mt-2 cursor-pointer"
                      onClick={() => handleDeleteComment(comment.id)}
                    >
                      <span className="text-sm">Xóa</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>

            {/* Add comment */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-3">
                <Input
                  placeholder="Thêm bình luận..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-1 focus-visible:ring-0 text-sm"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="text-blue-500 hover:text-blue-600 disabled:text-gray-300"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

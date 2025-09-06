"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { CommentModal } from "./CommentModal";
import { get } from "http";
import { getSupabaseFileUrl } from "@/app/api/image/route";

interface PostCardProps {
  post: any;
}

export function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  console.log("POST", post);

  return (
    <>
      <Card className="border-0 shadow-sm mb-6 bg-white sm:max-w-full max-w-sm">
        {/* Post Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={post?.user?.avatar} />
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {post?.user?.nick_name}
              </p>
              <p className="text-xs text-gray-500">{post?.created_at}</p>
            </div>
            <Badge
              variant="secondary"
              className="text-xs bg-orange-100 text-orange-800"
            >
              {post?.user?.name}
            </Badge>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        {/* Post Content */}
        <CardContent className="px-4 pb-4">
          <div className="space-y-4">
            {/* Image */}
            {post?.file && (
              <img
                src={getSupabaseFileUrl(post?.file) ?? undefined}
                alt="Post Image"
                className="w-full h-auto max-h-96 object-cover rounded-md"
              />
            )}

            {/* Caption */}
            <div>
              <p className="text-sm text-gray-900">
                <span className="font-semibold">{post?.user?.nick_name}</span>{" "}
                {post?.content}
              </p>
            </div>
          </div>
        </CardContent>

        {/* Post Actions */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className="hover:bg-gray-100"
              >
                <Heart
                  className={`h-6 w-6 ${
                    isLiked ? "fill-red-500 text-red-500" : "text-gray-700"
                  }`}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCommentModalOpen(true)}
                className="hover:bg-gray-100"
              >
                <MessageCircle className="h-6 w-6 text-gray-700" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                <Send className="h-6 w-6 text-gray-700" />
              </Button>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSaved(!isSaved)}
              className="hover:bg-gray-100"
            >
              <Bookmark
                className={`h-6 w-6 ${
                  isSaved ? "fill-gray-900 text-gray-900" : "text-gray-700"
                }`}
              />
            </Button>
          </div>

          {/* Likes and Comments */}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900">likes</p>
            <button
              onClick={() => setIsCommentModalOpen(true)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              View all comments
            </button>
          </div>
        </div>
      </Card>

      <CommentModal
        isOpen={isCommentModalOpen}
        onClose={() => setIsCommentModalOpen(false)}
        post={post}
      />
    </>
  );
}

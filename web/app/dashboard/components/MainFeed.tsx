"use client";

import useAuth from "@/hooks/useAuth";
import { PostCard } from "./PostCard";
import { useEffect, useState, useRef } from "react";
import { fetchPosts } from "@/app/api/post/route";
import { supabase } from "@/lib/supabase";
import { getUserData } from "@/app/api/user/route";

interface Post {
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

export function MainFeed() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPost, setLoadingPost] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const limit = 10;
  const isInitialLoad = useRef(true);

  const handlePostEvent = async (payload: any) => {
    console.log("Real-time payload:", payload);
    if (payload.eventType === "INSERT" && payload?.new?.id) {
      let newPost = { ...payload.new };
      let res = await getUserData(newPost.userId);
      newPost.postLikes = [];
      newPost.comments = [{ count: 0 }];
      newPost.user = res.success ? res.data : {};
      setPosts((prevPosts) => [newPost, ...prevPosts]);
      setHasMorePosts(true);
    }
  };

  useEffect(() => {
    if (loading || !user?.id) return;

    if (isInitialLoad.current) {
      loadInitialPosts();
      isInitialLoad.current = false;
    }
  }, [loading, user?.id]);

  const loadInitialPosts = async () => {
    setLoadingPost(true);
    const res = await fetchPosts(user?.id, limit, 0);
    if (res.success) {
      setPosts(res.data);
      setOffset(limit);
      setHasMorePosts(res.data.length === limit);
    }
    setLoadingPost(false);
  };

  const loadMorePosts = async () => {
    setLoadingPost(true);
    const res = await fetchPosts(user?.id, limit, offset);
    if (res.success) {
      setPosts((prevPosts) => [...prevPosts, ...res.data]);
      setOffset((prevOffset) => prevOffset + limit);
      setHasMorePosts(res.data.length === limit);
    }
    setLoadingPost(false);
  };

  useEffect(() => {
    const postChannel = supabase
      .channel("posts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        handlePostEvent
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postChannel);
    };
  }, []);

  return (
    <div className="space-y-0">
      {posts.map((post) => (
        <PostCard key={post?.id} post={post} />
      ))}
      {loadingPost && <p className="text-center text-gray-500">Đang tải...</p>}
      {posts.length === 0 && !loadingPost && (
        <p className="text-center text-gray-500">Chưa có bài viết nào</p>
      )}
      {posts.length > 0 && !loadingPost && hasMorePosts && (
        <div className="text-center mt-4">
          <button
            onClick={loadMorePosts}
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white hover:text-white rounded-full p-6 text-[16px] cursor-pointer"
            disabled={loadingPost}
          >
            Tải thêm
          </button>
        </div>
      )}
      {posts.length > 0 && !loadingPost && !hasMorePosts && (
        <div className="text-center mt-4 text-gray-500">Không còn bài viết</div>
      )}
    </div>
  );
}

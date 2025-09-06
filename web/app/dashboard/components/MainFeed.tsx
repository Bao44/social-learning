"use client";

import useAuth from "@/hooks/useAuth";
import { PostCard } from "./PostCard";
import { useEffect, useState } from "react";
import { fetchPosts } from "@/app/api/post/route";

interface Post {
  id: string;
  post: any;
}

var limit = 0;

export function MainFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    limit += 10;

    let res = await fetchPosts(limit, user?.id);
    if (res.success) {
      setPosts(res.data);
    }
  };

  console.log("POSTS",posts)

  return (
    <div className="space-y-0">
      {posts.map((post) => (
        <PostCard key={post?.id} post={post} />
      ))}
    </div>
  );
}

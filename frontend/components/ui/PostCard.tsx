"use client";

import { useState } from "react";
import { Post } from "@/types";
import CommentSection from "@/components/ui/CommentSection";
import {PostHeader} from "@/components/ui/PostHeader";
import {usePostActions} from "@/context/usePost";

export default function PostCard({ post }: { post: Post }) {
  const { isLiked, likes, isFollowing, toggleFollow, toggleLike } = usePostActions(post);
  const [showComments, setShowComments] = useState(false);

  return (
    <div className="card p-6 transition-all duration-300 hover:border-rippl-200">
      <PostHeader username={post.username} date={new Date(post.date).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short' })} isFollowing={isFollowing || false} onToggleFollow={toggleFollow} />

      <div className="mb-6">
        <p className="text-stone-700 text-sm leading-relaxed">{post.content}</p>
      </div>

      <div className="pt-4 border-t border-stone-100 flex items-center gap-4">
        <button onClick={toggleLike} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium ${isLiked ? 'bg-rippl-50 text-rippl-600' : 'text-stone-500'}`}>
          {isLiked ? '💜' : '🤍'} {likes}
        </button>
        <button onClick={() => setShowComments(!showComments)} className="text-stone-500 text-sm flex items-center gap-2">
          💬 {post.comments?.length || 0}
        </button>
      </div>

      {showComments && <CommentSection post={post} />}
    </div>
  );
}
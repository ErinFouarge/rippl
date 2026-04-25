"use client";

import {Post} from "@/types";
import {postService} from "@/lib/services/posts.service";
import {useState} from "react";
import {toast} from "sonner";
import {useMutation, useQueryClient} from "@tanstack/react-query";

export default function PostCard({ post }: { post: Post }) {
  const [likes, setLikes] = useState(post.likes);
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [isLoading, setIsLoading] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  const queryClient = useQueryClient();

  const commentMutation = useMutation({
    mutationFn: (content: string) => postService.comment(post.id, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setNewComment("");
      toast.success("Commentaire ajouté !");
    },
    onError: () => {
      toast.error("Échec de l'envoi du commentaire.");
    }
  });

  const toggleLike = async () => {
    setIsLoading(true);
    try {
      const action = isLiked ? postService.unlike : postService.like;
      setIsLiked(!isLiked);
      setLikes(prev => isLiked ? prev - 1 : prev + 1);
      await action(post.id);
      queryClient.invalidateQueries({ queryKey: ['topPosts'] });
    } catch {
      setIsLiked(isLiked);
      setLikes(likes);
      toast.error("Oups ! Échec du like.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleComment = () => {
    if (!newComment.trim()) return;
    commentMutation.mutate(newComment);
  };

  return (
    <div className="card p-6 transition-all duration-300 hover:border-rippl-200">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-rippl-100 text-rippl-600 rounded-2xl flex items-center justify-center font-bold text-xl shrink-0">
          {post.username?.[0].toUpperCase() || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-stone-900 truncate">{post.username}</h4>
            <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              {post.date ? new Date(post.date).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short' }) : "NOW"}
            </span>
          </div>
          <p className="text-xs font-medium text-rippl-600">@{post.username}</p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-stone-700 font-normal leading-relaxed text-sm">{post.content}</p>
      </div>

      <div className="pt-4 border-t border-stone-100 flex items-center gap-4">
        <button
          onClick={toggleLike}
          disabled={isLoading}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${isLiked ? 'bg-rippl-50 text-rippl-600' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'}`}
        >
          <span>{isLiked ? '💜' : '🤍'}</span>
          {likes}
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all text-sm font-medium ${showComments ? 'bg-stone-100 text-stone-900' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-900'}`}
        >
          <span>💬</span>
          {post.comments?.length || 0}
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 ...">
          <div className="flex gap-2 mb-6">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Écrire un commentaire..."
              className="..."
            />
            <button
              onClick={handleComment}
              disabled={commentMutation.isPending}
              className="..."
            >
              {commentMutation.isPending ? "Envoi..." : "Envoyer"}
            </button>
          </div>

          <div className="space-y-4">
            {post.comments && post.comments.length > 0 ? (
              post.comments.map((comment, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-[10px] font-bold text-stone-500">
                    {comment.username?.[0].toUpperCase()}
                  </div>
                  <div className="flex-1 bg-stone-50 p-3 rounded-2xl rounded-tl-none">
                    <p className="text-[10px] font-bold text-rippl-600 uppercase">@{comment.username}</p>
                    <p className="text-xs text-stone-700 mt-1">{comment.content}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-xs text-stone-400 italic py-2">Aucun commentaire</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
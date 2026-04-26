"use client"

import {toast} from "sonner";
import {postService} from "@/lib/services/posts.service";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import {Post} from "@/types";

export default function CommentSection({ post }: { post: Post }) {
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

	const handleComment = () => {
		if (!newComment.trim()) return;
		commentMutation.mutate(newComment);
	};

	return (
		<div className="mt-4 pt-4 border-t border-stone-100">
			<div className="flex gap-2 mb-6">
				<input
					value={newComment}
					onChange={(e) => setNewComment(e.target.value)}
					placeholder="Écrire un commentaire..."
					className="flex-1 px-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-rippl-500"
				/>
				<button
					onClick={handleComment}
					disabled={commentMutation.isPending}
					className="px-4 py-2 bg-rippl-600 text-white rounded-xl text-sm font-bold hover:bg-rippl-700 disabled:opacity-50"
				>
					{commentMutation.isPending ? "..." : "Envoyer"}
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
	);
}
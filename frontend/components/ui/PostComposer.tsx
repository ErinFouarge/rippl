"use client";

import { useState } from "react";
import { postService } from "@/lib/services/posts.service";
import { toast } from "sonner";

export default function PostComposer({ onPostCreated }: { onPostCreated: () => void }) {
	const [content, setContent] = useState("");
	const [loading, setLoading] = useState(false);

	const handlePost = async () => {
		if (!content.trim()) return;
		setLoading(true);
		try {
			await postService.create(content);
			setContent("");
			onPostCreated();
			toast.success("Rippl publié !");
		} catch {
			toast.error("Erreur lors de la publication");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="card p-6">
			<div className="flex items-center gap-3 mb-4">
				<div className="w-10 h-10 bg-rippl-50 text-rippl-600 rounded-xl flex items-center justify-center font-black text-lg">
					R
				</div>
				<div>
					<h3 className="text-sm font-bold text-stone-900">
						Nouveau Rippl
					</h3>
					<p className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
						Partagez vos idées
					</p>
				</div>
			</div>

			<textarea
				className="w-full min-h-30 p-4 bg-stone-50 border border-stone-200 rounded-xl font-medium text-stone-800 text-sm focus:outline-none focus:border-rippl-600 focus:ring-1 focus:ring-rippl-600/20 placeholder:text-stone-400 resize-none transition-all"
				placeholder="Quoi de neuf aujourd'hui ?"
				value={content}
				onChange={(e) => setContent(e.target.value)}
				disabled={loading}
			/>

			<div className="flex justify-end mt-4">
				<button
					onClick={handlePost}
					disabled={loading || !content.trim()}
					className="rippl-btn-primary w-auto px-6 text-xs font-bold uppercase tracking-wider"
				>
					{loading ? "Publication..." : "Publier"}
				</button>
			</div>
		</div>
	);
}
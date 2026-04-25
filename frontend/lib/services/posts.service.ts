import api from "../api-client";
import type { Post } from "@/types";

export const postService = {
	getFeed: async (): Promise<Post[]> => {
		const res = await api.get<Post[]>("/posts");
		return res.data;
	},

	create: async (content: string): Promise<Post> => {
		const res = await api.post<Post>("/posts/create", { content });
		return res.data;
	},

	like: async (postId: string): Promise<void> => {
		await api.post(`/posts/${postId}/vote`, { action: "like"});
	},

	unlike: async (postId: string): Promise<void> => {
		await api.post(`/posts/${postId}/vote`, { action: "dislike"});
	},

	comment: async (postId: string, content: string): Promise<Comment> => {
		return await api.post(`/posts/${postId}/comment`, { content });
	},

	getTop10: async (): Promise<Post[]> => {
		const res = await api.get<Post[]>("/posts/top10");
		return res.data;
	},
};
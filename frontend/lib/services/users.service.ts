import api from "../api-client";
import type { SuggestedUser } from "@/types";

export const userService = {
	getSuggested: async (): Promise<SuggestedUser[]> => {
		const res = await api.get<SuggestedUser[]>("/users/suggested");
		return res.data;
	},

	follow: async (username: string): Promise<void> => {
		await api.post(`/users/follow`, { "username": username });
	},

	unfollow: async (username: string): Promise<void> => {
		await api.post(`/users/unfollow`, { "username": username });
	},
};
import api from "../api-client";
import type { AuthResponse, LoginPayload, RegisterPayload } from "@/types";

export const authService = {
	login: async (data: LoginPayload): Promise<AuthResponse> => {
		const res = await api.post<AuthResponse>("/auth/login", data);
		return res.data;
	},

	register: async (data: RegisterPayload): Promise<AuthResponse> => {
		const res = await api.post<AuthResponse>("/auth/register", data);
		return res.data;
	},

	getCurrentUser: async (): Promise<AuthResponse> => {
		const response = await api.get("/auth/me");
		return response.data;
	},

	logout: async (): Promise<void> => {
		await api.post("/auth/logout");
	},
};
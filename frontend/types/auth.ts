import { User } from "./users";

export type AuthResponse = User;

export type LoginPayload = {
	email: string;
	password: string;
};

export type RegisterPayload = LoginPayload & {
	username: string;
};
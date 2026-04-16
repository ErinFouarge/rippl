export type User = {
	id: string;
	username: string;
	email: string;
};

export type SuggestedUser = Pick<User, "id" | "username"> & {
	following: boolean;
};
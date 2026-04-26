export type Post = {
	id: string;
	username: string;
	date: Date;
	content: string;
	likes: number;
	is_liked?: boolean;
	is_followed?: boolean;
	comments?: Comment[];
};

export type Comment = {
	id: string;
	username: string;
	content: string;
	created_at: string;
};

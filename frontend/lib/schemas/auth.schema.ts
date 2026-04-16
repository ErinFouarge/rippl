import {z} from "zod";

export const registerSchema = z.object({
	username: z
		.string()
		.min(3, { message: "Le pseudo doit faire au moins 3 caractères" })
		.regex(/^[a-zA-Z0-9_]+$/, {
			message: "Uniquement lettres, chiffres et underscores (_)",
		}),
	email: z
		.email({ message: "Format d'email invalide" })
		.min(1, { message: "L'email est requis" }),
	password: z
		.string()
		.min(8, { message: "Le mot de passe doit faire au moins 8 caractères" }),
});

export const loginSchema = z.object({
	email: z
		.email({ message: "Format d'email invalide" })
		.min(1, { message: "L'email est requis" }),
	password: z
		.string()
		.min(8, { message: "Le mot de passe doit faire au moins 8 caractères" }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export type RegisterFormValues = z.infer<typeof registerSchema>;
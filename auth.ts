import type { User } from "@/app/lib/definitions";
import { sql } from "@vercel/postgres";
import bcrypt from "bcrypt";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { z } from "zod";
import { authConfig } from "./auth.config";

async function getUser(email: string): Promise<User | undefined> {
	try {
		const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
		return user.rows[0];
	} catch (error) {
		console.error("Failed to fetch user:", error);
		throw new Error("Failed to fetch user.");
	}
}

export const { handlers, auth, signIn, signOut } = NextAuth({
	...authConfig,
	providers: [
		Google,
		Credentials({
			async authorize(credentials) {
				const parsedCredentials = z
					.object({
						email: z.string().email(),
						password: z.string().min(6),
					})
					.safeParse(credentials);

				if (parsedCredentials.success) {
					const { email, password } = parsedCredentials.data;
					const user = await getUser(email);
					if (!user) return null;
					// `bcrypt.compare`でパスワードが一致するかチェック
					const passwordsMatch = await bcrypt.compare(password, user.password);
					// パスワードが一致した場合はユーザーを返却
					if (passwordsMatch) return user;
				}
				console.log("Invalid credentials");
				return null;
			},
		}),
	],
});

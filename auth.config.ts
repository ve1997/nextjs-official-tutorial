import type { NextAuthConfig } from "next-auth";

export const authConfig = {
	providers: [],
	pages: {
		/**
		 * Redirect to a custom login page instead of the NextAuth default page.
		 * NextAuthのデフォルトページではなくカスタムログインページにリダイレクトする
		 */
		signIn: "/login",
	},
} satisfies NextAuthConfig;

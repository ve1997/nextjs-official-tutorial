import type { NextAuthConfig } from "next-auth";

export const authConfig = {
	pages: {
		/**
		 * Redirect to a custom login page instead of the NextAuth default page.
		 * NextAuthのデフォルトページではなくカスタムログインページにリダイレクトする
		 */
		signIn: "/login",
	},
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
			if (isOnDashboard) {
				if (isLoggedIn) return true;
				/**
				 * Redirect unauthenticated users to login page
				 * 認証されていないユーザーをログインページにリダイレクトする。
				 */
				return false;
			} else if (isLoggedIn) {
				return Response.redirect(new URL("/dashboard", nextUrl));
			}
			return true;
		},
	},
	providers: [],
} satisfies NextAuthConfig;

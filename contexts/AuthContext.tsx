"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface User {
	name: string;
	email: string;
}

interface AuthContextValue {
	isLoggedIn: boolean;
	user: User | null;
	login: (user: User) => void;
	logout: () => void;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);

	const login = useCallback((userData: User) => {
		setUser(userData);
	}, []);

	const logout = useCallback(() => {
		setUser(null);
	}, []);

	const value = useMemo<AuthContextValue>(
		() => ({
			isLoggedIn: user !== null,
			user,
			login,
			logout,
		}),
		[user, login, logout]
	);

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}

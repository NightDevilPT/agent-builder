"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";

// User interface
export interface User {
	id: string;
	name: string;
	username: string;
	email: string;
	avatar?: string;
	createdAt?: string;
	updatedAt?: string;
}

// Context value interface
interface UserContextType {
	user: User | null;
	isAuthenticated: boolean;
	login: (userData: User) => void;
	signup: (userData: User) => void;
	logout: () => void;
	updateUser: (userData: Partial<User>) => void;
	loading: boolean;
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider props interface
interface UserProviderProps {
	children: ReactNode;
}

// Dummy user data for nightdevilpt
const dummyUser: User = {
	id: "12345",
	name: "Night Devil",
	username: "nightdevilpt",
	email: "nightdevilpt@example.com",
	avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=nightdevilpt",
	createdAt: "2024-01-01T00:00:00Z",
	updatedAt: "2024-01-01T00:00:00Z",
};

export function UserProvider({ children }: UserProviderProps) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// Check for existing user session on mount
	useEffect(() => {
		const checkAuthStatus = () => {
			try {
				// Check if user data exists in localStorage
				const storedUser = localStorage.getItem("user");
				const token = localStorage.getItem("authToken");

				if (storedUser && token) {
					const userData = JSON.parse(storedUser);
					setUser(userData);
					setIsAuthenticated(true);
				} else {
					// Load dummy data if no user found
					loadDummyUser();
				}
			} catch (error) {
				console.error("Error checking auth status:", error);
				// Clear invalid data
				localStorage.removeItem("user");
				localStorage.removeItem("authToken");
				// Load dummy data on error
				loadDummyUser();
			} finally {
				setLoading(false);
			}
		};

		const loadDummyUser = () => {
			setUser(dummyUser);
			setIsAuthenticated(true);
			// Store in localStorage
			localStorage.setItem("user", JSON.stringify(dummyUser));
			localStorage.setItem("authToken", "dummy-token");
		};

		checkAuthStatus();
	}, []);

	// Login function
	const login = (userData: User) => {
		try {
			setUser(userData);
			setIsAuthenticated(true);
			// Store in localStorage for persistence
			localStorage.setItem("user", JSON.stringify(userData));
			// In a real app, you'd also store the auth token
			localStorage.setItem("authToken", "mock-token"); // Replace with actual token
		} catch (error) {
			console.error("Login error:", error);
		}
	};

	// Signup function
	const signup = (userData: User) => {
		try {
			setUser(userData);
			setIsAuthenticated(true);
			// Store in localStorage for persistence
			localStorage.setItem("user", JSON.stringify(userData));
			// In a real app, you'd also store the auth token
			localStorage.setItem("authToken", "mock-token"); // Replace with actual token
		} catch (error) {
			console.error("Signup error:", error);
		}
	};

	// Logout function
	const logout = () => {
		try {
			setUser(null);
			setIsAuthenticated(false);
			// Clear localStorage
			localStorage.removeItem("user");
			localStorage.removeItem("authToken");
		} catch (error) {
			console.error("Logout error:", error);
		}
	};

	// Update user function
	const updateUser = (userData: Partial<User>) => {
		if (!user) return;

		try {
			const updatedUser = { ...user, ...userData };
			setUser(updatedUser);
			// Update localStorage
			localStorage.setItem("user", JSON.stringify(updatedUser));
		} catch (error) {
			console.error("Update user error:", error);
		}
	};

	const value: UserContextType = {
		user,
		isAuthenticated,
		login,
		signup,
		logout,
		updateUser,
		loading,
	};

	return (
		<UserContext.Provider value={value}>{children}</UserContext.Provider>
	);
}

// Custom hook to use user context
export function useUser() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUser must be used within a UserProvider");
	}
	return context;
}

// Export the context for direct access if needed
export { UserContext };

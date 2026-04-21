import { createContext, useState } from "react";

export const AuthContext = createContext(null);

// Helper to get token from localStorage
export const getAuthToken = () => {
    const rawToken = localStorage.getItem("auth-token");
    if (!rawToken) return null;
    try {
        // Try to parse if it's stored as a JSON string
        const parsed = JSON.parse(rawToken);
        return parsed || null;
    } catch {
        // Fallback to raw string if parsing fails
        return rawToken;
    }
};

// Helper to build authenticated fetch headers
export const authHeaders = () => {
    const token = getAuthToken();
    return {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {})
    };
};

export const AuthContextProvider = ({ children }) => {
    const [isAuthenticate, setIsAuthenticate] = useState(false);
    const [user, setUser] = useState({});
    const contextValue = { isAuthenticate, setIsAuthenticate, user, setUser };
    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
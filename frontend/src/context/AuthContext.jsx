import { createContext, useState } from "react";

export const AuthContext = createContext(null);

// Helper to get token from localStorage
export const getAuthToken = () => {
    try {
        return JSON.parse(localStorage.getItem("auth-token")) || null;
    } catch {
        return null;
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
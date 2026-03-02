import { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true); // prevent flash of redirect

    // Hydrate from localStorage on first mount
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem("user");
            const storedToken = localStorage.getItem("token");
            if (storedUser && storedToken) {
                setUser(JSON.parse(storedUser));
                setToken(storedToken);
            }
        } catch {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData, accessToken) => {
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", accessToken);
        setUser(userData);
        setToken(accessToken);
    };

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Convenience hook
export const useAuth = () => useContext(AuthContext);

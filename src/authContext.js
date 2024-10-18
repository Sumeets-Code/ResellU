import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null); // Initial user state is null

    const login = (userData) => {
        setIsAuthenticated(true);
        setUser(userData); // Set the user data
    };
    
    const logout = () => {
        setIsAuthenticated(false);
        setUser(null); // Clear the user data
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, setIsAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
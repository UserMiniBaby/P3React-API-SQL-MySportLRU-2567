import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const token = localStorage.getItem("token")

    const [user, setUser] = useState(null);
    const [loggedIn, setLoggedIn] = useState(token ? true : false);

    // ฟังก์ชันล็อกอิน
    const saveToken = (token) => {
        localStorage.setItem("token", token);
        setLoggedIn(true);
    };

    const saveUser = (userData) => {
        setUser(userData);
    }

    // ฟังก์ชันออกจากระบบ
    const logout = () => {
        console.log("TEST")
        localStorage.removeItem("token");
        setLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, saveToken, saveUser, logout, loggedIn }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

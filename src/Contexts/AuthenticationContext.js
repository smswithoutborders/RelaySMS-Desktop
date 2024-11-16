import React, { createContext, useContext, useState } from "react";

const AuthenticationContext = createContext();

export const useAuth = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const [userData, setUserData] = useState(
    JSON.parse(localStorage.getItem("userData")) || null
  );

  const generateToken = () => Math.random().toString(36).substring(2);

  const setUserSession = (newData) => {
    const token = userData?.token || generateToken();
    const updatedData = { ...userData, ...newData, token };
    localStorage.setItem("userData", JSON.stringify(updatedData));
    setUserData(updatedData);
  };

  const clearUserSession = (onLogoutCallback) => {
    localStorage.removeItem("userData");
    setUserData(null);
    if (onLogoutCallback) onLogoutCallback();
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("userData");
  };

  const logout = (onLogoutCallback) => {
    clearUserSession(onLogoutCallback);
  };

  return (
    <AuthenticationContext.Provider
      value={{ userData, setUserSession, isAuthenticated, logout }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

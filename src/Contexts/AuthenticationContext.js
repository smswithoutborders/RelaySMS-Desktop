import React, { createContext, useContext, useState } from "react";
import { Navigate } from "react-router-dom";
import { UserController } from "../controllers";

const AuthenticationContext = createContext();

export const useAuth = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const userController = new UserController();

  const [userData, setUserData] = useState(userController.getUserData());
  console.log(userData)

  const setUserSession = (newUserData) => {
    const currentUserData = userController.getUserData();
    const updatedData = { ...currentUserData, ...newUserData };
    userController.setUserData(updatedData);
    setUserData(updatedData);
  };

  const clearUserSession = (onLogoutCallback) => {
    userController.clearUserData();
    setUserData(null);
    if (onLogoutCallback) onLogoutCallback();
  };

  const isAuthenticated = () => {
    return !!userData;
  };

  const logout = (onLogoutCallback) => {
    clearUserSession(onLogoutCallback);
  };

  const AuthRequired = ({ children }) => {
    return isAuthenticated() ? (
      children
    ) : (
      <Navigate to="/login" replace={true} />
    );
  };

  return (
    <AuthenticationContext.Provider
      value={{
        userData,
        setUserSession,
        isAuthenticated,
        logout,
        AuthRequired,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

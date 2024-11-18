import React, { createContext, useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserController } from "../controllers";

const AuthenticationContext = createContext();

export const useAuth = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const userController = new UserController();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await userController.getAllData();
      console.log(">>>>>>", data);
      setUserData(data.length === 0 ? null : data[0]);
    };

    fetchUserData();
  }, []);

  const clearUserSession = async (onLogoutCallback) => {
    await userController.deleteTable();
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
        isAuthenticated,
        logout,
        AuthRequired,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

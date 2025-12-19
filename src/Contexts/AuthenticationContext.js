import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { UserController } from "../controllers";

const AuthenticationContext = createContext();

export const useAuth = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const userController = useMemo(() => new UserController(), []);
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    const data = await userController.getAllData();

    if (!data || !Array.isArray(data)) {
      setUserData(null);
      return;
    }

    const userDataMap = data.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {});

    setUserData(Object.keys(userDataMap).length === 0 ? null : userDataMap);
  };

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userController]);

  const clearUserSession = async (onLogoutCallback) => {
    await userController.deleteTable();
    setUserData(null);
    if (onLogoutCallback) onLogoutCallback();
  };

  const refetchUserData = async () => {
    await fetchUserData();
  };

  const isAuthenticated = () => {
    return !!userData;
  };

  const hasLongLivedToken = () => {
    return userData?.longLivedToken !== undefined;
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
        hasLongLivedToken,
        logout,
        AuthRequired,
        refetchUserData,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

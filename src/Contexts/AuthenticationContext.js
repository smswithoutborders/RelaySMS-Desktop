import React, { createContext, useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { UserController, SettingsController } from "../controllers";

const AuthenticationContext = createContext();

export const useAuth = () => useContext(AuthenticationContext);

export const AuthenticationProvider = ({ children }) => {
  const userController = new UserController();
  const settingsController = new SettingsController();

  const [userData, setUserData] = useState(null);
  const [hasBridgeCode, setHasBridgeCode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await userController.getAllData();
      setUserData(data.length === 0 ? null : data[0]);
    };

    const fetchBridgeCode = async () => {
      const code = await settingsController.getData("preferences.otp.bridge");
      setHasBridgeCode(!!code);
    };

    fetchUserData();
    fetchBridgeCode();
  }, []);

  const clearUserSession = async (onLogoutCallback) => {
    await userController.deleteTable();
    setUserData(null);
    if (onLogoutCallback) onLogoutCallback();
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
        hasBridgeAuthorizationCode: hasBridgeCode,
        logout,
        AuthRequired,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};

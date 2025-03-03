import React, { createContext, useContext, useState } from "react";
export const LayoutContext = createContext();

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider = ({ children }) => {
  const [navigationPanel, setNavigationPanel] = useState(<></>);
  const [displayPanel, setDisplayPanel] = useState(<></>);

  return (
    <LayoutContext.Provider
      value={{
        navigationPanel,
        setNavigationPanel,
        displayPanel,
        setDisplayPanel,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

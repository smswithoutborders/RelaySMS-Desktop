import React, { createContext, useContext, useState } from "react";
export const LayoutContext = createContext();

export const useLayout = () => useContext(LayoutContext);

export const LayoutProvider = ({ children }) => {
  const [navigationPanel, setNavigationPanel] = useState(<></>);
  const [controlPanel, setControlPanel] = useState(<></>);
  const [displayPanel, setDisplayPanel] = useState(<></>);

  return (
    <LayoutContext.Provider
      value={{
        navigationPanel,
        setNavigationPanel,
        controlPanel,
        setControlPanel,
        displayPanel,
        setDisplayPanel,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};

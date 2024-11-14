import React, { createContext, useState } from "react";
import NavigationPanel from "../Components/NavigationPanel";
export const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
  const [navigationPanel, setNavigationPanel] = useState(<NavigationPanel />);
  const [controlPanel, setControlPanel] = useState(<>2</>);
  const [displayPanel, setDisplayPanel] = useState(<>3</>);

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

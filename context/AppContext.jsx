import React from "react";

import { appContext } from "./app-context";

const AppContext = ({ children, ...otherProps }) => {
  const toggleTheme = () => {
    otherProps.toggleTheme();
  };

  return (
    <appContext.Provider value={{ toggleTheme }}>
      {children}
    </appContext.Provider>
  );
};

export default AppContext;

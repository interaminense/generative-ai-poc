import React, { createContext, useContext, useReducer } from "react";

const initialState = {
  sidebarOpened: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "TOOGLE_SIDEBAR": {
      return {
        ...state,
        sidebarOpened: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

const AppContext = createContext(initialState);

export const AppContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

AppContext.displayName = "AppContext";

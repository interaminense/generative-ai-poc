import React from "react";
import { Sidebar } from "./components/Sidebar";
import { Chatbot } from "./components/chatbot/Chatbot";
import { ClayIconSpriteContext } from "@clayui/icon";
import { Header } from "./components/Header";
import { ClayModalProvider } from "@clayui/modal";
import { ClayTooltipProvider } from "@clayui/tooltip";
import { AppContextProvider, useAppContext } from "./AppContext";
import { TABLE } from "./utils/constants";

const spritemap = "/icons.svg";

function App() {
  const { state } = useAppContext();

  return (
    <div className="App">
      <Header />

      <Chatbot />

      {state.sidebarOpened && <Sidebar table={TABLE} />}
    </div>
  );
}

const Wrapper = () => (
  <AppContextProvider>
    <ClayIconSpriteContext.Provider value={spritemap}>
      <ClayTooltipProvider>
        <div>
          <ClayModalProvider>
            <App />
          </ClayModalProvider>
        </div>
      </ClayTooltipProvider>
    </ClayIconSpriteContext.Provider>
  </AppContextProvider>
);

export default Wrapper;

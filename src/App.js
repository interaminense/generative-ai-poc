import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Chatbot } from "./components/chatbot/Chatbot";
import { ClayIconSpriteContext } from "@clayui/icon";
import { Header } from "./components/Header";
import { ClayModalProvider } from "@clayui/modal";
import { ClayTooltipProvider } from "@clayui/tooltip";

const spritemap = "/icons.svg";

function App() {
  const [selectedTable, setSelectedTable] = useState(null);

  return (
    <div className="App">
      <ClayIconSpriteContext.Provider value={spritemap}>
        <ClayTooltipProvider>
          <div>
            <ClayModalProvider>
              <Header />
              <Chatbot onTableChange={setSelectedTable} />
              <Sidebar table={selectedTable} />
            </ClayModalProvider>
          </div>
        </ClayTooltipProvider>
      </ClayIconSpriteContext.Provider>
    </div>
  );
}

export default App;

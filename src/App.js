import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Chatbot } from "./components/Chatbot";
import { ClayIconSpriteContext } from "@clayui/icon";
import { Header } from "./components/Header";
import { ClayModalProvider } from "@clayui/modal";

const spritemap = "/icons.svg";

function App() {
  const [selectedTable, setSelectedTable] = useState(null);

  return (
    <div className="App">
      <ClayIconSpriteContext.Provider value={spritemap}>
        <ClayModalProvider>
          <Header />
          <Chatbot onTableChange={setSelectedTable} />
          <Sidebar table={selectedTable} />
        </ClayModalProvider>
      </ClayIconSpriteContext.Provider>
    </div>
  );
}

export default App;

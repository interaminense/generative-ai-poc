import React, { useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { Chatbot } from "./components/Chatbot";
import { ClayIconSpriteContext } from "@clayui/icon";
import { Header } from "./components/Header";

const spritemap = "/icons.svg";

function App() {
  const [selectedTable, setSelectedTable] = useState(null);

  return (
    <div className="App">
      <ClayIconSpriteContext.Provider value={spritemap}>
        <Header />
        <Chatbot onTableChange={setSelectedTable} />
        <Sidebar table={selectedTable} />
      </ClayIconSpriteContext.Provider>
    </div>
  );
}

export default App;

import { Sidebar } from "./components/Sidebar";
import { Chatbot } from "./components/Chatbot";
import React, { useState } from "react";
import { Provider } from "@clayui/core";

const spritemap = "/icons.svg";

function App() {
  const [selectedTableId, setSelectedTableId] = useState(null);

  return (
    <div className="App">
      <Provider spritemap={spritemap}>
        <Sidebar onChange={setSelectedTableId} />
        <Chatbot tableId={selectedTableId} />
      </Provider>
    </div>
  );
}

export default App;

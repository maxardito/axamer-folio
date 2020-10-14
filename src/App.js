import React from "react";
import Main from "./components/Main.js";
import { SelectedTownProvider } from "./contexts/SelectedTown.js"


function App() {
  return (
    <div className="App">
      <SelectedTownProvider>
        <Main />
      </SelectedTownProvider>
    </div>
  );
}

export default App;

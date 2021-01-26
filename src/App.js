import React from "react";
import Main from "./components/Main.js";
import { Route, BrowserRouter as Router } from "react-router-dom"
import Journeys from "./components/Journey/Journeys.json"

function App() {
    return (
        <Router>
            <div className="App">
                <Route path="/" exact component={JHC} />
                <Route path="/jhc-ds" exact component={JHC} />
                <Route path="/patchwork" exact component={Patchwork} />
            </div>
        </Router>
    );
}

const JHC = ({ metadata }) => {
    return (
        <Main metadata={Journeys.metadata[0]} />
    )
}

const Patchwork = ({ metadata }) => {
    return (
        <Main metadata={Journeys.metadata[1]} />
    )
}

export default App;

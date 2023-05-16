import { useState } from "react";
import "./App.css";
import Chessboard from "./components/Chessboard/Chessboard";

function App() {
    const [textVal, setTextVal] = useState("");
    // return (
    //     <div className="App">
    //         <Chessboard />
    //     </div>
    // );
    return (
        <div className="App">
            <input></input>
        </div>
    );
}

export default App;

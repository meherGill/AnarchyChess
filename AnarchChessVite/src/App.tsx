import { useState, createContext, useRef } from "react";
import Chessboard from "./components/Chessboard/Chessboard";
import ChessLogic from "./components/ChessLogic/ChessLogic";
import normalChessBoard from "@shared/chessboardConfigs";

export const ChessLogicContext = createContext<ChessLogic | null>(null);

function App() {
    return (
        <ChessLogicContext.Provider value={new ChessLogic(normalChessBoard)}>
            <div className="h-screen w-screen">
                <Chessboard />
            </div>
        </ChessLogicContext.Provider>
    );
}

export default App;

import { useState, createContext, useRef } from "react";
import Chessboard from "./components/Chessboard/Chessboard";
import ChessLogic from "./components/ChessLogic/ChessLogic";
import normalChessBoard, { configTest2 } from "@shared/chessboardConfigs";
import { ModalProvider } from "./shared/Contexts/ModalContext";

export const ChessLogicContext = createContext<ChessLogic | null>(null);

function App() {
    return (
        <ChessLogicContext.Provider value={new ChessLogic(configTest2)}>
            <ModalProvider>
                <div className="h-screen w-screen flex justify-center items-center">
                    <Chessboard />
                </div>
            </ModalProvider>
        </ChessLogicContext.Provider>
    );
}

export default App;

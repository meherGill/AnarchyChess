import React, { createContext } from "react";
import { ModalProvider } from "@shared/Contexts/ModalContext";
import TurnToPlayProvider from "./shared/Contexts/TurnToPlayContext";
import Chessboard from "./components/Chessboard/Chessboard";
import ChessLogic from "./components/ChessLogic/ChessLogic";
import normalChessBoard, { configTest2 } from "@shared/chessboardConfigs";
import TurnToPlayBanner from "./components/TurnToPlayBanner/TurnToPlayBanner";

export const ChessLogicContext = createContext<ChessLogic | null>(null);

function App() {
    return (
        <ChessLogicContext.Provider value={new ChessLogic(normalChessBoard)}>
            <TurnToPlayProvider>
                <ModalProvider>
                    <div className="h-screen w-screen grid grid-cols-[1fr,640px,1fr]">
                        <TurnToPlayBanner />
                        <Chessboard />
                    </div>
                </ModalProvider>
            </TurnToPlayProvider>
        </ChessLogicContext.Provider>
    );
}

export default App;

import React, { createContext, useContext, useState } from "react";
import { PlayerColor } from "@enums";
import { ChessLogicContext } from "@/App";
import ChessLogic from "@components/ChessLogic/ChessLogic";

export const TurnToPlayContext = React.createContext({
    turnToPlay: PlayerColor.white,
    toggleTurnToPlay: () => {},
});

export default ({ children }: { children: React.ReactNode }) => {
    const chessLogicValue = useContext(ChessLogicContext) as ChessLogic;
    const [turnToPlay, setTurnToPlay] = useState(chessLogicValue.turnToPlay);
    const toggleTurnToPlay = () => {
        setTurnToPlay(chessLogicValue.turnToPlay);
    };

    return (
        <TurnToPlayContext.Provider
            value={{
                turnToPlay: turnToPlay,
                toggleTurnToPlay: toggleTurnToPlay,
            }}
        >
            {children}
        </TurnToPlayContext.Provider>
    );
};

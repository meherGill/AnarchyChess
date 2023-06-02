import React, { useCallback, useContext, useRef, useState } from "react";
import { ChessLogicContext } from "../../App";
import ChessSquare from "./ChessSquare";
import { ChessSquareColor } from "@shared/enums";
import { ISquareCoordinate } from "../../shared/types";

const Chessboard = () => {
    const chessLogicValue = useContext(ChessLogicContext);
    const squareDropedOnRef = useRef<ISquareCoordinate | null>(null);
    const squareCoordFromRef = useRef<ISquareCoordinate | null>(null);

    const [toRender, setToRender] = useState(-1);

    const onPieceDragStartParentHandler = (row: number, column: number) => {
        squareCoordFromRef.current = { row: row, column: column };
    };

    const onPieceDragStopParentHandler = (row: number, column: number) => {
        const result = chessLogicValue!.playerMadeMove(
            squareCoordFromRef.current as ISquareCoordinate,
            squareDropedOnRef.current as ISquareCoordinate
        );
        if (result) {
            setToRender(toRender * -1);
        }
    };

    const displayChessBoard = () => {
        let arrToReturn = new Array(
            chessLogicValue!.currentBoard.length *
                chessLogicValue!.currentBoard[0].length
        );

        let indexCounter = 0;
        let startColor: ChessSquareColor;
        for (const [
            row,
            rowElement,
        ] of chessLogicValue!.currentBoard.entries()) {
            if (row % 2 === 0) {
                startColor = ChessSquareColor.light;
            } else {
                startColor = ChessSquareColor.dark;
            }

            let color: ChessSquareColor = startColor;
            for (const [column, piece] of rowElement.entries()) {
                arrToReturn[indexCounter] = (
                    <ChessSquare
                        squareColor={color}
                        row={row}
                        column={column}
                        key={`${row}_${column}`}
                        piece={piece}
                        passedOnDragStart={onPieceDragStartParentHandler}
                        passedOnDragStop={onPieceDragStopParentHandler}
                        ref={squareDropedOnRef}
                    />
                );
                if (color === ChessSquareColor.dark) {
                    color = ChessSquareColor.light;
                } else {
                    color = ChessSquareColor.dark;
                }
                indexCounter++;
            }
        }

        return arrToReturn;
    };

    return (
        <div className="w-fit h-fit right-1/2 translate-x-2/4 grid grid-cols-8 absolute">
            {displayChessBoard()}
        </div>
    );
};

export default React.memo(Chessboard);

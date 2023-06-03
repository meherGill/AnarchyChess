import React, { useContext, useState } from "react";
import { ChessLogicContext } from "../../App";
import ChessSquare from "./ChessSquare";
import { ChessSquareColor } from "@shared/enums";
import { DndContext, DragEndEvent } from "@dnd-kit/core";

const Chessboard = () => {
    const [moveDone, setMoveDone] = useState(-1);

    const chessLogicValue = useContext(ChessLogicContext);

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

    const onDragEndHandler = (e: DragEndEvent) => {
        const coordFrom = e.active.data.current?.squareCoord;
        const coordTo = e.over?.data.current?.squareCoord;
        if (coordFrom && coordTo) {
            //check if user input required
            // currently only in the case of pawn promotion

            const res = chessLogicValue?.playerMadeMove(coordFrom, coordTo);
            if (res) {
                console.log(chessLogicValue!.currentBoard);
                setMoveDone(moveDone * -1);
            }
        }
    };
    return (
        <DndContext onDragEnd={onDragEndHandler}>
            <div className="w-fit h-fit right-1/2 translate-x-2/4 grid grid-cols-8">
                {displayChessBoard()}
                {chessLogicValue!.mate ? (
                    <div className="absolute h-screen w-screen bg-slate-100">
                        <h1>Checkmate</h1>
                    </div>
                ) : (
                    ""
                )}
            </div>
        </DndContext>
    );
};

export default React.memo(Chessboard);

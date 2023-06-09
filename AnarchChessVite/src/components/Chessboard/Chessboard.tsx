import React, { useContext, useMemo, useRef, useState } from "react";
import "./Chessboard.css";
import { ChessLogicContext } from "@/App";
import ChessSquare from "./ChessSquare";
import {
    ChessSquareColor,
    MoveAction,
    MoveGenerationMessage,
} from "@shared/enums";
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { ISquareCoordinate } from "@shared/types";
import { ModalContext } from "@shared/Contexts/ModalContext";
import PromotionModal from "@shared/Modal/PromotionModal";

export const PieceClickContext = React.createContext(
    (pieceCoord: ISquareCoordinate) => {}
);

const Chessboard = () => {
    const [moveDone, setMoveDone] = useState(-1);
    const chessLogicValue = useContext(ChessLogicContext);

    let { openModal, closeModal } = React.useContext(ModalContext) as {
        closeModal: any;
        openModal: any;
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

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
                        // ref={refsById[row][column]}
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

    const makePlayerMove = (
        coordFrom: ISquareCoordinate,
        coordTo: ISquareCoordinate,
        action?: MoveAction
    ) => {
        const result = chessLogicValue!.playerMadeMove(
            coordFrom,
            coordTo,
            action
        );
        if (result.valid) {
            setMoveDone(moveDone * -1);
        } else if (result.message === MoveGenerationMessage.checked) {
            //wiggle the square
            const kingCoords = chessLogicValue!.getKingCoordForPlayer();
            const squareToAnimate = document.querySelector(
                `#id_${kingCoords!.row}_${kingCoords!.column}`
            );
            squareToAnimate!.classList.add("animate-wiggle");
            squareToAnimate!.classList.add("bg-rose-200");
            setTimeout(() => {
                squareToAnimate!.classList.remove("animate-wiggle");
                squareToAnimate!.classList.remove("bg-rose-200");
            }, 500);
        }
    };
    const onDragEndHandler = (e: DragEndEvent) => {
        const coordFrom = e.active.data.current?.squareCoord;
        const coordTo = e.over?.data.current?.squareCoord;
        if (coordFrom && coordTo) {
            //check if user input required
            // currently only in the case of pawn promotion
            /*
                check if pawn promotion
            */
            let checkPromotion =
                chessLogicValue!.checkIfNeedToProvidePawnPromotionOption(
                    coordFrom,
                    coordTo
                );
            if (checkPromotion) {
                checkPromotion = false;
                openModal(
                    <PromotionModal
                        callBack={makePlayerMove}
                        closeModal={closeModal}
                        pieceFrom={coordFrom}
                        pieceTo={coordTo}
                    />
                );
            } else {
                makePlayerMove(coordFrom, coordTo);
            }
        }
    };

    const onPieceClickOnlyHandler = (pieceCoord: ISquareCoordinate) => {
        const squaresForPiece =
            chessLogicValue!.memoizedLegalMovesMap.get(pieceCoord);
    };
    return (
        <>
            <PieceClickContext.Provider value={onPieceClickOnlyHandler}>
                <DndContext onDragEnd={onDragEndHandler} sensors={sensors}>
                    <div className="w-fit h-fit grid grid-cols-8">
                        {displayChessBoard()}
                        {chessLogicValue!.mate ? (
                            <div className="absolute h-screen w-screen bg-slate-100">
                                <h1>Checkmate</h1>
                            </div>
                        ) : null}
                    </div>
                </DndContext>
            </PieceClickContext.Provider>
        </>
    );
};

export default React.memo(Chessboard);

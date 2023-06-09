import React, { useContext, useRef, useState } from "react";
import {
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import { ChessLogicContext } from "@/App";
import ChessSquare from "./ChessSquare";
import {
    ChessSquareColor,
    MoveAction,
    MoveGenerationMessage,
} from "@shared/enums";
import { ISquareCoordinate } from "@shared/types";
import { ModalContext } from "@shared/Contexts/ModalContext";
import PromotionModal from "@shared/Modal/PromotionModal";
import "./Chessboard.css";
import { TurnToPlayContext } from "@shared/Contexts/TurnToPlayContext";
import { _getPieceOnCoord } from "../ChessLogic/ChessLogic";

export const PieceClickContext = React.createContext(
    (pieceCoord: ISquareCoordinate) => {}
);

const Chessboard = () => {
    const [moveDone, setMoveDone] = useState(-1);
    const chessLogicValue = useContext(ChessLogicContext);
    const turnToPlayValue = useContext(TurnToPlayContext);
    const [highlightedSquares, setHighlightedSquares] = useState<Set<string>>(
        new Set()
    );
    const pieceClickedRef = useRef<ISquareCoordinate | undefined>();

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
                let highlighted = false;
                const key = `${row}_${column}`;
                if (highlightedSquares?.has(key)) {
                    highlighted = true;
                }
                arrToReturn[indexCounter] = (
                    <ChessSquare
                        squareColor={color}
                        row={row}
                        column={column}
                        key={`${row}_${column}`}
                        piece={piece}
                        highlighted={highlighted}
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
            turnToPlayValue.toggleTurnToPlay();
            toShowMateModal();
        } else if (result.message === MoveGenerationMessage.checked) {
            //wiggle the square
            const kingCoords = chessLogicValue!.getKingCoordForPlayer();
            const squareToAnimate = document.querySelector(
                `#id_${kingCoords!.row}_${kingCoords!.column}`
            );
            squareToAnimate!.classList.add("animate-wiggle");
            squareToAnimate!.classList.add("bg-red-500");
            squareToAnimate!.classList.add("opacity-80");
            setTimeout(() => {
                squareToAnimate!.classList.remove("animate-wiggle");
                squareToAnimate!.classList.remove("bg-red-500");
                squareToAnimate!.classList.remove("opacity-80");
            }, 5000);
        }
    };

    const handlePlayerProvidedCoord = (
        coordFrom: ISquareCoordinate,
        coordTo: ISquareCoordinate
    ) => {
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
    };
    const onDragEndHandler = (e: DragEndEvent) => {
        const coordFrom = e.active.data.current?.squareCoord;
        const coordTo = e.over?.data.current?.squareCoord;
        if (coordFrom && coordTo) {
            handlePlayerProvidedCoord(coordFrom, coordTo);
        }
    };

    const toShowMateModal = () => {
        if (chessLogicValue!.mate) {
            openModal(
                <h2 className="text-white">
                    {chessLogicValue!.turnToPlay} Sacrificed the KINGGGG!!!!
                </h2>
            );
        } else if (chessLogicValue!.stalemate) {
            openModal(
                <h2 className="text-white">
                    {chessLogicValue!.turnToPlay} Sacrificed the GAMEEEE!!!!
                    Stalemate
                </h2>
            );
        }
    };

    const onSquareClickHandler = (pieceCoord: ISquareCoordinate) => {
        const key = `${pieceCoord.row}_${pieceCoord.column}`;
        const newHighlightedSquares = new Set<string>();
        if (highlightedSquares.size > 0) {
            if (highlightedSquares.has(key)) {
                handlePlayerProvidedCoord(pieceClickedRef.current!, pieceCoord);
            }
            setHighlightedSquares(newHighlightedSquares);
            pieceClickedRef.current = undefined;
        } else {
            const piece = _getPieceOnCoord(
                pieceCoord,
                chessLogicValue!.currentBoard
            );
            if (!piece) {
                return;
            }
            pieceClickedRef.current = pieceCoord;
            const squaresForPiece =
                chessLogicValue!.memoizedLegalMovesMap.get(pieceCoord);
            if (!squaresForPiece) {
                return;
            }
            for (const square of squaresForPiece) {
                const coord = square.coord;
                const key = `${coord.row}_${coord.column}`;
                newHighlightedSquares.add(key);
            }
            setHighlightedSquares(newHighlightedSquares);
        }
    };

    return (
        <>
            <PieceClickContext.Provider value={onSquareClickHandler}>
                <DndContext onDragEnd={onDragEndHandler} sensors={sensors}>
                    <div className="flex justify-center items-center">
                        <div className="w-fit h-fit grid grid-cols-8">
                            {displayChessBoard()}
                        </div>
                    </div>
                </DndContext>
            </PieceClickContext.Provider>
        </>
    );
};

export default Chessboard;

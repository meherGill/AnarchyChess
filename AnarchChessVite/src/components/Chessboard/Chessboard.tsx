import React, { useContext, useState } from "react";
import { ChessLogicContext } from "../../App";
import ChessSquare from "./ChessSquare";
import { ChessSquareColor, MoveAction } from "@shared/enums";
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
        if (result) {
            console.log(chessLogicValue!.currentBoard);
            setMoveDone(moveDone * -1);
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
    return (
        <>
            <DndContext onDragEnd={onDragEndHandler} sensors={sensors}>
                <div className="w-fit h-fit grid grid-cols-8">
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
        </>
    );
};

export default React.memo(Chessboard);

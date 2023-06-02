import { ChessPiecesName, ChessSquareColor } from "@shared/enums";
import React, { MutableRefObject } from "react";
import { IChessPiece } from "@shared/types";
import ChessPiece from "./ChessPieces/ChessPieces";

interface ChessSquarePropsInterface {
    squareColor: ChessSquareColor;
    row: number;
    column: number;
    piece: IChessPiece | null;
    passedOnDragStart(row: number, column: number): void;
    passedOnDragStop(row: number, column: number): void;
}

const ChessSquare = React.forwardRef(
    (
        {
            squareColor,
            piece,
            row,
            column,
            passedOnDragStart,
            passedOnDragStop,
        }: ChessSquarePropsInterface,
        ref: any
    ) => {
        const onDragStartMiddleMan = () => {
            passedOnDragStart(row, column);
        };
        const onDragStopMiddleMan = () => {
            passedOnDragStop(row, column);
        };

        console.count("render");

        const getPieceValueFromIChessPiece = (piece: IChessPiece | null) => {
            if (piece) {
                switch (piece.name) {
                    case ChessPiecesName.blackBishop:
                        return (
                            <ChessPiece
                                onDragStart={onDragStartMiddleMan}
                                onDragStop={onDragStopMiddleMan}
                                toDisplay={"bB"}
                            />
                        );
                    case ChessPiecesName.blackKing:
                        return (
                            <ChessPiece
                                onDragStart={onDragStartMiddleMan}
                                onDragStop={onDragStopMiddleMan}
                                toDisplay={"bK"}
                            />
                        );
                    case ChessPiecesName.blackKnight:
                        return (
                            <ChessPiece
                                onDragStart={onDragStartMiddleMan}
                                onDragStop={onDragStopMiddleMan}
                                toDisplay={"bN"}
                            />
                        );
                    case ChessPiecesName.blackKnook:
                        return (
                            <ChessPiece
                                onDragStart={onDragStartMiddleMan}
                                onDragStop={onDragStopMiddleMan}
                                toDisplay={"Ko"}
                            />
                        );
                    case ChessPiecesName.blackPawn:
                        return (
                            <ChessPiece
                                onDragStart={onDragStartMiddleMan}
                                onDragStop={onDragStopMiddleMan}
                                toDisplay={"bP"}
                            />
                        );
                    case ChessPiecesName.blackQueen:
                        return (
                            <ChessPiece
                                onDragStart={onDragStartMiddleMan}
                                onDragStop={onDragStopMiddleMan}
                                toDisplay={"bQ"}
                            />
                        );
                    case ChessPiecesName.blackRook:
                        return (
                            <ChessPiece
                                onDragStart={onDragStartMiddleMan}
                                onDragStop={onDragStopMiddleMan}
                                toDisplay={"bR"}
                            />
                        );
                    case ChessPiecesName.whiteBishop:
                        return (
                            <ChessPiece
                                onDragStart={onDragStartMiddleMan}
                                onDragStop={onDragStopMiddleMan}
                                toDisplay={"wB"}
                            />
                        );
                    case ChessPiecesName.whiteKing:
                        return (
                            <ChessPiece
                                onDragStart={onDragStartMiddleMan}
                                onDragStop={onDragStopMiddleMan}
                                toDisplay={"wK"}
                            />
                        );
                    case ChessPiecesName.whiteKnight:
                        return (
                            <ChessPiece
                                onDragStart={onDragStartMiddleMan}
                                onDragStop={onDragStopMiddleMan}
                                toDisplay={"wN"}
                            />
                        );
                    case ChessPiecesName.whiteKnook:
                        return (
                            <ChessPiece
                                onDragStart={onDragStartMiddleMan}
                                onDragStop={onDragStopMiddleMan}
                                toDisplay={"Ko"}
                            />
                        );
                    case ChessPiecesName.whitePawn:
                        return (
                            <ChessPiece
                                onDragStart={onDragStartMiddleMan}
                                onDragStop={onDragStopMiddleMan}
                                toDisplay={"wP"}
                            />
                        );
                    case ChessPiecesName.whiteQueen:
                        return (
                            <ChessPiece
                                onDragStart={onDragStartMiddleMan}
                                onDragStop={onDragStopMiddleMan}
                                toDisplay={"wQ"}
                            />
                        );
                    case ChessPiecesName.whiteRook:
                        return (
                            <ChessPiece
                                onDragStart={onDragStartMiddleMan}
                                onDragStop={onDragStopMiddleMan}
                                toDisplay={"wR"}
                            />
                        );
                }
            } else {
                return null;
            }
        };

        let bgToUse: string;
        if (squareColor === ChessSquareColor.dark) {
            bgToUse = "bg-slate-500";
        } else {
            bgToUse = "bg-red-50";
        }

        const onDragEnterSquareHandler = () => {
            ref!.current = { row: row, column: column };
        };

        const handleDragOver = () => {};
        return (
            <div
                className={`${bgToUse} h-20 w-20`}
                onDragEnter={onDragEnterSquareHandler}
            >
                <div className="flex justify-center items-center h-full w-full text-black">
                    {getPieceValueFromIChessPiece(piece)}
                </div>
            </div>
        );
    }
);

export default React.memo(ChessSquare);

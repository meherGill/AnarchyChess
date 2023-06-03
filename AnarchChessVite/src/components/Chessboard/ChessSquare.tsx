import { ChessPiecesName, ChessSquareColor } from "@shared/enums";
import React from "react";
import { IChessPiece } from "@shared/types";
import ChessPiece from "./ChessPieces/ChessPieces";

interface ChessSquarePropsInterface {
    squareColor: ChessSquareColor;
    row: number;
    column: number;
    piece: IChessPiece | null;
}

const ChessSquare = ({
    squareColor,
    piece,
    row,
    column,
}: ChessSquarePropsInterface) => {
    // console.count("render");

    const getPieceValueFromIChessPiece = (piece: IChessPiece | null) => {
        if (piece) {
            switch (piece.name) {
                case ChessPiecesName.blackBishop:
                    return <ChessPiece toDisplay={"bB"} />;
                case ChessPiecesName.blackKing:
                    return <ChessPiece toDisplay={"bK"} />;
                case ChessPiecesName.blackKnight:
                    return <ChessPiece toDisplay={"bN"} />;
                case ChessPiecesName.blackKnook:
                    return <ChessPiece toDisplay={"Ko"} />;
                case ChessPiecesName.blackPawn:
                    return <ChessPiece toDisplay={"bP"} />;
                case ChessPiecesName.blackQueen:
                    return <ChessPiece toDisplay={"bQ"} />;
                case ChessPiecesName.blackRook:
                    return <ChessPiece toDisplay={"bR"} />;
                case ChessPiecesName.whiteBishop:
                    return <ChessPiece toDisplay={"wB"} />;
                case ChessPiecesName.whiteKing:
                    return <ChessPiece toDisplay={"wK"} />;
                case ChessPiecesName.whiteKnight:
                    return <ChessPiece toDisplay={"wN"} />;
                case ChessPiecesName.whiteKnook:
                    return <ChessPiece toDisplay={"Ko"} />;
                case ChessPiecesName.whitePawn:
                    return <ChessPiece toDisplay={"wP"} />;
                case ChessPiecesName.whiteQueen:
                    return <ChessPiece toDisplay={"wQ"} />;
                case ChessPiecesName.whiteRook:
                    return <ChessPiece toDisplay={"wR"} />;
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

    return (
        <div className={`${bgToUse} h-20 w-20`}>
            <div className="flex justify-center items-center h-full w-full text-black">
                {getPieceValueFromIChessPiece(piece)}
            </div>
        </div>
    );
};

export default React.memo(ChessSquare);

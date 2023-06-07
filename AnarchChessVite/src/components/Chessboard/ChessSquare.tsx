import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { ChessPiecesName, ChessSquareColor } from "@shared/enums";
import { IChessPiece, ISquareCoordinate } from "@shared/types";
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

    const { setNodeRef } = useDroppable({
        id: `${row}_${column}`,
        data: {
            squareCoord: { row: row, column: column } as ISquareCoordinate,
        },
    });

    const getPieceValueFromIChessPiece = (piece: IChessPiece | null) => {
        if (piece) {
            return (
                <ChessPiece toDisplay={piece.name} row={row} column={column} />
            );
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
        <div
            ref={setNodeRef}
            className={`${bgToUse} h-20 w-20`}
            onClick={() => console.log("okc")}
        >
            <div className="flex justify-center items-center h-full w-full text-black">
                {getPieceValueFromIChessPiece(piece)}
            </div>
        </div>
    );
};

export default ChessSquare;

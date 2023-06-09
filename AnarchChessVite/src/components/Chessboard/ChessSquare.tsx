import React, { useContext } from "react";
import { useDroppable } from "@dnd-kit/core";
import { ChessSquareColor } from "@shared/enums";
import { IChessPiece, ISquareCoordinate } from "@shared/types";
import ChessPiece from "./ChessPieces/ChessPieces";
import { PieceClickContext } from "./Chessboard";

interface ChessSquarePropsInterface {
    squareColor: ChessSquareColor;
    row: number;
    column: number;
    piece: IChessPiece | null;
    highlighted: boolean;
    ref?: React.Ref<any>;
}

const ChessSquare = ({
    squareColor,
    piece,
    row,
    column,
    highlighted,
}: ChessSquarePropsInterface) => {
    const onClickHandlerFromContext = useContext(PieceClickContext);
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
    const displaySquaresOnClick = () => {
        onClickHandlerFromContext({ row: row, column: column });
    };

    return (
        <div
            ref={setNodeRef}
            className={`${bgToUse} h-[80px] w-[80px]`}
            id={`id_${row}_${column}`}
            onClick={displaySquaresOnClick}
        >
            <div className="h-full w-full text-black">
                <div
                    className={`${
                        highlighted ? "bg-green-500 opacity-40" : ""
                    } h-full w-full flex justify-center items-center `}
                >
                    {getPieceValueFromIChessPiece(piece)}
                </div>
            </div>
        </div>
    );
};

export default ChessSquare;

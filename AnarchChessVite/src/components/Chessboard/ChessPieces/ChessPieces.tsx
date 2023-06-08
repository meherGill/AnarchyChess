import React, { useContext } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ISquareCoordinate } from "@shared/types";
import PieceToImageMapper from "@shared/ChessPiecesMapped";
import { PieceClickContext } from "../Chessboard";

interface ChessPiecePropsInterface {
    toDisplay: any;
    row: number;
    column: number;
}

const ChessPiece = ({ toDisplay, row, column }: ChessPiecePropsInterface) => {
    const onClickHandlerFromContext = useContext(PieceClickContext);
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `${row}_${column}`,
        data: {
            squareCoord: { row: row, column: column } as ISquareCoordinate,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const displaySquaresOnClick = () => {
        onClickHandlerFromContext({ row: row, column: column });
    };
    return (
        <div
            {...attributes}
            {...listeners}
            ref={setNodeRef}
            style={style}
            onClick={displaySquaresOnClick}
        >
            {PieceToImageMapper.get(toDisplay)}
        </div>
    );
};

export default ChessPiece;

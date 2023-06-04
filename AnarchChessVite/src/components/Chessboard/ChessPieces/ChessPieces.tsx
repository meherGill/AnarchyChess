import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { ISquareCoordinate } from "@shared/types";
import PieceToImageMapper from "../../../shared/ChessPiecesMapped";

interface ChessPiecePropsInterface {
    toDisplay: any;
    row: number;
    column: number;
}

const ChessPiece = ({ toDisplay, row, column }: ChessPiecePropsInterface) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `${row}_${column}`,
        data: {
            squareCoord: { row: row, column: column } as ISquareCoordinate,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    // console.count(toDisplay);
    return (
        <div {...attributes} {...listeners} ref={setNodeRef} style={style}>
            {PieceToImageMapper.get(toDisplay)}
        </div>
    );
};

export default ChessPiece;

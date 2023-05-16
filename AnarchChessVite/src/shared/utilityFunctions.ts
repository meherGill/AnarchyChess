import { IChessPiece } from "./types";

export const makeDeepCopyOfPiece = (piece: IChessPiece | null) : IChessPiece | null=> {
    if (piece){
        const copy = {...piece}
        if (piece.lastPosition){
            copy.lastPosition!.row = piece.lastPosition!.row
            copy.lastPosition!.column = piece.lastPosition!.column
        }
        else{
            copy.lastPosition = null
        }
        return copy
    }
    else{
        return null
    }
}

import { ISquareCoordinate } from "./types";

export const areCoordsEqual = (coord1: ISquareCoordinate, coord2: ISquareCoordinate) => {
    return ((coord1.row === coord2.row) && (coord1.column === coord2.column))
}
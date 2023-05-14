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
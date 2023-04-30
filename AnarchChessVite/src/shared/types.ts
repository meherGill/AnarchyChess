import { ChessPiecesName, ForcedMoveType } from "./enums";

export interface ISquareCoordinate {
    row: number;
    column: number;
}

export interface IForcedMove {
    move: Array<ISquareCoordinate>;
    type: ForcedMoveType;
}

export interface IChessPiece {
    name: ChessPiecesName,
    lastPosition: ISquareCoordinate | null,
}
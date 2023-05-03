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

export interface IilVaticanoReturnType {
    ilVaticanoPossible: boolean,
    secondBishopLikeCoords: Array<ISquareCoordinate>
}

export interface IMoveHistory {
    piece: ChessPiecesName,
    from: ISquareCoordinate,
    to: ISquareCoordinate,
}
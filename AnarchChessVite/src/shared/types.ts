import { ChessPiecesName, MoveAction } from "./enums";

export interface ISquareCoordinate {
    row: number;
    column: number;
}
export interface IChessPiece {
    name: ChessPiecesName,
    lastPosition: ISquareCoordinate | null,
}

export interface IGeneratedMoves {
    coord: ISquareCoordinate
    action?: MoveAction | null | undefined
}
export interface IilVaticanoReturnType {
    ilVaticanoPossible: boolean,
    secondBishopLikeCoords: Array<IGeneratedMoves>
}

export interface IMoveHistory {
    piece: ChessPiecesName,
    from: ISquareCoordinate,
    to: ISquareCoordinate,
}

export interface IMove {
    from: ISquareCoordinate,
    to: ISquareCoordinate
}

export interface IMoveType {
    from: ISquareCoordinate,
    to: ISquareCoordinate,
    action: MoveAction
}
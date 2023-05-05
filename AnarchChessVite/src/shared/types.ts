import { ChessPiecesName, ForcedMoveType, MoveAction } from "./enums";

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

export interface IGeneratedMoves {
    coord: ISquareCoordinate
    action?: MoveAction
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

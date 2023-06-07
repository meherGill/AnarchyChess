import { ChessPiecesName } from "@enums";

const normalChessBoard: Array<Array<ChessPiecesName | null>> = [
    [ChessPiecesName.blackRook, ChessPiecesName.blackKnight, ChessPiecesName.blackBishop, ChessPiecesName.blackQueen, ChessPiecesName.blackKing, ChessPiecesName.blackBishop, ChessPiecesName.blackKnight, ChessPiecesName.blackRook],
    [ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn, ChessPiecesName.whitePawn],
    [ChessPiecesName.whiteRook, ChessPiecesName.whiteKnight, ChessPiecesName.whiteBishop, ChessPiecesName.whiteQueen, ChessPiecesName.whiteKing, ChessPiecesName.whiteBishop, ChessPiecesName.whiteKnight, ChessPiecesName.whiteRook]
]

export const configTest =  [
    [null, null, null, null, null, null, ChessPiecesName.blackKing],
    [null, ChessPiecesName.whitePawn, null, null, null, ChessPiecesName.blackPawn, null, null],
    [null, null, null, null, null, null, null, null],
    [ChessPiecesName.whiteBishop, ChessPiecesName.blackPawn, ChessPiecesName.blackPawn, ChessPiecesName.whiteBishop, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [ChessPiecesName.whiteRook, null, null, ChessPiecesName.whiteKing, null, null, null, null],
]

export const configTest2 = [
    [null,null,null,null,ChessPiecesName.blackBishop,null,null,null],
    [null,null,null,ChessPiecesName.whitePawn,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [ChessPiecesName.blackKing,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,ChessPiecesName.blackPawn,null],
    [null,null,null,null,null,ChessPiecesName.whiteBishop,ChessPiecesName.whiteKing,ChessPiecesName.blackKnight],
]

export default normalChessBoard
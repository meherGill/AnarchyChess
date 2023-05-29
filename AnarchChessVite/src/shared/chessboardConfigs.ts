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

export default normalChessBoard
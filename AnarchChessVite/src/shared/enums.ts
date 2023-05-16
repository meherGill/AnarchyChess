export enum ChessSquareColor {
    dark = "DARK",
    light = "LIGHT",
}

export enum PlayerColor {
    black = "BLACK",
    white = "WHITE",
}

export enum ForcedMoveType {
    enPassant = "EN_PASSANT",
    check = "CHECK"
}


export enum TypeOfChessPiece{
   Pawn = `PAWN`,
   Knight = `KNIGHT`,
   King = `KING`,
   Queen = `QUEEN`,
   Knook = `KNOOK`,
   Bishop = `BISHOP`,
   Rook = `ROOK`
}

export enum ChessPiecesName {
    blackPawn = `BLACK_PAWN`,
    blackKnight = `BLACK_KNIGHT`,
    blackBishop = `BLACK_BISHOP`,
    blackRook = `BLACK_ROOK`,
    blackQueen = `BLACK_QUEEN`,
    blackKing = `BLACK_KING`,
    blackKnook = `BLACK_KNOOK`,
    whitePawn = `WHITE_PAWN`,
    whiteKnight = `WHITE_KNIGHT`,
    whiteBishop = `WHITE_BISHOP`,
    whiteRook = `WHITE_ROOK`,
    whiteQueen = `WHITE_QUEEN`,
    whiteKing = `WHITE_KING`,
    whiteKnook = `WHITE_KNOOK`,
}

export enum MoveAction{
    enPassant = `EN_PASSANT`,
    horizontalCastling = `HORIZONTAL_CASTLING`,
    ilVaticano = `IL_VATICANO`,
    knightBoost = `KNIGHT_BOOST`
}
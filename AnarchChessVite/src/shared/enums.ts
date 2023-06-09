export enum ChessSquareColor {
    dark = "1",
    light = "-1",
}

export enum PlayerColor {
    black = "BLACK",
    white = "WHITE",
}

export enum ForcedMoveType {
    enPassant = "EN_PASSANT",
    check = "CHECK"
}

/* IMPORTANT::::
IF ANY NEW PIECES ARE ADDED HERE THEN donr forget to update
checkForCheck.ts aswell.
*/
export enum TypeOfChessPiece{
   Pawn = `PAWN`,
   Knight = `KNIGHT`,
   King = `KING`,
   Queen = `QUEEN`,
   Knook = `KNOOK`,
   Bishop = `BISHOP`,
   Rook = `ROOK`,
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
    knightBoost = `KNIGHT_BOOST`,
    verticalCastling = `VERTICAL_CASTLING`,
    pawnPromotionKnook = `PAWN_PROMOTION_KNOOK`,
    pawnPromotionBishop = `PAWN_PROMOTION_BISHOP`,
    pawnPromotionQueen = `PAWN_PROMOTION_QUEEN`,
    pawnPromotionRook = `PAWN_PROMOTION_ROOK`,
}

export enum MoveGenerationMessage{
    checked = `King in check`,
    aForcedMoveAvailable = `Forced move available`,
    pieceCantGoThere = `Not a valid move`,
    notYourTurnMate = `Not your turn mate`
}
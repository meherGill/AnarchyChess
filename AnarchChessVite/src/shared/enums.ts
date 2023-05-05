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
    blackPawn = `${PlayerColor.black}_${TypeOfChessPiece.Pawn}`,
    blackKnight = `${PlayerColor.black}_${TypeOfChessPiece.Knight}`,
    blackBishop = `${PlayerColor.black}_${TypeOfChessPiece.Bishop}`,
    blackRook = `${PlayerColor.black}_${TypeOfChessPiece.Rook}`,
    blackQueen = `${PlayerColor.black}_${TypeOfChessPiece.Queen}`,
    blackKing = `${PlayerColor.black}_${TypeOfChessPiece.King}`,
    blackKnook = `${PlayerColor.black}_${TypeOfChessPiece.Knook}`,
    whitePawn = `${PlayerColor.white}_${TypeOfChessPiece.Pawn}`,
    whiteKnight = `${PlayerColor.white}_${TypeOfChessPiece.Knight}`,
    whiteBishop = `${PlayerColor.white}_${TypeOfChessPiece.Bishop}`,
    whiteRook = `${PlayerColor.white}_${TypeOfChessPiece.Rook}`,
    whiteQueen = `${PlayerColor.white}_${TypeOfChessPiece.Queen}`,
    whiteKing = `${PlayerColor.white}_${TypeOfChessPiece.King}`,
    whiteKnook = `${PlayerColor.white}_${TypeOfChessPiece.Knook}`,
}

export enum MoveAction{
    enPassant = `EN_PASSANT`,
    castling = `CASTLING`,
    ilVaticano = `IL_VATICANO`,
    knightBoost = `KNIGHT_BOOST`
}
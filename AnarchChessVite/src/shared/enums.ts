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
   pawn = `PAWN`,
   knight = `KNIGHT`,
   king = `KING`,
   queen = `QUEEN`,
   knook = `KNOOK`,
   bishop = `BISHOP`,
   rook = `ROOK`
    
}

export enum ChessPiecesName {
    blackPawn = `${PlayerColor.black}_${TypeOfChessPiece.pawn}`,
    blackKnight = `${PlayerColor.black}_${TypeOfChessPiece.knight}`,
    blackBishop = `${PlayerColor.black}_${TypeOfChessPiece.bishop}`,
    blackRook = `${PlayerColor.black}_${TypeOfChessPiece.rook}`,
    blackQueen = `${PlayerColor.black}_${TypeOfChessPiece.queen}`,
    blackKing = `${PlayerColor.black}_${TypeOfChessPiece.king}`,
    blackKnook = `${PlayerColor.black}_${TypeOfChessPiece.knook}`,
    whitePawn = `${PlayerColor.white}_${TypeOfChessPiece.pawn}`,
    whiteKnight = `${PlayerColor.white}_${TypeOfChessPiece.knight}`,
    whiteBishop = `${PlayerColor.white}_${TypeOfChessPiece.bishop}`,
    whiteRook = `${PlayerColor.white}_${TypeOfChessPiece.rook}`,
    whiteQueen = `${PlayerColor.white}_${TypeOfChessPiece.queen}`,
    whiteKing = `${PlayerColor.white}_${TypeOfChessPiece.king}`,
    whiteKnook = `${PlayerColor.white}_${TypeOfChessPiece.knook}`,
}


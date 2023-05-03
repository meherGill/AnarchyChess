import { IChessPiece, ISquareCoordinate, IilVaticanoReturnType } from "@shared/types";
import { checkIfCoordInBound, returnColorOfPiece, returnPieceOnCoord, returnTypeAndColorOfPiece } from "./ChessLogic";
import { ChessPiecesName, PlayerColor } from "@enums";
import { knightLikeMoves, rookLikeMoves, vanillaBishopLikeMoves } from "./moveGeneratingFunctions";

const rookMovesForCheck = rookLikeMoves;
const bishopMovesForCheck = vanillaBishopLikeMoves;
const knightMovesForCheck = knightLikeMoves;
//knook and queen are already handled by combination of rook , bishop and knight hence no need to add that

const checkIfKingsAreInCheck = (whiteKingPosition: ISquareCoordinate, blackKingPosition: ISquareCoordinate) => {
    
}